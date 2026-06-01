# Package upgrade 2026 overview

## Muc dich

Nang cap toan bo 44 goi thu vien trong `svelte/package.json` len phien ban moi nhat (hoac gan nhat), dam bao tuong thich va on dinh.

## Pham vi

Tat ca dependency trong `svelte/package.json` (dev + dependencies), chia lam 3 pha:

| Pha | So goi | Phan loai |
|---|---|---|
| Phase 1 | 18 | Patch & minor (it rui ro) |
| Phase 2A | 6 | Major khong phai ESLint (rui ro trung binh) |
| Phase 2B | 3 | ESLint 10 ecosystem (rui ro cao) |

## Cac goi da nang cap

### Phase 1 (18 goi)

| Goi | Cu | Moi |
|---|---|---|
| svelte | 5.55.1 | 5.56.0 |
| vite | 8.0.3 | 8.0.16 |
| @sveltejs/vite-plugin-svelte | 7.1.0 | 7.1.2 |
| @sveltejs/kit | 2.55.0 | 2.61.1 |
| svelte-check | 4.4.0 | 4.5.0 |
| eslint-plugin-svelte | 3.4.0 | 3.19.0 |
| typescript-eslint | 8.37.0 | 8.60.0 |
| sveltekit-superforms | 2.22.1 | 2.30.1 |
| esbuild | 0.25.4 | 0.28.0 |
| tsx | 4.19.4 | 4.22.4 |
| dotenv | 16.4.7 | 17.4.2 |
| globals | 16.0.0 | 17.6.0 |
| yaml | 2.7.1 | 2.9.0 |
| @directus/visual-editing | 2.0.1 | 2.3.2 |
| @tailwindcss/forms | 0.5.10 | 0.5.11 |
| @tailwindcss/typography | 0.5.16 | 0.5.19 |

### Phase 2A (6 goi)

| Goi | Cu | Moi |
|---|---|---|
| TypeScript | 5.9.2 | 6.0.3 |
| @directus/sdk | 20.0.3 | 21.3.0 |
| @types/node | 22.17.2 | 25.9.1 |
| prettier | 3.6.2 | 3.8.3 |
| prettier-plugin-svelte | 3.4.0 | 4.1.0 |
| p-queue | 8.1.0 | 9.3.0 |

### Phase 2B (3 goi)

| Goi | Cu | Moi |
|---|---|---|
| eslint | 9.33.0 | 10.4.1 |
| @eslint/js | 9.33.0 | 10.0.1 |
| @eslint/compat | 1.3.2 | 2.1.0 |

## Cac van de phat sinh va cach giai quyet

### 1. Prettier crash voi Svelte files

**Van de:** Prettier 3.7+ bi crash `getVisitorKeys is not a function` khi format file Svelte neu plugin `prettier-plugin-svelte` duoc dat truoc `prettier-plugin-tailwindcss` trong file cau hinh.

**Giai phap:** Dao thu tu plugin trong `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss", "prettier-plugin-svelte"]
}
```

### 2. prettier-plugin-tailwindcss khong tuong thich

**Van de:** Phien ban 0.8.0 bi crash `e.charCodeAt is not a function` khi chay cung Prettier 3.6.2 va prettier-plugin-svelte 3.4.0.

**Giai phap:** Giu nguyen phien ban 0.6.14. Se thu lai khi nang Prettier hoac prettier-plugin-svelte trong tuong lai (neu co ban moi sua loi).

### 3. ESLint 10 co rule moi

**Van de:** ESLint 10 them rule `preserve-caught-error` bat buoc phai truyen `Error.cause` khi nem lai loi tu khoi `catch`.

**Giai phap:** Them `{ cause: error }` vao 8 cau `throw new Error()` trong `src/lib/directus/fetchers.ts`.

### 4. Adapter-Vercel symlink loi (Windows)

**Van de:** Build bi loi `EPERM: operation not permitted, symlink` o buoc dong goi Vercel function. Day la gioi han cua Windows, khong lien quan den phien ban package.

**Giai phap:** Build tren macOS/Linux neu can output Vercel. Build SSR+client van chay duoc tren Windows, chi adapter step cuoi bi loi.

### 5. Loi check san co

**Van de:** `pnpm run check` luon bao 55 loi (54 tu shadcn-svelte + 1 tu DynamicForm). Day la loi co san tu truoc do xung dot phien ban bits-ui.

**Giai phap:** Bo qua cac loi nay khi chay kiem tra.

## Cac goi chua nang cap

| Goi | Phien ban hien tai | Ly do giu lai |
|---|---|---|
| zod | 3.25.76 | Phien ban 4 can thay doi nhieu code (deferred migration) |
| prettier-plugin-tailwindcss | 0.6.14 | Phien ban 0.8.0 crash (cho ban moi) |

## Cau lenh kiem tra

```bash
# Kiem tra type
cd svelte
pnpm run check

# Kiem tra lint
pnpm run lint

# Kiem tra build
pnpm run build

# Kiem tra dependency con outdated
pnpm outdated

# Kiem tra security
pnpm audit
```

## Tags da tao

- `deps-phase1-baseline` - Truoc khi bat dau Phase 1
- `deps-phase1-complete` - Sau khi hoan thanh Phase 1
- `deps-phase2a-baseline` - Truoc khi bat dau Phase 2A
- `deps-phase2a-complete` - Sau khi hoan thanh Phase 2A
- `deps-phase2b-baseline` - Truoc khi bat dau Phase 2B
- `deps-phase2b-complete` - Sau khi hoan thanh Phase 2B
