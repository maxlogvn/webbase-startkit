# Draft / Preview Mode

Tính năng này cho phép xem nội dung nháp (draft) hoặc một phiên bản cụ thể (versioning) trực tiếp trên frontend trước khi xuất bản.

## File chính

- `src/routes/[...permalink]/+page.server.ts` -- xử lý preview cho trang CMS
- `src/routes/blog/[slug]/+page.server.ts` -- xử lý preview cho blog

## Cách dùng

Thêm query params vào URL trang:

- `?preview=true` -- xem bản nháp (draft)
- `?version=X&id=Y` -- xem phiên bản cụ thể của trang

Khi dùng `?preview=true`, server tự động inject token `DIRECTUS_SERVER_TOKEN` (từ biến môi trường) để bypass filter `status = published`.

Khi dùng `?version=X&id=Y`, server gọi Directus versioned read API để lấy nội dung theo phiên bản. Nếu chỉ có `?version` mà không có `id`, server tự động tìm ID qua permalink hoặc slug.

## Liên quan

- [Directus SDK Client](directus-sdk-client.overview.md) -- cung cấp `withToken` để thêm token vào request preview
- [Directus Visual Editor](visual-editing.overview.md) -- live preview của Visual Editor dùng chung cơ chế này

## Lưu ý

- Yêu cầu biến môi trường `DIRECTUS_SERVER_TOKEN` trong file `.env` (private, không public)
- Không dùng `?preview=true` trên production nếu chưa cấu hình đúng token
- Version `main` tự động bỏ qua vì đó là version mặc định
