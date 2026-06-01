# Design: Nâng cấp Packages Frontend 2026

## Mục tiêu

Đưa dependencies trong `svelte/package.json` lên phiên bản mới nhất có thể áp dụng an toàn, tận dụng bản vá bảo mật, hiệu năng, và tính năng mới mà không gây gián đoạn phát triển.

## Phạm vi

44 packages trong `svelte/package.json` (35 devDependencies + 9 dependencies).

## Phương án được chọn: Nâng cấp theo nhóm rủi ro

Chia làm 4 giai đoạn dựa trên mức độ rủi ro. Mỗi giai đoạn chạy kiểm tra riêng (lint, type-check, build) trước khi chuyển sang giai đoạn tiếp theo.

---

### Giai đoạn 1: Patch & Minor

Các package nâng cấp trong cùng dòng major. Đa số an toàn, một số cần chú ý:

| Package | Hiện tại | Mới nhất | Loại | Rủi ro |
|---|---|---|---|---|
| `svelte` | 5.55.1 | 5.56.0 | patch | Thấp |
| `vite` | 8.0.3 | 8.0.16 | patch | Thấp |
| `@sveltejs/vite-plugin-svelte` | 7.0.0 | 7.1.2 | minor | Thấp |
| `@tailwindcss/forms` | 0.5.10 | 0.5.11 | patch | Thấp |
| `@tailwindcss/typography` | 0.5.16 | 0.5.19 | patch | Thấp |
| `dotenv` | 17.2.3 | 17.4.2 | minor | Thấp |
| `eslint-plugin-svelte` | 3.11.0 | 3.19.0 | minor | Thấp |
| `globals` | 16.3.0 | 17.6.0 | minor | Thấp |
| `prettier` | 3.6.2 | 3.8.3 | minor | Thấp |
| `svelte-check` | 4.3.1 | 4.5.0 | minor | Thấp |
| `sveltekit-superforms` | 2.27.1 | 2.30.1 | minor | Thấp |
| `tsx` | 4.20.4 | 4.22.4 | patch | Thấp |
| `@directus/visual-editing` | 2.0.0 | 2.0.1 | patch | Thấp |
| `yaml` | ^2.8.3 | ^2.9.0 | minor | Thấp |
| `@sveltejs/kit` | 2.55.0 | 2.61.1 | minor | **Thấp/Trung bình** |
| `esbuild` | 0.27.0 | 0.28.0 | minor | **Thấp/Trung bình** |
| `prettier-plugin-tailwindcss` | 0.6.14 | 0.8.0 | minor | **Thấp/Trung bình** (format churn) |
| `typescript-eslint` | 8.40.0 | 8.60.0 | minor | **Trung bình** (coupling ESLint + TS) |

**Ghi chú rủi ro:**
- `@sveltejs/kit`: Minor đôi khi có thay đổi prerender, routing, SSR typing. Cần kiểm tra kỹ `pnpm run check`.
- `esbuild`: Minor có thể có breaking semantics nhẹ vì project build tooling phụ thuộc.
- `prettier-plugin-tailwindcss`: Có thể gây format diff lớn, CI snapshot noise. Không break runtime nhưng cần format lại codebase.
- `typescript-eslint`: Coupling mạnh với ESLint parser và TS version, dễ sinh lỗi lint mới.

---

### Giai đoạn 2A: Major — Non-ESLint

Các package có major bump, rủi ro trung bình, không liên quan ESLint:

| Package | Hiện tại | Mới nhất | Loại | Rủi ro |
|---|---|---|---|---|
| `prettier-plugin-svelte` | 3.4.0 | 4.1.0 | 3.x -> 4.x | Thấp (formatting only) |
| `p-queue` | 8.1.0 | 9.3.0 | 8.x -> 9.x | Thấp (queue library) |
| `@types/node` | 22.17.2 | 25.9.1 | 22.x -> 25.x | **Thấp/Trung bình** |
| `typescript` | 5.9.2 | 6.0.3 | 5.x -> 6.x | **Trung bình** |
| `@directus/sdk` | 20.0.3 | 21.3.0 | 20.x -> 21.x | **Trung bình** |

**Ghi chú rủi ro:**
- `@types/node`: Major bump typings có thể làm lộ deprecated API, DOM conflicts, stricter typings. Không phá runtime nhưng có thể phá `svelte-check`.
- `typescript` 6: TS major hay expose latent bugs với conditional types, inferred generics. Execution order nên là: check → build → lint.
- `@directus/sdk`: Cần kiểm tra changelog. Đặc biệt chú ý auth flow, REST composables, realtime/websocket (nếu dùng) vì SDK major hay đổi typing + request layer.

---

### Giai đoạn 2B: Major — ESLint ecosystem (High risk)

Tách riêng vì ESLint major historically khá disruptive:

| Package | Hiện tại | Mới nhất | Loại | Rủi ro |
|---|---|---|---|---|
| `@eslint/compat` | 1.3.2 | 2.1.0 | 1.x -> 2.x | **Cao** |
| `@eslint/js` | 9.33.0 | 10.0.1 | 9.x -> 10.x | **Cao** |
| `eslint` | 9.33.0 | 10.4.1 | 9.x -> 10.x | **Cao** |

**Rủi ro:** Cao. ESLint major có thể gặp:
- Flat config changes
- Plugin compatibility lag
- Parser mismatch
- Peer dependency issues trong Svelte stack

