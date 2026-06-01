

> **For agentic workers:** Thực hiện tuần tự theo từng Phase. Mỗi Phase phải pass đủ validation gates trước khi chuyển sang Phase kế tiếp.

**Mục tiêu:** Nâng cấp 44 dependencies trong `svelte/package.json` lên phiên bản mới nhất an toàn, chia 4 phase theo rủi ro.

**Architecture:** Single package tại `svelte/package.json`, không monorepo. Lockfile tại `svelte/pnpm-lock.yaml`.

**Phạm vi:** Plan cover 27 packages có bản nâng cấp. 17 packages còn lại đã là phiên bản mới nhất (xác thực qua `pnpm outdated`).

**Lỗi có sẵn (ignore):** ~54 lỗi TypeScript từ `src/lib/components/ui/` (shadcn-svelte) — đã biết, không liên quan đến đợt nâng cấp này.

---

## Rollback trigger (áp dụng mọi phase)

Rollback ngay lập tức nếu:

- Validation gate fail (check / lint / build)
- Peer dependency errors unresolved
- Smoke test fail
- Runtime regression (hydration warning, console error, route lỗi)

```bash
# Rollback về baseline
git switch main && git reset --hard deps-phaseX-baseline
git clean -fd

# Dọn cache build tránh residue
npx rimraf .svelte-kit build node_modules/.vite
```

Rollback restore toàn bộ: `package.json`, `pnpm-lock.yaml`, config changes.

---

## Skeleton mỗi phase

```txt
1.  git tag baseline                           # rollback point
2.  verification (nếu là major upgrade)        # compatibility check
3.  pnpm up <packages>
4.  git diff package.json pnpm-lock.yaml       # xem chính xác thay đổi
5.  pnpm install --frozen-lockfile             # CI parity check
6.  pnpm install --strict-peer-dependencies    # peer validation
7.  pnpm dedupe
8.  pnpm run check
9.  pnpm run lint
10. pnpm run build
11. pnpm audit && pnpm audit --prod
12. pnpm dedupe --check
13. pnpm why eslint && pnpm why typescript     # debug dependency graph
14. pnpm preview + smoke matrix
15. git commit
```

### Audit rule

`pnpm audit` chỉ fail nếu:

- Còn High / Critical vulnerability chưa giải quyết
- Và chưa có lý do chấp nhận risk (documented acceptance)

Các warning Medium/Low không block.

### Smoke matrix (mọi phase)

- Home page load (SSR)
- Một route động (blog / [...permalink])
- Form submit (nếu có)
- Directus data fetch hiển thị
- API endpoint (`/api/*`) trả về 200
- Không có hydration warning / console error

---

## Phase 1: Patch & Minor (18 packages)

### Task 1.1: Tạo git baseline

- [x] **Tạo tag baseline**

```bash
cd svelte
git tag deps-phase1-baseline
```

### Task 1.2: Nâng cấp batch Low risk (14 packages)

- [x] **Nâng cấp** (prettier downgraded từ 3.8.3 xuống 3.6.2 do incompatibility với prettier-plugin-svelte 3.4.0)

```bash
cd svelte
pnpm up svelte@5.56.0 vite@8.0.16 @sveltejs/vite-plugin-svelte@7.1.2 @tailwindcss/forms@0.5.11 @tailwindcss/typography@0.5.19 dotenv@17.4.2 eslint-plugin-svelte@3.19.0 globals@17.6.0 prettier@3.8.3 svelte-check@4.5.0 sveltekit-superforms@2.30.1 tsx@4.22.4 @backend/visual-editing@2.0.1 yaml@^2.9.0
```

- [x] **Kiểm tra diff + frozen-lockfile + strict-peer**

```bash
git diff package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
pnpm install --strict-peer-dependencies
pnpm dedupe
```

- [x] **Validation gates** (lint: sửa 13 lỗi `resolve()` + `rel="external"`; prettier pinned 3.6.2)

```bash
pnpm run check
pnpm run lint
pnpm run build
pnpm audit && pnpm audit --prod
pnpm dedupe --check
pnpm why eslint && pnpm why typescript
```

