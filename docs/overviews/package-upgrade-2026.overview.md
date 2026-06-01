# Package upgrade 2026 overview

## Mục đích

Nâng cấp toàn bộ 44 gói thư viện trong `svelte/package.json` lên phiên bản mới nhất (hoặc gần nhất), đảm bảo tương thích và ổn định.

## Phạm vi

Tất cả dependency trong `svelte/package.json` (dev + dependencies), chia làm 3 pha:

| Pha | Số gói | Phân loại |
|---|---|---|
| Phase 1 | 18 | Patch & minor (ít rủi ro) |
| Phase 2A | 6 | Major không phải ESLint (rủi ro trung bình) |
| Phase 2B | 3 | ESLint 10 ecosystem (rủi ro cao) |

## Các gói đã nâng cấp

### Phase 1 (18 gói)

| Gói | Cũ | Mới |
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

### Phase 2A (6 gói)

| Gói | Cũ | Mới |
|---|---|---|
| TypeScript | 5.9.2 | 6.0.3 |
| @directus/sdk | 20.0.3 | 21.3.0 |
| @types/node | 22.17.2 | 25.9.1 |
| prettier | 3.6.2 | 3.8.3 |
| prettier-plugin-svelte | 3.4.0 | 4.1.0 |
| p-queue | 8.1.0 | 9.3.0 |

### Phase 2B (3 gói)

| Gói | Cũ | Mới |
|---|---|---|
| eslint | 9.33.0 | 10.4.1 |
| @eslint/js | 9.33.0 | 10.0.1 |
| @eslint/compat | 1.3.2 | 2.1.0 |

## Các vấn đề phát sinh và cách giải quyết

### 1. Prettier crash với Svelte files

**Vấn đề:** Prettier 3.7+ bị crash `getVisitorKeys is not a function` khi format file Svelte nếu plugin `prettier-plugin-svelte` được đặt trước `prettier-plugin-tailwindcss` trong file cấu hình.

**Giải pháp:** Đảo thứ tự plugin trong `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss", "prettier-plugin-svelte"]
}
```

### 2. prettier-plugin-tailwindcss không tương thích

**Vấn đề:** Phiên bản 0.8.0 bị crash `e.charCodeAt is not a function` khi chạy cùng Prettier 3.6.2 và prettier-plugin-svelte 3.4.0.

**Giải pháp:** Giữ nguyên phiên bản 0.6.14. Sẽ thử lại khi nâng Prettier hoặc prettier-plugin-svelte trong tương lai (nếu có bản mới sửa lỗi).

### 3. ESLint 10 có rule mới

**Vấn đề:** ESLint 10 thêm rule `preserve-caught-error` bắt buộc phải truyền `Error.cause` khi ném lại lỗi từ khối `catch`.

**Giải pháp:** Thêm `{ cause: error }` vào 8 câu `throw new Error()` trong `src/lib/directus/fetchers.ts`.

### 4. Adapter-Vercel symlink lỗi (Windows)

**Vấn đề:** Build bị lỗi `EPERM: operation not permitted, symlink` ở bước đóng gói Vercel function. Đây là giới hạn của Windows, không liên quan đến phiên bản package.

**Giải pháp:** Build trên macOS/Linux nếu cần output Vercel. Build SSR+client vẫn chạy được trên Windows, chỉ adapter step cuối bị lỗi.

### 5. Lỗi check sẵn có

**Vấn đề:** `pnpm run check` luôn báo 55 lỗi (54 từ shadcn-svelte + 1 từ DynamicForm). Đây là lỗi có sẵn từ trước do xung đột phiên bản bits-ui.

**Giải pháp:** Bỏ qua các lỗi này khi chạy kiểm tra.

## Các gói chưa nâng cấp

| Gói | Phiên bản hiện tại | Lý do giữ lại |
|---|---|---|
| zod | 3.25.76 | Phiên bản 4 cần thay đổi nhiều code (deferred migration) |
| prettier-plugin-tailwindcss | 0.6.14 | Phiên bản 0.8.0 crash (chờ bản mới) |

## Câu lệnh kiểm tra

```bash
# Kiểm tra type
cd svelte
pnpm run check

# Kiểm tra lint
pnpm run lint

# Kiểm tra build
pnpm run build

# Kiểm tra dependency còn outdated
pnpm outdated

# Kiểm tra security
pnpm audit
```

## Tags đã tạo

- `deps-phase1-baseline` - Trước khi bắt đầu Phase 1
- `deps-phase1-complete` - Sau khi hoàn thành Phase 1
- `deps-phase2a-baseline` - Trước khi bắt đầu Phase 2A
- `deps-phase2a-complete` - Sau khi hoàn thành Phase 2A
- `deps-phase2b-baseline` - Trước khi bắt đầu Phase 2B
- `deps-phase2b-complete` - Sau khi hoàn thành Phase 2B
