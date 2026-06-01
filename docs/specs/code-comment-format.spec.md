# Spec: Chuẩn hóa code comment và format theo CONVENTIONS.md

## Mô tả

Bổ sung flow comment, section divider, và inline comment cho toàn bộ code tự viết trong `svelte/src/` (trừ shadcn-svelte và file tự động sinh) theo đúng quy ước trong [`docs/CONVENTIONS.md`](../CONVENTIONS.md).

## Yêu cầu

Áp dụng đúng 3 loại comment trong [`docs/CONVENTIONS.md`](../CONVENTIONS.md#comment--format-code):

1. **Flow comment** ở đầu mỗi file `.server.ts` — mô tả luồng hoạt động
2. **Section divider** cho file có từ 2 phần trở lên — `// --- Tên phần ---`
3. **Inline comment** trong function có nhiều bước — `// --- Bước N: Mô tả ---`
4. Comment bằng **tiếng Việt**, giải thích **"tại sao"** chứ không chỉ **"làm gì"**

## Phạm vi

### Bỏ qua
- `src/lib/components/ui/` — shadcn-svelte (thư viện bên ngoài)
- `src/lib/types/directus-schema.ts` — tự động sinh
- `src/app.html`, `fonts.css`, `globals.css` — không phải TS/Svelte

### Cần xử lý

| Phase | Nhóm file | Số file | Loại comment |
|---|---|---|---|
| 1 | `.server.ts` (hooks, layout, pages, API) | 6 | Flow + section + inline |
| 2 | `src/lib/directus/*.ts` | 6 | Section + inline |
| 3 | `src/lib/utils.ts`, `zodSchemaBuilder.ts` | 2 | Section + inline |
| 4 | `src/lib/components/blocks/*.svelte` | 10 | Inline |
| 5 | `src/lib/components/forms/*.svelte` | 6 | Inline |
| 6 | `src/lib/components/{layout,shared,ui}/*.svelte` (tự viết) | 9 | Inline |
| 7 | `src/routes/*.svelte` | 4 | Inline |

## Format cụ thể

Xem chi tiết template và ví dụ tại [`docs/CONVENTIONS.md`](../CONVENTIONS.md#comment--format-code).

## Kiểm tra

Sau mỗi phase, chạy:
- `pnpm run lint` — không lỗi ESLint + Prettier
- `pnpm run check` — không lỗi svelte-check mới
