# AGENTS.md

## Thiết lập nhanh

```bash
# Yêu cầu: Docker 24+, Node.js >= 18, pnpm >= 8

# Tạo file .env (cần thiết trước khi chạy dev)
cp backend/.env.example backend/.env
cp svelte/.env.example svelte/.env

# Khởi động môi trường dev (Docker backend + Svelte HMR)
pnpm run dev
```

## Các lệnh quan trọng

| Lệnh                          | Mô tả                                        | Thư mục |
| ----------------------------- | -------------------------------------------- | ------- |
| `pnpm run dev`                | Khởi động Docker services + Svelte dev (HMR) | root    |
| `pnpm stop`                   | Tắt toàn bộ Docker containers                | root    |
| `pnpm run dev`                | Chỉ khởi động Svelte dev server (port 3000)  | svelte/ |
| `pnpm run lint`               | ESLint + Prettier check                      | svelte/ |
| `pnpm run lint:fix`           | ESLint auto-fix + Prettier write             | svelte/ |
| `pnpm run format`             | Chỉ Prettier write                           | svelte/ |
| `pnpm run check`              | TypeScript check (svelte-check)              | svelte/ |
| `pnpm run generate:types`     | Sinh TypeScript types từ Directus schema     | svelte/ |
| `pnpm run build`              | Production build                             | svelte/ |
| `pnpm prod:build`             | Build Docker image cho production            | root    |
| `pnpm prod`                   | Chạy production stack                        | root    |

**Thứ tự kiểm tra trước commit**: `pnpm run lint` rồi `pnpm run check` (chạy từ `svelte/`).

## Biến môi trường

Hai file `.env` độc lập, không có file `.env` ở gốc:

- **`backend/.env`** -- 28+ biến cho Directus CMS (DB, port, secret, admin, CORS, cookies, CSP, email). Được Docker Compose đọc qua `--env-file ./backend/.env`.
- **`svelte/.env`** -- 5 biến cho SvelteKit frontend. Vite/SvelteKit tự động đọc file này.

`pnpm run generate:types` yêu cầu `DIRECTUS_ADMIN_TOKEN` trong `svelte/.env` và Directus đang chạy. Types được sinh ra tại `svelte/src/lib/types/directus-schema.ts`.

## Kiến trúc

- **Backend**: Directus CMS chạy trong Docker (image `directus/directus:11.17.4`) cùng PostGIS 16 và Redis 6. Không có mã nguồn backend custom -- toàn bộ logic nằm ở SvelteKit frontend.
- **Frontend**: SvelteKit (Svelte 5 runes: `$props()`, `$derived`, `@render`) + Tailwind CSS v4 + shadcn-svelte. Adapter: `@sveltejs/adapter-node` (Node.js server, không phải static).
- **Route chính**: `svelte/src/routes/[...permalink]/` là catch-all route render toàn bộ trang từ Directus.
- **Hook**: `svelte/src/hooks.server.ts` tải danh sách redirect từ Directus lúc server khởi động (IIFE async), không block startup.

## Directus SDK

- **Wrapper**: `useDirectus()` từ `$lib/directus/directus.ts` -- dùng bộ rate limit (10 req/500ms qua `p-queue`) và auto-retry HTTP 429.
- **Fetcher pattern**: Tất cả Directus query PHẢI viết trong `svelte/src/lib/directus/fetchers.ts`. KHÔNG gọi SDK trực tiếp trong load function.
- **Server-side token**: Dùng `DIRECTUS_SERVER_TOKEN` + `withToken()` cho draft, preview, form submission.
- **Fetcher trả về `null`** khi không tìm thấy data (không throw).

## Sinh types từ Directus schema

```bash
cd svelte && pnpm run generate:types
```
Cần `DIRECTUS_ADMIN_TOKEN` trong `svelte/.env`. Nếu chưa có, script sẽ hỏi nhập tay.

## Quy ước code

Xem `CONVENTIONS.md` để biết chi tiết. Tóm tắt:

- **Tên file**: `kebab-case`. Component: `PascalCase`. Function/variable: `camelCase`.
- **Comment**: Bằng tiếng Việt.
- **File `.server.ts`**: BẮT BUỘC có flow comment ở đầu file mô tả luồng hoạt động.
- **Section divider**: `// ─── Tên Section ───` cho file có từ 2 phần trở lên.
- **Fetchers**: Viết trong `fetchers.ts`, return type rõ ràng (không `any`), khai báo `fields` cụ thể (không `['*']`).
- **Error handling**:
  - `fail()` -- cho lỗi validation/user
  - `error()` -- cho lỗi cần hiển thị trang lỗi
  - `try/catch` -- bao quanh Directus call, log `console.error`, không để SDK bubble lên client
- **ESLint bỏ qua**: `src/lib/types/backend-schema.ts`, `src/lib/components/ui/**` (shadcn components).

## Production deploy

```bash
cp backend/.env.example backend/.env      # chỉnh sửa cho production
cp svelte/.env.example svelte/.env        # chỉnh sửa cho production
pnpm prod:build                           # build frontend Docker image
pnpm prod                                 # chạy stack production
```

Production cần: `REFRESH_TOKEN_COOKIE_SECURE=true`, `SESSION_COOKIE_SECURE=true`, `CORS_ORIGIN` thành domain cụ thể, `PUBLIC_DIRECTUS_URL` và `PUBLIC_URL` thành domain thật.
