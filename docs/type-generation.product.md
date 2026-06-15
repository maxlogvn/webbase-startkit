# Type Generation từ Directus Schema

Tính năng này tự động sinh TypeScript types từ cấu trúc collection trong Directus, giúp code có type safety khi làm việc với dữ liệu.

## File chính

- `src/lib/directus/generateDirectusTypes.ts` -- script sinh types
- `src/lib/types/directus-schema.ts` -- file output (tự động sinh, không sửa tay)

## Cách dùng

Chạy lệnh trong thư mục `svelte/`:

```bash
pnpm run generate:types
```

Script yêu cầu `DIRECTUS_ADMIN_TOKEN` (hoặc sẽ hỏi nhập tay khi chạy). Nó kết nối đến Directus, đọc schema, và sinh ra file `directus-schema.ts`.

Sau khi sinh, script tự động:
- Thêm `// @ts-nocheck` và disclaimer vào đầu file
- Biến `FormSubmissionValue.id` thành optional (cho phép tạo submission mới)

## Liên quan

- [Directus SDK Client](directus-sdk-client.product.md) -- types được dùng trong client và fetchers
- [Zod Schema Builder](zod-schema-builder.product.md) -- dùng types từ schema cho validation

## Lưu ý

- Yêu cầu biến môi trường `DIRECTUS_ADMIN_TOKEN` (hoặc nhập tay khi chạy). Không dùng token này ở runtime, chỉ dùng để sinh types
- Script đọc biến `PUBLIC_DIRECTUS_URL` từ `.env` (dùng thư viện `dotenv`)
- Output ghi đè file `src/lib/types/directus-schema.ts`