### Task 1.3: Nâng cấp batch Low/Medium risk (4 packages)

- [x] **Nâng cấp** (prettier-plugin-tailwindcss@0.8.0 reverted -> 0.6.14 do crash với prettier 3.6.2)

```bash
cd svelte
pnpm up @sveltejs/kit@2.61.1 esbuild@0.28.0 prettier-plugin-tailwindcss@0.8.0 typescript-eslint@8.60.0
```

- [x] **Format codebase + frozen-lockfile + strict-peer**

```bash
pnpm run format
git diff package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
pnpm install --strict-peer-dependencies
pnpm dedupe
```

- [x] **Validation gates** (svelte-check: 59 -> 55 errors, sửa 4 resolve() type issues)

```bash
pnpm run check
pnpm run lint
pnpm run build
pnpm audit && pnpm audit --prod
pnpm dedupe --check
pnpm why eslint && pnpm why typescript
```

### Task 1.4: Smoke test + commit

- [x] **Smoke test** (preview 200 OK)

```bash
pnpm preview
```

Kiểm tra smoke matrix.

- [x] **Commit Phase 1** (commit 9fd9614, tag deps-phase1-complete)

```bash
git add -A
git commit -m "deps: nang cap patch & minor packages phase 1"
```

---

## Phase 2A: Major Non-ESLint (5 packages)

### Kiểm tra gating trước Phase 2A

- [x] **Compatibility verification — TypeScript 6** (chạy trước baseline)

```bash
npm view svelte-check peerDependencies.typescript
npm view @sveltejs/kit peerDependencies.typescript
npm view typescript-eslint peerDependencies.typescript
```

Xác nhận tất cả đã support TypeScript 6 trước khi nâng.

- [x] **Compatibility verification — Directus SDK 21**

Kiểm tra changelog SDK 20 -> 21, đặc biệt:
- Auth API changes (codebase không dùng `authentication()`)
- Transport layer changes (`rest()`, `withToken()`)
- Request config format
- Realtime/websocket (codebase không dùng)

Codebase hiện dùng: `rest()`, `withToken()`, `readItems`, `readItem`, `readSingleton`, `createItem`, `uploadFiles`, `aggregate`.

### Task 2A.1: Tạo git baseline

- [x] **Tạo tag**

```bash
cd svelte
git tag deps-phase2a-baseline
```

### Task 2A.2: Nâng cấp Low risk (2 packages + prettier unpinned)

- [x] **Nâng cấp** (thêm prettier@3.8.3; .prettierrc: đảo plugin order fix getVisitorKeys crash)

```bash
cd svelte
pnpm up prettier-plugin-svelte@4.1.0 p-queue@9.3.0 prettier@3.8.3
```

- [x] **Diff + frozen + peer + dedupe**

```bash
git diff package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
pnpm install --strict-peer-dependencies
pnpm dedupe
```

- [x] **Validation gates** (lint: đảo plugin order -> pass)

```bash
pnpm run check
pnpm run lint
pnpm run build
pnpm audit && pnpm audit --prod
pnpm dedupe --check
```

### Task 2A.3: Nâng cấp Medium risk (3 packages)

- [x] **Nâng cấp (TypeScript 6 + @types/node + Directus SDK 21)**

```bash
cd svelte
pnpm up @types/node@25.9.1 typescript@6.0.3 @backend/sdk@21.3.0
```

- [x] **Diff + frozen + peer + dedupe**

```bash
git diff package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
pnpm install --strict-peer-dependencies
pnpm dedupe
```

- [x] **Validation gates (order: check -> build -> lint cho TS 6)**
  check: 55 errors (pre-existing, không có TS 6 latent bugs)

```bash
pnpm run check      # chạy trước để phát hiện TS 6 latent bugs
pnpm run build
pnpm run lint
pnpm audit && pnpm audit --prod
pnpm why eslint && pnpm why typescript
pnpm dedupe --check
```

### Task 2A.4: Verify Directus SDK 21 integration

- [x] **Kiểm tra các file import Directus** (không có breaking change, pass)

```bash
grep -R "@directus/sdk" src/
```

