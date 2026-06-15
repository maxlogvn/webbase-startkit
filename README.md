# webbase-startkit --template svelte

Starter kit xay dung trang web full-stack voi Directus CMS + SvelteKit. Soan trang keo tha, tao form dong, viet blog -- frontend tu dong render ra website tuong ung.

Phu hop cho: landing page, blog, trang marketing, trang ban san pham -- bat ky site nao can CMS nhung muon frontend nhanh, nhe, linh hoat.

## Bat dau nhanh (CLI)

Chi can Git + Docker:

```bash
npx github:maxlogvn/webbase-startkit
```

CLI se tu dong:
1. Clone repo vao thu muc ban chon
2. Tao file moi truong backend
3. Chay Directus + Postgres + Redis bang Docker
4. Doi Directus san sang
5. Ap dung schema + noi dung mau
6. Tao token tinh cho frontend
7. Tao file moi truong SvelteKit
8. Cai dat frontend dependencies

## Yeu cau

| Cong cu | Toi thieu |
|---|---|
| Git | -- |
| Docker + Docker Compose | Docker 24+ |
| Node.js | 18+ |
| bun / pnpm / npm | 1 trong 3 (tu dong phat hien) |

## Scripts (root)

```bash
pnpm dev            # Backend Docker + Frontend dev server (HMR)
pnpm prod           # Backend + Frontend container (production)
pnpm prod:build     # Build frontend Docker image
pnpm prod:logs      # Xem log production
pnpm stop           # Tat tat ca container
```

## Che do phat trien

1 Terminal:

```bash
pnpm dev
```

Lenh nay chay:
- Backend (Directus + Postgres + Redis) trong Docker
- Frontend SvelteKit o che do dev co HMR

Truy cap:
- Frontend: http://localhost:3000
- Directus Admin: http://localhost:8055

## Che do production (Docker)

```bash
# Build frontend image
pnpm prod:build

# Chay ca stack
pnpm prod
```

Frontend chay trong container, su dung `@sveltejs/adapter-node`.

### Trien khai len VPS

1. Cai Docker + Node.js + pnpm tren VPS
2. Clone repo:
   ```bash
   git clone https://github.com/maxlogvn/webbase-startkit.git /opt/webbase
   cd /opt/webbase
   ```
3. Tao file `.env` (xem `.env.example`), chinh sua cho production
4. Build va chay:
   ```bash
   pnpm prod:build
   pnpm prod
   ```
5. Cai Nginx lam reverse proxy + SSL (Certbot)

## Kien truc

```
webbase-startkit/
├── docker-compose.yaml     # Docker Compose profiles (dev/prod)
├── Dockerfile              # Multi-stage build cho SvelteKit
├── .env.example            # Bien moi truong cho Docker Compose
├── bin/install.js          # CLI install script
├── backend/
│   ├── .env.example        # Bien moi truong backend
│   ├── template/           # Cau truc du lieu va noi dung mau
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
│       │   ├── types/        # TypeScript types (tu dong sinh)
│       │   ├── utils.ts      # Ham tien ich (cn, debounce)
│       │   └── zodSchemaBuilder.ts  # Dynamic Zod schema builder
│       └── routes/           # SvelteKit routes
│           ├── [...permalink]/   # Trang CMS dong
│           ├── blog/             # Blog system
│           └── api/              # API endpoints (search, form submit)
└── docs/                 # Tai lieu du an (mkdocs)
    ├── products/         # Tai lieu tinh nang
    ├── ROADMAP.md
    └── CONVENTIONS.md
```

## Bien moi truong

### Backend (`backend/.env`)

Xem `backend/.env.example` cho danh sach day du.

### Frontend (`svelte/.env`)

| Bien | Mo ta |
|---|---|
| `PUBLIC_DIRECTUS_URL` | URL Directus instance (VD: `http://localhost:8055`) |
| `PUBLIC_SITE_URL` | URL cong khai cua site (SEO/sitemap) |
| `DIRECTUS_SERVER_TOKEN` | Token Webmaster -- server-side cho draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Token admin -- chi dung sinh types, khong runtime |

## Lenh SvelteKit

```bash
pnpm run dev           # Dev server port 3000
pnpm run build         # Build production
pnpm run check         # Type checking (svelte-check)
pnpm run lint          # ESLint + Prettier
pnpm run format        # Format code
pnpm run generate:types  # Sinh TypeScript types tu Directus schema
```

## Tai lieu

- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) -- quy uoc code
- [`docs/ROADMAP.md`](docs/ROADMAP.md) -- theo doi tien do
