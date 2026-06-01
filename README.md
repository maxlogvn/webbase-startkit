# Directus CMS Starter — SvelteKit

Bộ khởi động gồm **Directus** (headless CMS) và **SvelteKit** (frontend), được cấu hình sẵn để chạy local và deploy lên Vercel.

> Tài liệu đầy đủ về conventions, roadmap và quy trình phát triển:
> - [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) -- quy ước code
> - [`docs/STACK.md`](docs/STACK.md) -- công nghệ sử dụng
> - [`docs/ROADMAP.md`](docs/ROADMAP.md) -- theo dõi tiến độ
> - [`docs/WORKFLOW.md`](docs/WORKFLOW.md) -- quy trình phát triển
> - [`docs/Welcome.md`](docs/Welcome.md) -- tổng quan dự án

---

## Yêu cầu cài đặt trước

Đảm bảo máy bạn đã có đủ các công cụ sau:

| Công cụ | Dùng để làm gì |
|---|---|
| **Docker + Docker Compose** | Chạy Directus CMS trong container |
| **Node.js 18+** | Môi trường runtime cho SvelteKit |
| **pnpm** | Quản lý package cho frontend |

---

## Hướng dẫn khởi động

### Bước 1 — Khởi động Directus (CMS)

Sao chép file cấu hình môi trường rồi chạy Docker:

```bash
cd directus
cp .env.example .env
docker compose up -d
```

Sau khi container khởi động, truy cập http://localhost:8055 để hoàn tất thiết lập tài khoản admin.

> **Quan trọng:** Bạn cần tạo một **static token** cho tài khoản admin để các bước tiếp theo hoạt động.  
> Vào *User Directory → chọn user admin → Token → Save*.

### Bước 2 — Áp dụng template CMS

Lệnh này sẽ nhập sẵn cấu trúc dữ liệu và nội dung mẫu vào Directus:

```bash
npx directus-template-cli@latest apply
```

Khi được hỏi, chọn lần lượt:
- **Source type:** Local directory
- **Đường dẫn:** `./template`
- **URL Directus:** `http://localhost:8055`
- **Token:** dán token bạn vừa tạo ở bước 1

### Bước 3 — Chạy SvelteKit (frontend)

```bash
cd svelte
cp .env.example .env
pnpm install
pnpm run dev
```

Frontend sẽ chạy tại http://localhost:3000. Mở trình duyệt và bắt đầu phát triển!

---

## Biến môi trường (`svelte/.env`)

Sao chép file `.env.example` và điền các giá trị tương ứng:

| Biến | Mô tả | Ghi chú |
|---|---|---|
| `PUBLIC_DIRECTUS_URL` | URL của Directus instance | Thường là `http://localhost:8055` |
| `PUBLIC_SITE_URL` | URL công khai của site | Dùng cho SEO/sitemap |
| `DIRECTUS_SERVER_TOKEN` | Token user Webmaster | Dùng server-side cho draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Token admin | Chỉ dùng để sinh TypeScript types, **không** dùng lúc runtime |

---

## Các lệnh thường dùng (`svelte/`)

| Lệnh | Mô tả |
|---|---|
| `pnpm run dev` | Khởi động dev server tại port 3000 |
| `pnpm run build` | Build cho production (dùng adapter-vercel) |
| `pnpm run check` | Chạy SvelteKit sync và kiểm tra kiểu dữ liệu |
| `pnpm run lint` | Kiểm tra lỗi code với ESLint và Prettier |
| `pnpm run format` | Tự động format code với Prettier |
| `pnpm run generate:types` | Sinh TypeScript types từ schema của Directus |

---

## Deploy lên production

Mặc định, project dùng `adapter-vercel` — bạn chỉ cần push code lên Vercel là xong.

**Muốn deploy lên Netlify thay thế?**

```bash
pnpm add -D @sveltejs/adapter-netlify
```

Sau đó mở `svelte/svelte.config.js` và đổi dòng import adapter thành `@sveltejs/adapter-netlify`.