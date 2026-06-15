
## Hai loại route chính

### 1. [...permalink] -- trang CMS-driven
- Xử lý tất cả URL không match route cụ thể
- Resolve slug từ Directus collection `pages`
- Dùng cho: trang tĩnh, landing page, về chúng tôi, v.v.

### 2. blog/[slug] -- trang blog riêng
- Route riêng vì cần logic khác (related posts, author, SEO)
- Resolve từ Directus collection `posts`

## Luồng resolve của [...permalink]

1. Nhận URL pathname (ví dụ: `/gioi-thieu`)
2. Kiểm tra query params:
   - `?preview=true` -> dùng `DIRECTUS_SERVER_TOKEN` để fetch draft content
   - `?version=X&id=Y` -> fetch version cụ thể bằng ID
3. Gọi `fetchPageData(permalink, page, token, preview)` trong `$lib/directus/fetchers.ts`
4. Nếu có version nhưng chưa có ID -> gọi `getPageIdByPermalink()` để lấy ID trước
5. Trả về Page data với blocks -> render bằng `PageBuilder.svelte`

## Khi nào thêm route mới

Thêm route riêng (không dùng `[...permalink]`) khi:
- Cần URL structure khác (ví dụ: `/category/[slug]/[page]`)
- Cần data fetching phức tạp hơn page thông thường
- Cần layout khác hoàn toàn

## Ví dụ URL mapping

| URL | Route file | Directus collection |
|---|---|---|
| `/gioi-thieu` | `[...permalink]` | pages |
| `/blog/ten-bai` | `blog/[slug]` | posts |
| `/api/search?search=xyz` | `api/search` | -- |
| `/api/forms/submit` | `api/forms/submit` | -- |
