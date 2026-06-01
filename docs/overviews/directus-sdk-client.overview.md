# Directus SDK Client

Tính năng này tạo một client kết nối đến Directus API với cơ chế tự động giới hạn tốc độ request, tránh làm quá tải server Directus.

## File chính

- `src/lib/directus/directus.ts` -- định nghĩa client, rate limiting, retry logic, và export các function SDK

## Cách dùng

Import `useDirectus()` từ `$lib/directus/directus.ts`. Nó trả về object gồm:

- `getDirectus()` -- tạo instance Directus client
- `readItems`, `readItem`, `readSingleton`, `readUser` -- đọc dữ liệu
- `createItem`, `uploadFiles` -- ghi dữ liệu
- `withToken` -- thêm token vào request (dùng cho preview/draft)

```ts
import { useDirectus } from '$lib/directus/directus';
const { getDirectus, readItems } = useDirectus();
const directus = getDirectus();
const pages = await directus.request(readItems('pages', { ... }));
```

Client tự động phát hiện môi trường: dùng `fetch` của server (SvelteKit) khi chạy server-side, dùng `fetch` của browser khi chạy client-side.

## Liên quan

- [Draft / Preview Mode](draft-preview.overview.md) -- dùng `withToken` để xem nội dung nháp
- [Type Generation](type-generation.overview.md) -- types cho schema được dùng trong client

## Lưu ý

- Giới hạn tối đa 10 request mỗi 500ms nhờ thư viện `p-queue`
- Nếu gặp lỗi HTTP 429 (too many requests), tự động thử lại tối đa 3 lần, mỗi lần cách nhau 500ms
- Client không có đăng nhập -- là "stateless", chỉ thêm token qua `withToken` khi cần (draft/preview)
