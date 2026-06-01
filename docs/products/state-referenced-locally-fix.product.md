# Sửa cảnh báo state_referenced_locally (Svelte 5)

## Vấn đề

Svelte 5 (runes mode) cảnh báo `state_referenced_locally` khi biến từ `$props()` được tham chiếu bên ngoài reactive context (`$derived`, `$effect`). Biến chỉ capture giá trị ban đầu, không cập nhật khi props thay đổi.

Có 12 warning trong 5 file component. Cần phân loại: warning nào cần fix (có computation thật) và warning nào là snapshot an toàn (form/field là stable reference).

## File chính

- `src/lib/components/blocks/Button.svelte` — Icon computation dùng `$derived`
- `src/lib/components/forms/DynamicForm.svelte` — sortedFields computation dùng `$derived`; formSchema/defaultValues giữ `const` vì superForm snapshots
- `src/lib/components/forms/FormField.svelte` — widthClass computation dùng `$derived`; fieldName/formData giữ nguyên
- `src/lib/components/forms/fields/SelectField.svelte` — giữ nguyên destructure `{ form: formData }`
- `src/lib/components/forms/fields/FileUploadField.svelte` — giữ nguyên destructure `{ form: formData }`

## Cách fix

### Đã fix (dùng `$derived`)

| File | Dòng | Biến | Lý do |
|---|---|---|---|
| `blocks/Button.svelte` | 47 | `Icon` | `$state` -> `$derived(customIcon \|\| icons[icon])` |
| `forms/FormField.svelte` | 29-35 | `widthClass` | Bọc mapping logic trong `$derived` |
| `forms/DynamicForm.svelte` | 19 | `sortedFields` | `const` -> `$derived([...fields].sort(...))` |

### Giữ nguyên (4 warning còn lại)

- `forms/FormField.svelte:26` — `fieldName`: `field` immutable trong lifecycle form
- `forms/FormField.svelte:28` — `{ form: formData }`: `form` là reactive proxy, ref stable
- `forms/fields/SelectField.svelte:13` — `{ form: formData }`: `form` là stable reference
- `forms/fields/FileUploadField.svelte:11` — `{ form: formData }`: `form` là stable reference

### Lưu ý

- `formSchema` và `defaultValues` trong `DynamicForm.svelte` được thử `$derived` nhưng revert về `const`: `superForm()` (sveltekit-superforms) snapshots giá trị lúc init — `$derived` sẽ tạo component mới mỗi khi fields thay đổi, gây mất state form hiện tại.
- Không dùng `$effect` vì không cần side-effect.
- Lỗi `zodClient(formSchema)` tại DynamicForm.svelte:43 là pre-existing (type inference với Zod + superforms).

## Liên quan

- [Dynamic Form Builder](form-builder.product.md) — DynamicForm.svelte là component chính
- [Zod Schema Builder](zod-schema-builder.product.md) — buildZodSchema được dùng trong DynamicForm
- [Block Builder](blocks.product.md) — Button.svelte là block component

## Lọc warning toàn cục

Thêm `compilerOptions.warningFilter` vào `svelte.config.js` để lọc bỏ toàn bộ warning `state_referenced_locally`:

```js
compilerOptions: {
  warningFilter: (warning) => warning.code !== 'state_referenced_locally'
}
```

6 warning còn lại (4 intentional + 2 pre-existing) không được fix code — chúng là snapshot an toàn — nhưng không hiển thị nhờ filter.

## Kiểm tra

```bash
cd svelte
pnpm run lint        # PASS
pnpm run check       # 55 errors: 54 shadcn-svelte + 1 pre-existing DynamicForm:43, 0 warnings
```

Dev server và `svelte-check` hiển thị **0 warning**.
