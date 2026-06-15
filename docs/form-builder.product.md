# Dynamic Form Builder + Submission

Tính năng này cho phép tạo form động trong Directus và hiển thị ra ngoài frontend, kèm theo validation và API gửi dữ liệu.

## File chính

- `src/lib/components/blocks/Form.svelte` -- block form hiển thị trên trang
- `src/lib/components/forms/DynamicForm.svelte` -- component form chính
- `src/lib/components/forms/FormBuilder.svelte` -- xây dựng cấu trúc form
- `src/lib/components/forms/FormField.svelte` -- render từng field
- `src/lib/components/forms/fields/` -- các field components: `CheckBoxGroupField`, `FileUploadField`, `RadioGroup`, `SelectField`
- `src/lib/zodSchemaBuilder.ts` -- xây dựng Zod schema từ cấu hình form
- `src/routes/api/forms/submit/+server.ts` -- API nhận dữ liệu form

## Cách dùng

Trong Directus:
1. Tạo form trong collection `block_form` với các field: name, type, label, placeholder, validation, required, choices (cho radio/select), v.v.
2. Thêm block Form vào page qua giao diện Directus

Trên frontend:
- Block Form tự động render form với đầy đủ field
- Validation chạy qua Zod trước khi gửi
- Khi submit, dữ liệu được gửi đến `POST /api/forms/submit`

API submit:
- Nhận FormData gồm `formId`, `fields` (JSON), và các giá trị field
- Tự động upload file nếu field có file đính kèm
- Lưu kết quả vào collection `form_submissions` trong Directus

## Liên quan

- [Zod Schema Builder](zod-schema-builder.product.md) -- cung cấp validation schema
- [Block Builder](blocks.product.md) -- Form là một block trong hệ thống blocks

## Lưu ý

- Yêu cầu `DIRECTUS_SERVER_TOKEN` cho API submit
- File upload sử dụng `uploadFiles` từ Directus SDK
- Hỗ trợ tùy chỉnh: submit label, success message, redirect sau khi submit
