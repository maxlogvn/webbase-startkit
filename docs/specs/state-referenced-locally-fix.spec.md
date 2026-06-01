# Spec: Dọn cảnh báo state_referenced_locally (Svelte 5)

## Mục tiêu

Giảm 12 cảnh báo `state_referenced_locally` trên terminal xuống 0, bằng cách dùng `$derived` ở nơi có computation thật và lọc số còn lại qua `warningFilter`. 6 warning không fix code là snapshot an toàn (form/field stable reference, superForm yêu cầu snapshot tĩnh).

## Yêu cầu

1. Giảm cảnh báo `state_referenced_locally` từ 12 xuống 0.
2. Giao diện và hành vi app không thay đổi.
3. Pass lint và type-check như cũ.

## File nào cần sửa?

### Có sửa (dùng `$derived`)

| File | Dòng | Biến | Lý do |
|---|---|---|---|
| `blocks/Button.svelte` | 47 | `Icon` | computation (||) |
| `forms/DynamicForm.svelte` | 19 | `sortedFields` | computation (sort) |
| `forms/FormField.svelte` | 29-35 | `widthClass` | computation (mapping width->class) |

### Không sửa (giữ nguyên, warning bị lọc qua warningFilter)

| File | Dòng | Biến | Lý do |
|---|---|---|---|
| `forms/FormField.svelte` | 26 | `fieldName` | field immutable, snapshot safe |
| `forms/FormField.svelte` | 28 | `formData` | form là reactive proxy, ref stable |
| `forms/fields/SelectField.svelte` | 13 | `formData` | form là reactive proxy, ref stable |
| `forms/fields/FileUploadField.svelte` | 11 | `formData` | form là reactive proxy, ref stable |
| `forms/DynamicForm.svelte` | 20 | `formSchema` | đã thử `$derived` nhưng revert — superForm yêu cầu snapshot tĩnh |
| `forms/DynamicForm.svelte` | 22 | `defaultValues` | đã thử `$derived` nhưng revert — superForm yêu cầu snapshot tĩnh |

## Cách kiểm tra

1. `pnpm run lint` — không lỗi mới.
2. `pnpm run check` — không lỗi mới (bỏ qua ~54 lỗi shadcn-svelte cũ).
3. `editor` / `svelte-check` — 0 warning `state_referenced_locally`.
