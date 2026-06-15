# Blog System

Tính năng này cung cấp hệ thống blog đầy đủ với route riêng, bài viết liên quan, thông tin tác giả, SEO, và chia sẻ mạng xã hội.

## File chính

- `src/routes/blog/[slug]/+page.server.ts` -- server load: fetch post, author, related posts, Open Graph
- `src/routes/blog/[slug]/+page.svelte` -- giao diện blog: hiển thị bài viết, author card, related posts, ShareDialog
- `src/lib/components/ui/ShareDialog.svelte` -- dialog chia sẻ lên mạng xã hội
- `src/lib/directus/fetchers.ts` -- các hàm fetch: `fetchPostBySlug`, `fetchPostByIdAndVersion`, `fetchPaginatedPosts`, `fetchTotalPostCount`, `fetchRelatedPosts`, `fetchAuthorById`

## Cách dùng

Blog hoạt động qua route `blog/[slug]`, nơi `slug` là đường dẫn thân thiện của bài viết.

Mỗi bài viết trong Directus collection `posts` có:
- `title`, `slug`, `content`, `description` -- nội dung cơ bản
- `image` -- ảnh đại diện
- `author` -- liên kết đến tài khoản Directus user (hiển thị avatar, tên)
- `seo` -- title và meta description riêng
- `status` -- published / draft

Tính năng đi kèm:
- **Related posts:** 2 bài viết khác được chọn ngẫu nhiên
- **Open Graph:** title, description, image, type:article cho chia sẻ Facebook/Zalo
- **ShareDialog:** nút chia sẻ link bài viết
- **Pagination:** component phân trang (shadcn) cho danh sách blog

## Liên quan

- [Draft / Preview Mode](draft-preview.product.md) -- blog hỗ trợ preview và versioning giống trang CMS
- [Enhanced Image](enhanced-image.product.md) -- dùng DirectusImage cho ảnh bài viết và avatar
- [Directus SDK Client](directus-sdk-client.product.md) -- các hàm fetch dùng client chung
- [SEO Management](seo-management.product.md) -- blog có Open Graph tags đầy đủ

## Lưu ý

- Chỉ hiển thị bài viết có `status = published` (trừ khi dùng preview)
- Hỗ trợ versioning qua `?version=X&id=Y` (giống trang CMS)
- Tác giả lấy từ Directus user, hiển thị first_name + last_name + avatar
