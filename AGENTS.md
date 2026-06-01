# AGENTS.md

Hướng dẫn dành cho AI agent khi làm việc với dự án này. Đọc kỹ trước khi viết bất kỳ dòng code nào.

---

## Đọc trước khi bắt đầu

Các tài liệu dưới đây chứa toàn bộ ngữ cảnh quan trọng của dự án — **không bỏ qua**:

| Tài liệu                                     | Nội dung |
|----------------------------------------------|---|
| [`docs/Welcome.md`](docs/Welcome.md)         | Tổng quan dự án |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Quy ước đặt tên, cấu trúc file, phong cách code |
| [`docs/STACK.md`](docs/STACK.md)             | Công nghệ sử dụng |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)         | Theo dõi tiến độ tất cả tính năng |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md)       | Quy trình phát triển tính năng từ đầu đến cuối |

---

## Cấu trúc thư mục

| Thư mục | Mô tả |
|---|---|
| `directus/` | Directus CMS, Docker Compose, PostgreSQL, Redis |
| `svelte/` | SvelteKit frontend (package name: `sveltekit`) |
| `docs/` | Obsidian vault — thiết kế, spec, kế hoạch, tổng quan |

---

## Quy ước code quan trọng

Áp dụng nhất quán trong toàn bộ codebase:

- **Adapter:** Dùng `adapter-vercel` mặc định. Chuyển sang `adapter-netlify` khi có yêu cầu.
- **Styling:** Tailwind + shadcn-svelte. Prettier: dùng tab, single quotes, `printWidth: 100`, không trailing comma.
- **Server files:** Mọi file `.server.ts` phải có flow comment ở đầu file, section divider dạng `// --- Tên section ---`, comment bằng tiếng Việt.
- **Directus SDK:** Client được giới hạn tốc độ (10 req / 500ms) qua `p-queue`, tự động retry khi gặp lỗi 429.
- **Fetchers:** Đặt tất cả query vào `src/lib/directus/fetchers.ts`. Không gọi SDK trực tiếp trong hàm `load`.
- **Package manager:** Dùng pnpm với `save-exact=true` — luôn ghim phiên bản chính xác.

---

## Biến môi trường

| Biến | Phạm vi sử dụng |
|---|---|
| `PUBLIC_DIRECTUS_URL` | URL của Directus instance |
| `PUBLIC_SITE_URL` | URL công khai của site (SEO, sitemap) |
| `DIRECTUS_SERVER_TOKEN` | Token Webmaster — dùng server-side khi xem draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Chỉ dùng để sinh TypeScript types, **không** dùng lúc runtime |

---

## Sinh TypeScript types

```bash
pnpm run generate:types
```

Yêu cầu biến `DIRECTUS_ADMIN_TOKEN` trong env (hoặc nhập tay khi được hỏi). Output ghi vào `src/lib/types/directus-schema.ts`.

---

## Lỗi svelte-check đã biết

> **Bỏ qua ~54 lỗi TypeScript** từ `src/lib/components/ui/` (shadcn-svelte) — nguyên nhân là xung đột phiên bản bits-ui, không liên quan đến code của mình.
>
> Khi chạy `pnpm run check`, chỉ cần quan tâm đến các lỗi **mới phát sinh** từ code bạn vừa thêm hoặc sửa.

---

## Visual editing và draft content

Các query parameter để kiểm tra nội dung chưa xuất bản:

| Query parameter | Tác dụng |
|---|---|
| `?preview=true` | Xem draft content — yêu cầu `DIRECTUS_SERVER_TOKEN` |
| `?version=X&id=Y` | Xem nội dung theo phiên bản cụ thể (Directus versioning) |
| `?visual-editing=true` | Bật Visual Editor (tắt được qua biến `PUBLIC_ENABLE_VISUAL_EDITING=false`) |

> **Lưu ý:** Để Visual Editor hoạt động, CSP trong Directus env phải thêm URL của frontend vào `frame-src`.