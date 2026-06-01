# Overview: Dọn cảnh báo state_referenced_locally (Svelte 5)

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

## Thay đổi bổ sung: warningFilter toàn cục

Theo yêu cầu của người dùng, thêm `compilerOptions.warningFilter` vào `svelte.config.js` để lọc bỏ toàn bộ warning `state_referenced_locally` trên toàn project. 6 warning không được fix code (snapshot an toàn) nhưng không còn hiển thị.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| `pnpm run lint` | PASS |
| `pnpm run check` | 55 errors — tất cả pre-existing (54 shadcn + 1 DynamicForm:43), **0 warnings** |
| Dev server warnings | 12 -> 0 (giảm 100%) |

## Warnings còn lại (6)

### 4 intentional — cố tình giữ (snapshot an toàn)

| File | Dòng | Biến | Tại sao giữ warning? |
|---|---|---|---|
| `FormField.svelte` | 26 | `fieldName` | `field` là prop từ block form. Trong lifecycle của một form, cấu trúc field (tên, type, validation) **không bao giờ thay đổi** — chỉ giá trị nhập vào thay đổi qua `form`. Snapshot `field.name` lúc mount là an toàn, không cần `$derived`. |
| `FormField.svelte` | 28 | `{ form: formData }` | `form` là reactive proxy từ `superForm()`. Bản thân object `form` là stable reference — nó được tạo một lần và tồn tại suốt vòng đời form. Destructure `formData` chỉ để đọc ngữ cảnh, không cần theo dõi thay đổi. |
| `SelectField.svelte` | 13 | `{ form: formData }` | Giống FormField: `form` từ `superForm()` là stable reference. Destructure chỉ để lấy `formData` (giá trị hiện tại). Nếu cần reactive, SelectField đã dùng `$form` từ superforms. |
| `FileUploadField.svelte` | 11 | `{ form: formData }` | Giống SelectField: `form` là stable reference. Snapshot `formData` lúc mount là đủ vì file upload field tự quản lý state riêng. |

Kết luận: Cả 4 warning này đều đến từ việc **destructure prop `form` (từ superforms)** — object này không thay đổi reference trong suốt lifecycle, nên snapshot giá trị ban đầu là hoàn toàn an toàn. Sửa chúng bằng `$derived` sẽ thêm code vô ích mà không cải thiện hành vi runtime.

### 2 pre-existing — có từ trước, không do fix này

| File | Dòng | Biến | Tại sao còn warning? |
|---|---|---|---|
| `DynamicForm.svelte` | 20 | `formSchema` | `buildZodSchema(fields)` dùng `fields` từ `$props()`. Đã thử chuyển thành `$derived` nhưng **phải revert**: `superForm()` snapshots schema lúc init, nếu schema thay đổi theo fields thì form sẽ bị tạo lại, mất dữ liệu nhập hiện tại. Giữ `const` là lựa chọn đúng. |
| `DynamicForm.svelte` | 22 | `defaultValues` | `fields.reduce(...)` dùng `fields` từ `$props()`. Lý do giống formSchema: `superForm()` snapshots defaultValues lúc init. Revert về `const` sau khi thử `$derived`. |

Cả 2 warning này đều là **hệ quả của thiết kế superforms**: form schema và default values phải là snapshot tĩnh tại thời điểm khởi tạo. `$derived` về mặt kỹ thuật đúng (fields không đổi trong lifecycle), nhưng nếu dùng sẽ tạo ấn tượng sai về ý đồ — như thể schema có thể thay đổi, trong khi thực tế không thể.

## Thời gian thực hiện

- Design: 1 lượt
- Spec + Plan: 1 lượt
- Review + Code: 1 lượt
- Kiểm tra: 1 lượt

## File đã thay đổi

| File | Thay đổi |
|---|---|
| `src/lib/components/blocks/Button.svelte` | `$state` -> `$derived` (dòng 47) |
| `src/lib/components/forms/DynamicForm.svelte` | `const sortedFields` -> `$derived` (dòng 19); revert formSchema/defaultValues về `const` |
| `src/lib/components/forms/FormField.svelte` | Bọc `widthClass` trong `$derived` block (dòng 29-35) |
| `docs/designs/state-referenced-locally-fix.design.md` | Ghi nhận quyết định cuối |
| `docs/specs/state-referenced-locally-fix.spec.md` | Đặc tả chi tiết |
| `docs/plans/state-referenced-locally-fix.plan.md` | Kế hoạch thực hiện |
