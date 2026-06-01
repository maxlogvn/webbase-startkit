
## Frontend (svelte/)

| Công nghệ | Phiên bản |
|---|---|
| SvelteKit | 2.61.1 |
| Svelte | 5.56.0 |
| TypeScript | 6.0.3 |
| Vite | 8.0.16 |
| Tailwind CSS | **4.3.0** |
| shadcn-svelte (bits-ui) | **2.18.1** |
| @directus/sdk | 21.3.0 |
| ESLint | 10.4.1 |
| Zod | 3.25.76 (giữ nguyên, deferred) |
| adapter-vercel | 6.3.3 |
| pnpm | -- |

## Backend (backend/)

| Công nghệ | Phiên bản |
|---|---|
| Directus | 11.17.4 |
| PostgreSQL | 16 (postgis) |
| Redis | 6 |

## Công cụ phát triển

- ESLint 10 + Prettier 3.8 (format: tabs, single quotes, 100 printWidth, no trailingComma)
- svelte-check (type checking)
- directus-template-cli (áp dụng CMS template)
- directus-sdk-typegen (sinh TypeScript types từ schema)
- Docker Compose (môi trường local Directus)