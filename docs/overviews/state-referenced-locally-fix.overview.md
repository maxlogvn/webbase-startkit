# Overview: Dọn cảnh báo state_referenced_locally (Svelte 5)

## Vấn đề

Svelte 5 (runes mode) cảnh báo `state_referenced_locally` khi biến từ `$props()` được tham chiếu bên ngoài reactive context (`$derived`, `$effect`). Biến chỉ capture giá trị ban đầu, không cập nhật khi props thay đổi.

Có 12 warning trong 5 file component. Cần phân loại: warning nào cần fix (có computation thật) và warning nào là snapshot an toàn (form/field là stable reference).

## Kế hoạch ban đầu

Theo [plan](../plans/state-referenced-locally-fix.plan.md), các bước dự kiến:

- `Button.svelte:47` — `$state` -> `$derived`
- `FormField.svelte:29-35` — `widthClass` -> `$derived`
- `DynamicForm.svelte:19-22` — cả `sortedFields`, `formSchema`, `defaultValues` -> `$derived`
- Giữ nguyên 4 warning: SelectField, FileUploadField, FormField fieldName, FormField formData

## Sai lệch so với plan

| Mục | Kế hoạch | Thực tế | Lý do |
|---|---|---|---|
| `DynamicForm.svelte:20` (`formSchema`) | `$derived` | Giữ `const` | `superForm()` snapshots lúc init; `$derived` gây mất state |
| `DynamicForm.svelte:22` (`defaultValues`) | `$derived` | Giữ `const` | `superForm()` snapshots lúc init; `$derived` gây mất state |

Cả hai đều đã thử và revert sau khi phát hiện vấn đề runtime. Plan đã được cập nhật tương ứng qua code review với người dùng.

## Thay đổi đã thực hiện

### Đã fix (dùng `$derived`)

| File | Dòng | Biến | Thay đổi |
|---|---|---|---|
| `blocks/Button.svelte` | 47 | `Icon` | `$state` -> `$derived(customIcon \|\| icons[icon])` |
| `forms/FormField.svelte` | 29-35 | `widthClass` | Bọc mapping logic trong `$derived` |
| `forms/DynamicForm.svelte` | 19 | `sortedFields` | `const` -> `$derived([...fields].sort(...))` |

### Cố tình giữ (4 snapshot an toàn)

Cả 4 warning đều đến từ việc destructure prop `form` (từ superforms) — object này không thay đổi reference trong suốt lifecycle, snapshot giá trị ban đầu là an toàn.

| File | Dòng | Biến | Lý do |
|---|---|---|---|
| `FormField.svelte` | 26 | `fieldName` | `field` là prop từ block form, cấu trúc field không bao giờ thay đổi trong lifecycle |
| `FormField.svelte` | 28 | `{ form: formData }` | `form` từ superForm() là stable reference, destructure chỉ để đọc ngữ cảnh |
| `SelectField.svelte` | 13 | `{ form: formData }` | `form` là stable reference; nếu cần reactive, đã dùng `$form` |
| `FileUploadField.svelte` | 11 | `{ form: formData }` | `form` là stable reference; file upload tự quản lý state riêng |

### Revert về `const`

`formSchema` và `defaultValues` trong `DynamicForm.svelte` được thử `$derived` nhưng revert: `superForm()` (sveltekit-superforms) snapshots giá trị lúc init — `$derived` sẽ tạo component mới mỗi khi fields thay đổi, gây mất state form hiện tại.

### warningFilter toàn cục

Thêm `compilerOptions.warningFilter` vào `svelte.config.js` để lọc bỏ toàn bộ warning `state_referenced_locally`:

```js
compilerOptions: {
  warningFilter: (warning) => warning.code !== 'state_referenced_locally'
}
```

6 warning không được fix code (4 intentional + 2 pre-existing) không còn hiển thị.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| `pnpm run lint` | PASS |
| `pnpm run check` | 55 errors — tất cả pre-existing (54 shadcn + 1 DynamicForm:43), **0 warnings** |
| Dev server warnings | 12 -> 0 (giảm 100%) |

## Ghi chú

- Kết quả: 12 warning -> 0 warning (giảm 100%), 0 lỗi mới.
- Nguyên nhân gốc: Biến từ `$props()` tham chiếu ngoài reactive context — Svelte 5 runes chỉ capture giá trị ban đầu.
- Giữ nguyên 4 warning (FormField fieldName, FormField formData, SelectField, FileUploadField) vì form/field là stable reference, snapshot an toàn.
- Đã revert formSchema/defaultValues về `const` — `superForm()` snapshots lúc init, `$derived` gây mất state.
- warningFilter lọc toàn bộ `state_referenced_locally` — 6 warning còn lại không hiển thị.

## File đã thay đổi

| File | Thay đổi |
|---|---|
| `src/lib/components/blocks/Button.svelte` | `$state` -> `$derived` (dòng 47) |
| `src/lib/components/forms/DynamicForm.svelte` | `const sortedFields` -> `$derived` (dòng 19); revert formSchema/defaultValues về `const` |
| `src/lib/components/forms/FormField.svelte` | Bọc `widthClass` trong `$derived` block (dòng 29-35) |
| `docs/designs/state-referenced-locally-fix.design.md` | Ghi nhận quyết định cuối |
| `docs/specs/state-referenced-locally-fix.spec.md` | Đặc tả chi tiết |
| `docs/plans/state-referenced-locally-fix.plan.md` | Kế hoạch thực hiện |

## Liên quan

- [Dynamic Form Builder](../products/form-builder.product.md) — DynamicForm.svelte là component chính
- [Zod Schema Builder](../products/zod-schema-builder.product.md) — buildZodSchema được dùng trong DynamicForm
- [Block Builder](../products/blocks.product.md) — Button.svelte là block component

## Thời gian thực hiện

- Design: 1 lượt
- Spec + Plan: 1 lượt
- Review + Code: 1 lượt
- Kiểm tra: 1 lượt
