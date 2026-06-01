# Spec: Nâng cấp Packages Frontend 2026

## Mô tả

Nâng cấp 44 dependencies trong `svelte/package.json` lên phiên bản mới nhất có thể áp dụng an toàn, chia làm 4 phase theo mức độ rủi ro. Mỗi phase đều có validation gate trước khi chuyển sang phase tiếp theo.

## Yêu cầu

- Tất cả dependencies được nâng lên phiên bản mới nhất đáp ứng:
  - tương thích với project runtime
  - tương thích peer dependency graph
  - pass validation gates
  - không gây regression đã biết
- Zod 3.x giữ nguyên (Phase 3: deferred migration)
- Không có regression đã biết sau validation gates và smoke tests
- Có rollback strategy cho mỗi phase, restore cả package.json + pnpm-lock.yaml
- CI/CD: lint + type-check + build pass
- Major ecosystem upgrades (ESLint 10, TS 6, Directus SDK 21, Zod 4) phải có compatibility verification trước execution
- Không yêu cầu downtime hoặc deployment strategy changes

## Packages chi tiết theo Phase

### Phase 1: Patch & Minor (18 packages)

| Package | Hiện tại | Mới nhất | Rủi ro |
|---|---|---|---|
| `svelte` | 5.55.1 | 5.56.0 | Thấp |
| `vite` | 8.0.3 | 8.0.16 | Thấp |
| `@sveltejs/vite-plugin-svelte` | 7.0.0 | 7.1.2 | Thấp |
| `@tailwindcss/forms` | 0.5.10 | 0.5.11 | Thấp |
| `@tailwindcss/typography` | 0.5.16 | 0.5.19 | Thấp |
| `dotenv` | 17.2.3 | 17.4.2 | Thấp |
| `eslint-plugin-svelte` | 3.11.0 | 3.19.0 | Thấp |
| `globals` | 16.3.0 | 17.6.0 | Thấp |
| `prettier` | 3.6.2 | 3.8.3 | Thấp |
| `svelte-check` | 4.3.1 | 4.5.0 | Thấp |
| `sveltekit-superforms` | 2.27.1 | 2.30.1 | Thấp |
| `tsx` | 4.20.4 | 4.22.4 | Thấp |
| `@directus/visual-editing` | 2.0.0 | 2.0.1 | Thấp |
| `yaml` | ^2.8.3 | ^2.9.0 | Thấp |
| `@sveltejs/kit` | 2.55.0 | 2.61.1 | Low/Medium |
| `esbuild` | 0.27.0 | 0.28.0 | Low/Medium |
| `prettier-plugin-tailwindcss` | 0.6.14 | 0.8.0 | Low/Medium (format churn) |
| `typescript-eslint` | 8.40.0 | 8.60.0 | Medium |

### Phase 2A: Major Non-ESLint (5 packages)

| Package | Hiện tại | Mới nhất | Rủi ro |
|---|---|---|---|
| `prettier-plugin-svelte` | 3.4.0 | 4.1.0 | Thấp |
| `p-queue` | 8.1.0 | 9.3.0 | Thấp |
| `@types/node` | 22.17.2 | 25.9.1 | Low/Medium |
| `typescript` | 5.9.2 | 6.0.3 | Medium |
| `@directus/sdk` | 20.0.3 | 21.3.0 | Medium |

### Phase 2B: Major ESLint ecosystem (3 packages)

| Package | Hiện tại | Mới nhất | Rủi ro |
|---|---|---|---|
| `@eslint/compat` | 1.3.2 | 2.1.0 | Cao |
| `@eslint/js` | 9.33.0 | 10.0.1 | Cao |
| `eslint` | 9.33.0 | 10.4.1 | Cao |

### Phase 3: Zod 4 (deferred migration)

| Package | Hiện tại | Mới nhất | Rủi ro |
|---|---|---|---|
| `zod` | 3.25.76 | 4.4.3 | Cao |

## Validation gates

Mỗi phase phải pass các kiểm tra sau trước khi chuyển sang phase kế tiếp:

1. `pnpm run check` (svelte-check)
2. `pnpm run lint` (ESLint + Prettier)
3. `pnpm run build` (Vite build)
4. `pnpm install --frozen-lockfile` (CI parity — lockfile phải khớp)
5. `pnpm audit` (không có High/Critical unresolved)
6. `pnpm dedupe --check` (không còn unresolved dedupe opportunities)
7. `pnpm install --strict-peer-dependencies` (không unresolved peer errors)
8. Smoke test: `pnpm preview` + manual routes

## Rollback

Rollback phải restore toàn bộ:
- `package.json`
- `pnpm-lock.yaml`
- bất kỳ config changes phát sinh (e.g. `eslint.config.js`)

```bash
# Inspect baseline
git checkout deps-phaseX-baseline

# Restore branch state (restores package.json + lockfile + configs)
git switch main && git reset --hard deps-phaseX-baseline
```

## Xử lý lỗi

- Lỗi type-check: Kiểm tra changelog, sửa type annotations
- Lỗi lint: Kiểm tra compatibility matrix (đặc biệt ESLint 10)
- Lỗi peer dependency: Kiểm tra `--strict-peer-dependencies` output
- Runtime lỗi: Rollback về baseline, debug riêng

## Kiểm tra cuối

Sau khi hoàn thành tất cả phase (trừ Phase 3):
- `pnpm run check` pass
- `pnpm run lint` pass
- `pnpm run build` pass
- `pnpm outdated` còn 0 package có thể nâng (trừ Zod)
- `docs/STACK.md` cập nhật phiên bản mới
