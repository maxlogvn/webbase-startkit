# Zod Schema Builder

Tính năng này xây dựng schema validation động từ cấu hình form trong Directus, dùng thư viện Zod.

## File chính

- `src/lib/zodSchemaBuilder.ts` -- hàm `buildZodSchema()` xây dựng schema từ cấu hình form

## Cách dùng

Hàm `buildZodSchema(fields)` nhận mảng các field từ Directus (collection `block_form`) và trả về một Zod schema.

Field types hỗ trợ:
- `text` -- `z.string()`
- `checkbox` -- `z.boolean()`
- `checkbox_group` -- `z.array(z.string())`
- `radio` -- `z.string()`
- `file` -- `z.instanceof(File)`

Validation rules cấu hình trong Directus dạng chuỗi, ví dụ: `email|min:8|max:100`. Các rule hỗ trợ:
- `email` -- kiểm tra định dạng email
- `url` -- kiểm tra định dạng URL
- `min: N` -- tối thiểu N ký tự
- `max: N` -- tối đa N ký tự
- `length: N` -- chính xác N ký tự

## Liên quan

- [Dynamic Form Builder](form-builder.overview.md) -- schema này được dùng trong `DynamicForm.svelte` để validate dữ liệu nhập
- [Type Generation](type-generation.overview.md) -- dùng types từ `directus-schema.ts` cho `FormField` type

## Lưu ý

- Nếu field `required = true`, string sẽ được validate bằng `nonempty()`
- Nếu field không required, cho phép chuỗi rỗng hoặc `undefined`
