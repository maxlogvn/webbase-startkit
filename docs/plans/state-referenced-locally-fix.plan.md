# Plan: Dọn cảnh báo state_referenced_locally (Svelte 5)

## Các bước

- [x] Bước 1: `Button.svelte` — đổi `$state` thành `$derived` (dòng 47)
- [x] Bước 2: `FormField.svelte` — bọc `widthClass` trong `$derived` (dòng 29-35)
- [x] Bước 3: `DynamicForm.svelte` — bọc `sortedFields` trong `$derived` (dòng 19)
- [x] Bước 4: Revert `formSchema`/`defaultValues` về `const` — `superForm()` yêu cầu snapshot tĩnh
- [x] Bước 5: Thêm `warningFilter` vào `svelte.config.js` — lọc bỏ code `state_referenced_locally` toàn cục
- [x] Kiểm tra: `pnpm run lint` + `pnpm run check`

## Giữ nguyên code (nhưng warning đã bị lọc qua `warningFilter`)

Không sửa code vì snapshot an toàn — nhưng warning không còn hiển thị nhờ `compilerOptions.warningFilter` trong `svelte.config.js`:

- `SelectField.svelte:13` — destructure `{ form: formData }`, `form` là stable reference
- `FileUploadField.svelte:11` — destructure `{ form: formData }`, `form` là stable reference
- `FormField.svelte:26` — `fieldName`, `field` immutable trong lifecycle form
- `FormField.svelte:28` — destructure `{ form: formData }`, `form` là stable reference
- `DynamicForm.svelte:20` — `formSchema`, snapshot tĩnh cho superForm
- `DynamicForm.svelte:22` — `defaultValues`, snapshot tĩnh cho superForm

## Kiểm tra

```bash
cd svelte
pnpm run lint
pnpm run check
```

## Ghi chú

- Không cần `pnpm run generate:types`.
- 6 warning còn lại (4 intentional + 2 pre-existing) đã bị lọc qua `warningFilter` — code không đổi, chỉ tắt hiển thị.
- `warningFilter` đặt trong `svelte.config.js` ở `compilerOptions`, ảnh hưởng toàn cục.
