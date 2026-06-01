
<!-- Template

Trạng thái: [X] Hoàn thành | [/] Đang làm | [-] Sắp làm | [ ] Backlog

---

### Tên tính năng
- **Trạng thái:** Sắp làm
- **Tài liệu:** ...
- **Ghi chú:** ...


---


-->

---

### Tài liệu hóa các tính năng đã có
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [thiết kế](designs/documentation-audit.design.md) | [đặc tả](specs/documentation-audit.spec.md) | [kế hoạch](plans/documentation-audit.plan.md)
- **Ghi chú:** Đã rà soát codebase, phát hiện 13 tính năng thiếu tài liệu, viết overview cho tất cả. Xem danh sách bên dưới.

---

### Nâng cấp các gói thư viện phía frontend (2026)
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [thiết kế](designs/package-upgrade-2026.design.md) | [đặc tả](specs/package-upgrade-2026.spec.md) | [kế hoạch](plans/package-upgrade-2026.plan.md) | [tổng quan](overviews/package-upgrade-2026.overview.md)
- **Ghi chú:**
  - Đã nâng cấp 42 trên tổng số 44 gói thư viện.
  - Giữ nguyên **Zod** ở phiên bản 3.25.76 vì việc nâng lên phiên bản 4 sẽ cần thay đổi nhiều trong code. Sẽ làm sau.
  - **prettier-plugin-tailwindcss** bị kẹt ở phiên bản 0.6.14 vì phiên bản mới hơn (0.8.0) không tương thích với Prettier và prettier-plugin-svelte hiện tại.
  - Các gói quan trọng đã nâng: Svelte 5.56, SvelteKit 2.61, TypeScript 6, Vite 8, Directus SDK 21, ESLint 10.

---

### Block builder
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [blocks.overview.md](overviews/blocks.overview.md)
- **Ghi chú:**
  - 7 block components trong `src/lib/components/blocks/`: `BaseBlock.svelte` (bộ định tuyến block), `Hero.svelte`, `RichText.svelte`, `Gallery.svelte`, `Pricing.svelte`, `Posts.svelte`, `Form.svelte`
  - `BaseBlock.svelte` ánh xạ tên collection từ Directus sang component Svelte
  - Mỗi block có thể tùy chỉnh background và ẩn/hiện qua field `background`, `hide_block`
  - Block `Posts` tự động fetch bài viết từ Directus khi render
  - Cần phát triển thêm: block Testimonial, FAQ, custom block khác

---

### Routing
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [routing.overview.md](overviews/routing.overview.md)
- **Ghi chú:**
  - Hai route chính: `[...permalink]` (trang CMS động) và `blog/[slug]` (blog riêng)
  - `[...permalink]` nhận URL, kiểm tra query params preview/version, fetch dữ liệu từ Directus, render qua `PageBuilder.svelte`
  - `blog/[slug]` có thêm: tác giả, bài viết liên quan, SEO, chia sẻ mạng xã hội
  - Chưa hỗ trợ permalink nhiều cấp (ví dụ: `/danh-muc/bai-viet`)

---

### Directus SDK client
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/directus-sdk-client.overview.md)
- **Ghi chú:**
  - File chính: `src/lib/directus/directus.ts`
  - Tự động giới hạn tối đa 10 request mỗi 500ms, tránh quá tải Directus
  - Khi gặp lỗi "too many requests" (429), tự động thử lại tối đa 3 lần
  - Hỗ trợ cả server-side và browser (tự động chọn fetch function phù hợp)
  - Không có đăng nhập -- client "stateless", dùng token khi cần

---

### Draft / Preview mode
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/draft-preview.overview.md)
- **Ghi chú:**
  - Dùng query params: `?preview=true` (xem nháp) hoặc `?version=X&id=Y` (xem phiên bản cụ thể)
  - Yêu cầu biến môi trường `DIRECTUS_SERVER_TOKEN` (đặt trong `.env`, không public)
  - Hoạt động trên cả route trang CMS và blog

---

### Directus Visual Editor
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/visual-editing.overview.md)
- **Ghi chú:**
  - File chính: `src/lib/directus/visualEditing.ts`
  - Kích hoạt qua `?visual-editing=true`, có thể tắt bằng biến `PUBLIC_ENABLE_VISUAL_EDITING=false`
  - Cho phép chỉnh sửa nội dung inline trực tiếp trên trang qua overlay
  - Hỗ trợ 3 chế độ hiển thị: modal (cửa sổ), popover (bong bóng), drawer (kéo ra)
  - Nút "Edit All Blocks" ở cuối trang để chỉnh sửa toàn bộ block
  - Quan trọng: cần cấu hình CSP trong Directus để cho phép frontend nhúng

