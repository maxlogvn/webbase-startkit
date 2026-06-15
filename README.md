<div align="center">

# WEBBASE-STARTKIT

**Starter kit full-stack Directus CMS + SvelteKit.**

Soạn trang kiểu block · Tạo form động · Viết blog · Frontend tự động render

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](#)
[![Docker](https://img.shields.io/badge/docker-%3E%3D24-blue.svg)](#)
[![Svelte](https://img.shields.io/badge/sveltekit-2.x-orange.svg)](#)
[![Directus](https://img.shields.io/badge/directus-11.x-6644ff.svg)](#)

</div>

---

## Tổng quan

`webbase-startkit` cung cấp sẵn toàn bộ tầng frontend SvelteKit kết nối với Directus CMS, giúp bạn không phải tích hợp API, xây block, tạo form, hay quản lý layout từ đầu mỗi khi bắt đầu dự án mới.

Backend dùng Directus -- headless CMS tự host, hỗ trợ REST API, visual editor, versioning, và phân quyền. Frontend dùng SvelteKit với Tailwind CSS v4, shadcn-svelte, Zod, và Directus SDK. Mọi nội dung (trang, bài viết, form, menu, redirect) được quản lý tập trung trong Directus Admin. Frontend tự động render ra website hoàn chỉnh -- landing page, blog, trang marketing, hay trang bán sản phẩm.

---

## Tính năng

- **[Block Builder](docs/blocks.product.md)** — 6 loại block: Hero, RichText, Gallery, Pricing, Posts, Form. Cấu hình trong Directus, tự động render.
- **[Dynamic Form](docs/form-builder.product.md)** — Tạo form trong Directus, tự động sinh Zod schema, upload file, lưu submission về Directus.
- **[Blog System](docs/blog-system.product.md)** — Route riêng, bài viết liên quan, author, Open Graph, hỗ trợ preview và versioning.
- **[Visual Editing](docs/visual-editing.product.md)** — Chỉnh sửa nội dung trực tiếp trên frontend qua overlay, 3 chế độ: modal, popover, drawer.
- **[Draft / Preview](docs/draft-preview.product.md)** — Xem nháp và phiên bản cụ thể trước khi xuất bản qua query params.
- **[Redirect Handling](docs/redirect-handling.product.md)** — Quản lý redirect 301/302 từ Directus, tự động load khi server khởi động.
- **[Dark Mode](docs/dark-mode.product.md)** — Light/dark mode với `mode-watcher`, tích hợp Tailwind CSS.
- **[Navigation](docs/navigation-system.product.md)** — Menu header/footer đa cấp, cấu hình từ Directus, sắp xếp theo `sort`.
- **[Search API](docs/search-api.product.md)** — Endpoint tìm kiếm nội dung trong Pages và Posts.
- **[SEO](docs/seo-management.product.md)** — Title, meta description, favicon từ globals. Open Graph cho blog.
- **[Type Generation](docs/type-generation.product.md)** — Sinh TypeScript types tự động từ Directus schema.

---

## Yêu cầu hệ thống

- Git
- Docker + Docker Compose (Docker 24+)
- Node.js >= 18
- pnpm >= 8

---

## Cài đặt & Sử dụng

### 1. Khởi tạo dự án

Chạy CLI để tự động tạo toàn bộ môi trường:

```bash
npx github:maxlogvn/webbase-startkit
```

Bạn sẽ được hỏi:
- **Tên thư mục** -- nơi chứa project (mặc định: `webbase-startkit`).
- **Port backend** -- cổng chạy Directus (mặc định: `8055`).
- **Port frontend** -- cổng chạy SvelteKit (mặc định: `3000`).

CLI sẽ tự động clone repo, tạo file `.env` cho backend và frontend, khởi động Docker (Directus + Postgres + Redis), áp dụng schema và nội dung mẫu vào Directus, sinh token kết nối, và cài đặt toàn bộ dependencies.

### 2. Truy cập

Sau khi CLI hoàn tất:

| Thành phần | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Directus Admin | http://localhost:8055 |

Đăng nhập Directus Admin bằng email và mật khẩu trong file `backend/.env` (`ADMIN_EMAIL` và `ADMIN_PASSWORD`). Tại đây bạn có thể tạo trang mới, viết blog, tạo form, thêm redirect, cấu hình navigation -- mọi thay đổi sẽ tự động hiển thị trên frontend.

### 3. Làm việc hàng ngày

Từ thư mục gốc của project:

```bash
pnpm dev            # Khởi động backend Docker + frontend dev server (HMR)
pnpm stop           # Tắt tất cả container
```

**Giải thích:** `pnpm dev` chạy đồng thời hai thứ: (a) Docker Compose khởi động Directus, Postgres, Redis ở chế độ nền, và (b) Vite dev server cho SvelteKit với hot module replacement. Mỗi lần bạn sửa code frontend, trình duyệt tự động cập nhật. Backend chạy ngầm trong Docker, không cần khởi động lại.

Từ thư mục `svelte/`:

```bash
pnpm run dev              # Dev server riêng (nếu backend đã chạy sẵn)
pnpm run build            # Production build
pnpm run check            # Kiểm tra TypeScript
pnpm run lint             # Kiểm tra ESLint + Prettier
pnpm run format           # Format code
pnpm run generate:types   # Sinh TypeScript types từ Directus schema
```

**Lưu ý:** Mỗi khi thay đổi schema trong Directus (thêm collection, sửa field), chạy `pnpm run generate:types` để đồng bộ types. Cần `DIRECTUS_ADMIN_TOKEN` trong `svelte/.env`.

### 4. Deploy production

```bash
pnpm prod:build     # Build frontend Docker image
pnpm prod           # Chạy toàn bộ stack (Directus + Postgres + Redis + Frontend)
pnpm prod:logs      # Xem log để debug
```

---

## Biến môi trường

### Backend (`backend/.env`)

Xem `backend/.env.example` cho danh sách đầy đủ. Biến bắt buộc: `DIRECTUS_PORT`, `DIRECTUS_SECRET`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PUBLIC_URL`, `CORS_ORIGIN`.

### Frontend (`svelte/.env`)

- `PUBLIC_DIRECTUS_URL` — URL Directus instance (VD: `http://localhost:8055`)
- `PUBLIC_SITE_URL` — URL công khai của site, dùng cho SEO và sitemap
- `DIRECTUS_SERVER_TOKEN` — Token Webmaster, dùng server-side cho draft, preview, và form submission
- `DIRECTUS_ADMIN_TOKEN` — Token admin, chỉ dùng để sinh TypeScript types, không dùng runtime
- `PUBLIC_ENABLE_VISUAL_EDITING` — Bật/tắt Visual Editing (mặc định bật, set `false` để tắt)

---

## Deploy lên VPS

Sử dụng Docker và Nginx reverse proxy.

```bash
git clone https://github.com/maxlogvn/webbase-startkit.git /opt/webbase
cd /opt/webbase
cp .env.example .env
# Chỉnh sửa .env cho production
pnpm prod:build
pnpm prod
```

Cấu hình Nginx reverse proxy cho frontend (port 3000) và Directus (port 8055). Dùng Certbot cài SSL.

Lưu ý production: set `REFRESH_TOKEN_COOKIE_SECURE=true`, `SESSION_COOKIE_SECURE=true`, `CORS_ORIGIN` thành domain cụ thể, `PUBLIC_DIRECTUS_URL` và `PUBLIC_URL` thành domain thật.

---

## Tài liệu tham khảo

- [`CONVENTIONS.md`](CONVENTIONS.md) — Quy ước code, bắt buộc đọc trước khi contribute.
- [`docs/`](docs/) — Tài liệu chi tiết từng tính năng.
- [`backend/README.md`](backend/README.md) — Hướng dẫn setup backend Directus.
- [`svelte/README.md`](svelte/README.md) — Hướng dẫn frontend (cấu trúc thư mục, scripts, type generation).

---

## Phát triển

Trước khi commit, chạy các lệnh kiểm tra trong thư mục `svelte/`:

```bash
pnpm run lint        # ESLint + Prettier
pnpm run check       # TypeScript (svelte-check)
```

Xem [`CONVENTIONS.md`](CONVENTIONS.md) để biết quy ước code, cách viết fetcher, xử lý lỗi, và comment.

---

## License

[MIT](LICENSE)
