# SEO Management

Tính năng này tự động quản lý các thẻ meta cho SEO (tiêu đề, mô tả, favicon) trên toàn bộ ứng dụng.

## File chính

- `src/routes/+layout.svelte` -- layout chính, thêm `<title>`, `<meta description>`, `<link rel="icon">`
- `src/routes/[...permalink]/+page.svelte` -- SEO cho trang CMS
- `src/routes/blog/[slug]/+page.server.ts` -- Open Graph tags cho blog

## Cách dùng

Trong Directus, mỗi Page và Post có field `seo` gồm:
- `title` -- SEO title (ghi đè tiêu đề trang nếu có)
- `meta_description` -- mô tả ngắn cho Google

Layout chính tự động thêm các thẻ meta global từ `globals` (title, description, favicon).

Trang blog còn có thêm Open Graph tags để chia sẻ lên mạng xã hội:
- `og:title`, `og:description`
- `og:url`, `og:type: 'article'`
- `og:image` (từ ảnh đại diện bài viết)

## Liên quan

- [Blog System](blog-system.overview.md) -- blog dùng SEO chi tiết nhất với Open Graph
- [Routing](../overviews/routing.overview.md) -- cả hai route đều hỗ trợ SEO

## Lưu ý

- Nếu không có SEO title riêng, title của trang/post được dùng làm fallback
- Favicon từ globals hoặc fallback về `/favicon.ico`