---

### Dynamic form builder + submission
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/form-builder.overview.md)
- **Ghi chú:**
  - Block Form trong Directus hiển thị form động ra ngoài trang
  - Hỗ trợ field types: text, checkbox, checkbox group, radio, file upload
  - Validation linh hoạt qua Zod: email, url, min, max, độ dài -- cấu hình ngay trong Directus
  - API submit: `POST /api/forms/submit` -- nhận dữ liệu form, upload file nếu có, lưu vào collection `form_submissions`
  - Yêu cầu `DIRECTUS_SERVER_TOKEN` cho API submit

---

### Search API
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/search-api.overview.md)
- **Ghi chú:**
  - Endpoint: `GET /api/search?search=từ_khóa` (yêu cầu tối thiểu 3 ký tự)
  - Tìm kiếm trong pages (title, permalink) và posts (title, description, slug, content)
  - Trả về JSON array với: `id`, `title`, `type` (Page/Post), `link`, `description`
  - Chỉ tìm posts đã published
  - Chưa hỗ trợ: full-text search, sắp xếp, phân trang

---

### Redirect handling (server hook)
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/redirect-handling.overview.md)
- **Ghi chú:**
  - File chính: `src/hooks.server.ts` và `src/lib/directus/fetchRedirects.ts`
  - Tự động tải danh sách redirect từ Directus collection `redirects` khi server khởi động
  - Hỗ trợ 301 (chuyển hướng vĩnh viễn) và 302 (tạm thời)
  - Chỉ so sánh đường dẫn chính xác, không hỗ trợ pattern/wildcard
  - Lưu trong memory -- cần restart server để cập nhật

---

### Type generation từ Directus schema
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/type-generation.overview.md)
- **Ghi chú:**
  - Chạy: `pnpm run generate:types` trong thư mục `svelte/`
  - Output: `src/lib/types/directus-schema.ts`
  - Yêu cầu `DIRECTUS_ADMIN_TOKEN` (hoặc nhập tay khi chạy)
  - Tự động xử lý hậu kỳ: biến `FormSubmissionValue.id` thành optional

---

### Dark mode (mode-watcher)
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/dark-mode.overview.md)
- **Ghi chú:**
  - Component `LightSwitch.svelte` trong `src/lib/components/layout/`
  - Dùng thư viện `mode-watcher` để chuyển đổi sáng/tối toàn ứng dụng
  - Tích hợp với Tailwind CSS dark mode

---

### Enhanced image (DirectusImage)
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/enhanced-image.overview.md)
- **Ghi chú:**
  - Component `DirectusImage.svelte` dùng `@sveltejs/enhanced-img` để tối ưu ảnh
  - Props: `uuid`, `alt`, `class`, `fill`, `width`, `height`, `sizes`
  - Hàm helper `getDirectusAssetURL()` tạo URL ảnh từ Directus
  - Dùng trong blog, author avatar, gallery blocks

---

### Blog system (nâng cao)
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/blog-system.overview.md)
- **Ghi chú:**
  - Route `blog/[slug]` với đầy đủ: tác giả, bài viết liên quan (2 bài), SEO, phân trang
  - `ShareDialog.svelte` cho phép chia sẻ bài viết lên mạng xã hội
  - Hỗ trợ versioning và preview cho blog (giống trang CMS)

---

### Navigation system
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/navigation-system.overview.md)
- **Ghi chú:**
  - Components: `NavigationBar.svelte` (header) và `Footer.svelte` (chân trang)
  - Dữ liệu từ Directus collection `navigation` (main + footer)
  - Hỗ trợ menu đa cấp: mỗi item có thể có sub-menu

---

### SEO management
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/seo-management.overview.md)
- **Ghi chú:**
  - Layout global: tự động thêm `<title>`, `<meta description>`, `<link rel="icon">`
  - Pages và posts có field SEO riêng (title, meta_description) trong Directus
  - Blog có Open Graph tags đầy đủ cho chia sẻ mạng xã hội

---

### Zod schema builder
- **Trạng thái:** Hoàn thành
- **Tài liệu:** [tổng quan](overviews/zod-schema-builder.overview.md)
- **Ghi chú:**
  - File: `src/lib/zodSchemaBuilder.ts` -- xây dựng schema validation động từ cấu hình form Directus
  - Hỗ trợ validation: email, url, min, max, length
  - Dùng kết hợp với `DynamicForm.svelte` để validate form đầu vào
