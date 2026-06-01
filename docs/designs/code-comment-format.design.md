# Design: Chuẩn hóa code comment và format theo CONVENTIONS.md

## Mô tả

Thêm flow comment, section divider, và inline comment cho toàn bộ code trong `svelte/src/` theo đúng tiêu chuẩn trong [`docs/CONVENTIONS.md`](../CONVENTIONS.md). Đây là task bảo trì code quality, không phải tính năng mới.

## Yêu cầu

Áp dụng đúng 3 loại comment từ CONVENTIONS.md: flow comment (`.server.ts`), section divider (file >= 2 phần), inline comment (function nhiều bước). Tất cả bằng tiếng Việt, giải thích "tại sao".

## Phạm vi

### Bỏ qua
- `src/lib/components/ui/` — shadcn-svelte, thư viện bên ngoài
- `src/lib/types/directus-schema.ts` — tự động sinh
- `src/app.html`, `src/fonts.css`, `src/globals.css`

### Cần xử lý (7 phase, ~43 file)
1. **6 file `.server.ts`** — flow comment + section divider + inline
2. **6 file `src/lib/directus/*.ts`** — section divider + inline
3. **2 file `src/lib/*.ts`** — section divider + inline
4. **10 file blocks/** — inline comment
5. **6 file forms/** — inline comment
6. **9 file layout + shared + ui tự viết** — inline comment
7. **4 file routes/\*.svelte** — inline comment

## Cách tiếp cận

Làm tuần tự từng phase, mỗi phase chạy lint + check trước khi chuyển phase tiếp theo.