**Yêu cầu bắt buộc trước khi nâng:** Kiểm tra compatibility matrix giữa các package sau:
- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-svelte`

Nếu chỉ một package trong matrix chưa support ESLint 10, cần hoãn Phase 2B.

---

### Giai đoạn 3: Zod 4 (deferred migration)

| Package | Hiện tại | Mới nhất | Loại | Rủi ro |
|---|---|---|---|---|
| `zod` | 3.25.76 | 4.4.3 | 3.x -> 4.x | **Cao** |

**Rủi ro:** Cao. Superforms đã hỗ trợ Zod 4 thông qua adapter/import phù hợp (import `zod/v4`). Tuy nhiên migration vẫn có thể ảnh hưởng:
- Schema inference behavior
- Transform/coerce logic
- Date parsing differences
- Custom validators
- Runtime behaviour differences
- Adapter edge cases
- Cần regression test toàn bộ form validation

**Quyết định:** Giữ nguyên Zod 3.x trong đợt này. Tách Zod 4 thành migration riêng sau khi Phase 1-2B ổn định và có regression test.

---

## Luồng thực hiện chi tiết

```
Phase 1 (Patch & Minor)
    │
    ├── Git baseline (tag: deps-phase1-baseline)
    ├── pnpm up <packages>
    ├── git diff package.json pnpm-lock.yaml
    ├── pnpm install --frozen-lockfile  ← CI parity
    ├── pnpm install --strict-peer-dependencies
    ├── pnpm dedupe
    ├── pnpm run check
    ├── pnpm run lint
    ├── pnpm run build
    ├── pnpm audit && pnpm audit --prod
    ├── pnpm dedupe --check
    ├── pnpm why eslint && pnpm why typescript
    └── pnpm preview + smoke test
    │
Phase 2A (Major - Non ESLint)
    │
    ├── Xác thực compatibility TS6 + Directus SDK trước
    ├── Git baseline (tag: deps-phase2a-baseline)
    ├── pnpm up <packages>
    ├── git diff package.json pnpm-lock.yaml
    ├── pnpm install --frozen-lockfile
    ├── pnpm install --strict-peer-dependencies
    ├── pnpm dedupe
    ├── pnpm run check ← chạy trước để phát hiện TS issues
    ├── pnpm run build
    ├── pnpm run lint
    ├── pnpm audit && pnpm audit --prod
    ├── pnpm dedupe --check
    ├── pnpm why eslint && pnpm why typescript
    └── pnpm preview + smoke test
    │
Phase 2B (Major - ESLint ecosystem)
    │
    ├── Xác thực compatibility matrix trước
    ├── Git baseline (tag: deps-phase2b-baseline)
    ├── Clean install: pnpm install --force
    ├── pnpm up eslint @eslint/js @eslint/compat
    ├── git diff package.json pnpm-lock.yaml
    ├── pnpm install --frozen-lockfile
    ├── pnpm install --strict-peer-dependencies
    ├── pnpm dedupe
    ├── pnpm run lint  ← đặc biệt quan trọng
    ├── pnpm run check
    ├── pnpm run build
    ├── pnpm audit && pnpm audit --prod
    ├── pnpm dedupe --check
    ├── pnpm why eslint
    └── pnpm preview + smoke test
    │
Phase 3 (Zod 4 - deferred migration)
    │
Cập nhật STACK.md
```

## Kiểm tra bổ sung

### A. Lockfile snapshot
Trước mỗi phase, tạo git baseline tag:
```bash
git tag deps-phaseX-baseline
```
Rollback nhanh:
- Inspect baseline: `git checkout deps-phaseX-baseline`
- Restore branch state (nếu cần): `git switch main && git reset --hard deps-phaseX-baseline`

Sau install, kiểm tra:
```bash
git diff pnpm-lock.yaml
```
Rất hữu ích để thấy transitive upgrades, unexpected peer changes, duplicate graph.

### B. Dependency tree validation
Sau mỗi phase:
```bash
pnpm why eslint
pnpm why typescript
pnpm list eslint
pnpm list typescript
pnpm dedupe --check
```
`pnpm list eslint`, `pnpm list typescript` và `pnpm dedupe --check` phát hiện duplicate graph tốt hơn `pnpm why`.

### C. Peer dependency validation
```bash
pnpm install --strict-peer-dependencies
```
Dùng `--strict-peer-dependencies` để fail sớm khi có unresolved peer errors. Major upgrades hay fail ở peer dependencies.

### D. Clean install checkpoint (phase 2B)
Trước phase 2B, chạy reinstall để tránh cached artifact:
```bash
pnpm install --force
```
`pnpm install --force` refetch metadata, reinstall deps, rebuild packages.
Nếu nghi store corruption, thêm:
```bash
pnpm store prune
pnpm install
```

### E. Smoke tests
```bash
pnpm preview
```
Manual smoke: login, forms, SSR pages, API endpoints. Build pass không đồng nghĩa runtime pass.

### F. Security scan
Sau mỗi phase:
```bash
pnpm audit
pnpm audit --prod  ← ưu tiên runtime path
```
Align với mục tiêu ban đầu là bản vá bảo mật.

## Tiêu chí thành công

- `pnpm run check` pass (không tính lỗi shadcn-svelte có sẵn)
- `pnpm run lint` pass
- `pnpm run build` pass
- Không có unresolved peer dependency errors ảnh hưởng build/runtime
- Smoke test: các route cơ bản hoạt động
- Các vulnerability High/Critical từ `pnpm audit` phải được fix, mitigate, hoặc documented acceptance
- `docs/STACK.md` được cập nhật phiên bản mới

## Packages không cần nâng cấp

Không hardcode danh sách tại đây. Dùng lệnh sau để xác thực trước khi chạy:
```bash
pnpm outdated
```
