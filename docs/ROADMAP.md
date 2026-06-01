
<!-- Template

Trạng thái: [X] Hoàn thành | [/] Đang làm | [-] Sắp làm | [ ] Backlog

---

### Tên tính năng
- **Trạng thái:** Sắp làm
- **Ghi chú:** ...
- **Tài liệu:** ...

---


-->

---

### Nâng cấp các gói thư viện phía frontend (2026)
- **Trạng thái:** Hoàn thành
- **Ghi chú:**
  - Đã nâng cấp 42 trên tổng số 44 gói thư viện.
  - Giữ nguyên **Zod** ở phiên bản 3.25.76 vì việc nâng lên phiên bản 4 sẽ cần thay đổi nhiều trong code. Sẽ làm sau.
  - **prettier-plugin-tailwindcss** bị kẹt ở phiên bản 0.6.14 vì phiên bản mới hơn (0.8.0) không tương thích với Prettier và prettier-plugin-svelte hiện tại.
  - Các gói quan trọng đã nâng: Svelte 5.56, SvelteKit 2.61, TypeScript 6, Vite 8, Directus SDK 21, ESLint 10.
- **Tài liệu:** [thiết kế](designs/package-upgrade-2026.design.md) | [đặc tả](specs/package-upgrade-2026.spec.md) | [kế hoạch](plans/package-upgrade-2026.plan.md)

---

### Block builder
- **Blocks:** Hero, RichText, Gallery, Pricing, Posts, Form
- **Tài liệu:** [blocks.overview.md](overviews/blocks.overview.md)

---

### Routing
- **Bao gồm:** `[...permalink]`, `blog/[slug]`
- **Tài liệu:** [routing.overview.md](overviews/routing.overview.md)

---

### Directus SDK client
- **Chi tiết:** Rate limiting 10 req/500ms, tự động retry HTTP 429

---

### Draft / Preview mode
### Directus Visual Editor
### Dynamic form builder + submission
### Search API
### Redirect handling (server hook)
### Type generation từ Directus schema
