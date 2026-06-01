# webbaseStartkit --template svelte

Starter kit xây dựng trang web với **Directus** làm  backend CMS và **SvelteKit** làm frontend. Bạn quản lý nội dung trong backend CMS (soạn trang kéo thả, tạo form động, viết blog), frontend tự động render ra website tương ứng.

Dự án phù hợp cho: landing page, blog, trang marketing công ty, trang bán sản phẩm -- bất kỳ loại site nào cần CMS nhưng muốn frontend nhanh, nhẹ, và linh hoạt.

**Tại sao Directus + SvelteKit:** Directus cung cấp CMS mạnh mẽ (REST API, đồng bộ realtime, phân quyền). SvelteKit cho tốc độ tải nhanh (SSR mặc định), bundle nhỏ, và trải nghiệm dev mượt mà. Kết hợp cả hai bạn có một site vừa dễ quản lý nội dung vừa nhanh cho người dùng cuối.

## Bắt đầu nhanh

### Yêu cầu

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Git | -- |
| Docker + Docker Compose | Docker 24+ |
| Node.js | 18+ |
| pnpm | 8+ |

### 1. Clone dự án

```bash
git clone https://github.com/maxlogvn/webbase-startkit.git
cd webbase-startkit
```

### 2. Khởi động CMS backend

Sao chép file env mẫu và chạy Docker:

```bash
cd directus
cp .env.example .env
docker compose up -d
```

Sau khi container chạy, truy cập **http://localhost:8055** và tạo tài khoản admin.  
Vào **User Directory -> chọn user admin -> Token -> nhập token -> Save** (cần token cho bước sau).

### 3. Áp dụng cấu trúc CMS

Lệnh này sẽ tạo collection, field, và nội dung mẫu trong Directus:

```bash
npx directus-template-cli@latest apply
```

Khi được hỏi, chọn:
- **Source type:** `Local directory`
- **Đường dẫn:** `./template`
- **URL Directus:** `http://localhost:8055`
- **Token:** dán token admin vừa tạo ở bước 2

### 4. Chạy frontend (SvelteKit)

```bash
cd svelte
cp .env.example .env
pnpm install
pnpm run dev
```

Mở **http://localhost:3000** -- trang web đã sẵn sàng.

## Kiến trúc

```
webbase-startkit (template SvelteKit)/
├── directus/          # Docker Compose cho Directus CMS
│   ├── docker-compose.yml
│   ├── template/      # Cấu trúc dữ liệu và nội dung mẫu
│   └── snapshots/     # Schema snapshots
├── svelte/            # Frontend SvelteKit
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
└── docs/              # Obsidian vault -- tài liệu dự án
    ├── designs/       # Thiết kế tính năng
    ├── specs/         # Đặc tả chi tiết
    ├── plans/         # Kế hoạch thực hiện
    ├── overviews/     # Báo cáo kết quả
    ├── products/      # Tài liệu tính năng hoàn chỉnh
    ├── ROADMAP.md     # Theo dõi tiến độ
    ├── CONVENTIONS.md # Quy ước code
    ├── STACK.md       # Công nghệ sử dụng
    └── WORKFLOW.md    # Quy trình phát triển
```

## Tính năng

| Tính năng | Mô tả |
|---|---|
| **Block builder** | 7 block components (Hero, RichText, Gallery, Pricing, Posts, Form, Button) -- soạn trang kéo thả trong Directus |
| **Routing động** | `[...permalink]` cho trang CMS, `blog/[slug]` cho blog, hỗ trợ preview/versioning |
| **Dynamic form** | Tạo form trong Directus, tự động render ra frontend với Zod validation |
| **Blog system** | Bài viết, tác giả, bài liên quan, phân trang, chia sẻ mạng xã hội |
| **Search API** | `GET /api/search?search=...` tìm kiếm pages và posts |
| **Visual editing** | `?visual-editing=true` -- chỉnh sửa nội dung inline qua Directus overlay |
| **Dark mode** | Chuyển đổi sáng/tối qua `mode-watcher`, tích hợp Tailwind |
| **Image optimization** | `DirectusImage.svelte` tự động tạo URL ảnh từ Directus assets |
| **Navigation** | Menu đa cấp từ Directus, responsive (desktop dropdown + mobile collapsible) |
| **Redirect handling** | Tự động tải redirect từ Directus khi server khởi động |
| **SEO** | Title, meta description, favicon, Open Graph tags cho blog |
| **Type generation** | `pnpm run generate:types` -- sinh TypeScript types từ Directus schema |
| **Rate limiting** | Directus SDK client tự động giới hạn 10 request / 500ms, retry khi 429 |


## Biến môi trường (`svelte/.env`)

| Biến | Mô tả |
|---|---|
| `PUBLIC_DIRECTUS_URL` | URL Directus instance (VD: `http://localhost:8055`) |
| `PUBLIC_SITE_URL` | URL công khai của site (SEO/sitemap) |
| `DIRECTUS_SERVER_TOKEN` | Token Webmaster -- dùng server-side cho draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Token admin -- chỉ dùng sinh types, không dùng runtime |

## Lệnh thường dùng

```bash
pnpm run dev          # Dev server port 3000
pnpm run build        # Build production (adapter-vercel)
pnpm run check        # Type checking (svelte-check)
pnpm run lint         # ESLint + Prettier
pnpm run format       # Format code
pnpm run generate:types  # Sinh TypeScript types từ Directus schema
```

## Tài liệu

- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) -- quy ước code
- [`docs/STACK.md`](docs/STACK.md) -- công nghệ sử dụng
- [`docs/ROADMAP.md`](docs/ROADMAP.md) -- theo dõi tiến độ
- [`docs/WORKFLOW.md`](docs/WORKFLOW.md) -- quy trình phát triển
- [`docs/Welcome.md`](docs/Welcome.md) -- tổng quan tài liệu
