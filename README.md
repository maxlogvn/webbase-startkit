# webbase-startkit --template svelte

Starter kit xây dựng trang web full-stack với Directus CMS + SvelteKit. Soạn trang kéo thả, tạo form động, viết blog -- frontend tự động render ra website tương ứng.

Phù hợp cho: landing page, blog, trang marketing, trang bán sản phẩm -- bất kỳ site nào cần CMS nhưng muốn frontend nhanh, nhẹ, linh hoạt.

## Bắt đầu nhanh (CLI)

Chỉ cần Git + Docker:

```bash
npx github:maxlogvn/webbase-startkit
```

CLI sẽ tự động:
1. Clone repo vào thư mục bạn chọn
2. Tạo file môi trường backend
3. Chạy Directus + Postgres + Redis bằng Docker
4. Đợi Directus sẵn sàng
5. Áp dụng schema + nội dung mẫu
6. Tạo token tĩnh cho frontend
7. Tạo file môi trường SvelteKit
8. Cài đặt frontend dependencies

## Yêu cầu

| Công cụ | Tối thiểu |
|---|---|
| Git | -- |
| Docker + Docker Compose | Docker 24+ |
| Node.js | 18+ |
| bun / pnpm / npm | 1 trong 3 (tự động phát hiện) |

## Scripts (root)

```bash
pnpm dev            # Backend Docker + Frontend dev server (HMR)
pnpm prod           # Backend + Frontend container (production)
pnpm prod:build     # Build frontend Docker image
pnpm prod:logs      # Xem log production
pnpm stop           # Tắt tất cả container
```

## Chế độ phát triển

1 Terminal:

```bash
pnpm dev
```

Lệnh này chạy:
- Backend (Directus + Postgres + Redis) trong Docker
- Frontend SvelteKit ở chế độ dev có HMR

Truy cập:
- Frontend: http://localhost:3000
- Directus Admin: http://localhost:8055

## Chế độ production (Docker)

```bash
# Build frontend image
pnpm prod:build

# Chạy cả stack
pnpm prod
```

Frontend chạy trong container, sử dụng `@sveltejs/adapter-node`.

### Triển khai lên VPS

1. Cài Docker + Node.js + pnpm trên VPS
2. Clone repo:
   ```bash
   git clone https://github.com/maxlogvn/webbase-startkit.git /opt/webbase
   cd /opt/webbase
   ```
3. Tạo file `.env` (xem `.env.example`), chỉnh sửa cho production
4. Build và chạy:
   ```bash
   pnpm prod:build
   pnpm prod
   ```
5. Cài Nginx làm reverse proxy + SSL (Certbot)

## Kiến trúc

```
webbase-startkit/
├── docker-compose.yaml     # Docker Compose profiles (dev/prod)
├── Dockerfile              # Multi-stage build cho SvelteKit
├── .env.example            # Biến môi trường cho Docker Compose
├── bin/install.js          # CLI install script
├── backend/
│   ├── .env.example        # Biến môi trường backend
│   ├── template/           # Cấu trúc dữ liệu và nội dung mẫu
│   └── extensions/         # Directus extensions
├── svelte/                 # Frontend SvelteKit
│   └── src/
│       ├── lib/
│       │   ├── components/   # Svelte components
│       │   │   ├── blocks/   # Block builder (Hero, RichText, Gallery...)
│       │   │   ├── forms/    # Dynamic form builder
│       │   │   ├── layout/   # NavigationBar, Footer, PageBuilder
│       │   │   ├── shared/   # DirectusImage
│       │   │   └── ui/       # shadcn-svelte + custom UI components
│       │   ├── directus/     # Directus SDK client, fetchers, utils
│       │   ├── types/        # TypeScript types (tự động sinh)
│       │   ├── utils.ts      # Hàm tiện ích (cn, debounce)
│       │   └── zodSchemaBuilder.ts  # Dynamic Zod schema builder
│       └── routes/           # SvelteKit routes
│           ├── [...permalink]/   # Trang CMS động
│           ├── blog/             # Blog system
│           └── api/              # API endpoints (search, form submit)
└── docs/                 # Tài liệu dự án (mkdocs)
    ├── products/         # Tài liệu tính năng
    ├── ROADMAP.md
    └── CONVENTIONS.md
```

## Biến môi trường

### Backend (`backend/.env`)

Xem `backend/.env.example` cho danh sách đầy đủ.

### Frontend (`svelte/.env`)

| Biến | Mô tả |
|---|---|
| `PUBLIC_DIRECTUS_URL` | URL Directus instance (VD: `http://localhost:8055`) |
| `PUBLIC_SITE_URL` | URL công khai của site (SEO/sitemap) |
| `DIRECTUS_SERVER_TOKEN` | Token Webmaster -- server-side cho draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Token admin -- chỉ dùng sinh types, không runtime |

## Lệnh SvelteKit

```bash
pnpm run dev           # Dev server port 3000
pnpm run build         # Build production
pnpm run check         # Type checking (svelte-check)
pnpm run lint          # ESLint + Prettier
pnpm run format        # Format code
pnpm run generate:types  # Sinh TypeScript types từ Directus schema
```

## Tài liệu

- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) -- quy ước code
- [`docs/ROADMAP.md`](docs/ROADMAP.md) -- theo dõi tiến độ
