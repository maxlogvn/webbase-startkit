# Redirect Handling

Tính năng này tự động chuyển hướng URL dựa trên danh sách redirect được cấu hình trong Directus.

## File chính

- `src/hooks.server.ts` -- server hook kiểm tra redirect cho mọi request đến
- `src/lib/directus/fetchRedirects.ts` -- hàm tải danh sách redirect từ Directus

## Cách dùng

Thêm redirect trong Directus collection `redirects` với các field:
- `url_from` -- đường dẫn gốc (ví dụ: `/trang-cu`)
- `url_to` -- đường dẫn đích (ví dụ: `/trang-moi`)
- `response_code` -- `301` (chuyển vĩnh viễn) hoặc `302` (tạm thời)

Khi server khởi động, tự động tải toàn bộ danh sách redirect. Mỗi request đến được kiểm tra: nếu URL khớp với `url_from`, server trả về chuyển hướng tương ứng.

## Liên quan

- [Routing](../overviews/routing.overview.md) -- redirect ảnh hưởng đến cách URL được resolve
- [Directus SDK Client](directus-sdk-client.overview.md) -- dùng client riêng (không rate limit) khi fetch redirects

## Lưu ý

- Chỉ so sánh đường dẫn chính xác (không hỗ trợ pattern như `/blog/*`)
- Mặc định là 301 nếu không cấu hình `response_code`
- Danh sách redirect được lưu trong memory suốt vòng đời server -- cần restart server để cập nhật
- Strips trailing slash trước khi so sánh (ví dụ: `/about/` khớp với `/about`)