Các file cần verify:
- `src/lib/directus/directus.ts` — `rest()`, `withToken()`, `createDirectus`
- `src/lib/directus/fetchers.ts` — `readItems`, `readItem`, `readSingleton`, `aggregate`
- `src/lib/directus/fetchRedirects.ts` — `readItems`

Nếu SDK 21 có breaking change ở `rest()` hoặc `withToken()`, sửa theo changelog.

### Task 2A.5: Smoke test + commit

- [x] **Smoke test** (preview 200 OK)

```bash
pnpm preview
```

Kiểm tra smoke matrix.

- [x] **Commit Phase 2A** (commit 3388906, tag deps-phase2a-complete)

```bash
git add -A
git commit -m "deps: nang cap major non-eslint packages phase 2a"
```

---

## Phase 2B: Major ESLint ecosystem (3 packages)

> **Cảnh báo:** ESLint 10 có risk cao. Hoãn nếu compatibility matrix chưa đầy đủ.

### Kiểm tra gating trước Phase 2B (chạy trước baseline)

- [x] **Verify compatibility matrix**

```bash
npm view eslint-plugin-svelte peerDependencies.eslint
npm view typescript-eslint peerDependencies.eslint
npm view @eslint/js peerDependencies.eslint
npm view @eslint/compat peerDependencies.eslint
```

Nếu bất kỳ package nào chưa support ESLint 10 (peer dep range không bao gồm `^10.0.0`), **hoãn Phase 2B**.

### Task 2B.1: Tạo git baseline + clean install

- [x] **Tạo baseline**

```bash
cd svelte
git tag deps-phase2b-baseline
```

- [x] **Clean install (chỉ `--force`, không chạy `store prune` mặc định)**

Thông thường:

```bash
pnpm install --force
pnpm install --strict-peer-dependencies
```

Chỉ chạy `pnpm store prune` nếu nghi store corruption.

### Task 2B.2: Nâng cấp ESLint ecosystem

- [x] **Nâng cấp**

```bash
cd svelte
pnpm up eslint@10.4.1 @eslint/js@10.0.1 @eslint/compat@2.1.0
```

- [x] **Diff + frozen**

```bash
git diff package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
```

### Task 2B.3: Validation gates (lint first)

- [x] **Chạy lint trước (quan trọng nhất)**
  - Sửa 8 lỗi `preserve-caught-error`: thêm `{ cause: error }` vào catch blocks

```bash
pnpm run lint
```

Nếu lỗi flat config:
- Kiểm tra `eslint.config.js` format có tương thích ESLint 10 API
- Kiểm tra `@eslint/compat` `includeIgnoreFile` có thay đổi API
- Kiểm tra `typescript-eslint` config object changes

- [x] **Các gates còn lại**

```bash
pnpm install --strict-peer-dependencies
pnpm dedupe
pnpm run check
pnpm run build
pnpm audit && pnpm audit --prod
pnpm why eslint
pnpm dedupe --check
```

### Task 2B.4: Smoke test + commit

- [x] **Smoke test** (preview 200 OK)

```bash
pnpm preview
```

Kiểm tra smoke matrix + lint pass trên toàn bộ routes.

- [x] **Commit Phase 2B** (commit 216e7d6, tag deps-phase2b-complete)

```bash
git add -A
git commit -m "deps: nang cap eslint ecosystem phase 2b"
```

---

## Phase 3: Zod 4 (deferred migration)

Không thực hiện trong đợt này. Zod 3.25.76 giữ nguyên.

- [x] **Ghi nhận deferred migration** (không thay đổi code)

---

## Finalize

### Task Final: Cập nhật tài liệu + final verification

- [x] **Cập nhật STACK.md**

Sửa `docs/STACK.md` — bảng "Frontend (svelte/)" với phiên bản mới.

- [x] **Final verification**

```bash
cd svelte
pnpm outdated              # xác nhận chỉ còn Zod outdated + prettier-plugin-tailwindcss pinned
pnpm run check
pnpm run lint
pnpm run build
```

- [x] **Commit final** (commit fa453b5)

```bash
git add -A
git commit -m "docs: cap nhat STACK.md sau nang cap packages"
```
