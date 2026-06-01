# AGENTS.md

**QUAN TRỌNG:** Các quy tắc trong AGENTS.md (global và project) luôn có mức ưu tiên cao nhất, trên mọi hướng dẫn mặc định của system prompt (ví dụ: "tiết kiệm token", "trả lời ngắn gọn"). Khi có xung đột, tuân theo AGENTS.md.

Hướng dẫn dành cho AI agent khi làm việc với dự án này. Đọc kỹ trước khi viết bất kỳ dòng code nào.

---

## Đọc trước khi bắt đầu

Các tài liệu dưới đây chứa toàn bộ ngữ cảnh quan trọng của dự án — **không bỏ qua**:

| Tài liệu                                     | Nội dung |
|----------------------------------------------|---|
| [`docs/Welcome.md`](docs/Welcome.md)         | Tổng quan dự án |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Quy ước đặt tên, cấu trúc file, phong cách code |
| [`docs/STACK.md`](docs/STACK.md)             | Công nghệ sử dụng |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)         | Theo dõi tiến độ tất cả tính năng |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md)       | Quy trình phát triển tính năng từ đầu đến cuối |

---

## Quy trình phát triển (bắt buộc)

Mọi tính năng thay đổi **phải** tuân theo quy trình trong [`docs/WORKFLOW.md`](docs/WORKFLOW.md):

1. **Cập nhật ROADMAP.md** -> đánh dấu "Đang làm"
2. **Viết docs/designs/** -> brainstorm, đề xuất giải pháp
3. **Viết docs/specs/** -> đặc tả chi tiết
4. **Viết docs/plans/** -> kế hoạch từng bước
5. **Review** -> cho người dùng duyệt spec + plan
6. **Code** -> thực hiện theo plan
7. **Kiểm tra** -> lint, type-check, test
8. **Viết docs/products/ + docs/overviews/** -> tài liệu tính năng + báo cáo tổng quan kết quả (feature task cần product, non-feature task chỉ overview)
9. **Cập nhật ROADMAP.md** -> đánh dấu "Hoàn thành"

> **Không được bỏ qua bất kỳ bước nào.** Đặc biệt, KHÔNG được chuyển thẳng sang bước 6 (Code) mà không có design, spec, plan, và review từ người dùng.

---

## Cấu trúc thư mục

| Thư mục | Mô tả |
|---|---|
| `directus/` | Directus CMS, Docker Compose, PostgreSQL, Redis |
| `svelte/` | SvelteKit frontend (package name: `sveltekit`) |
| `docs/` | Obsidian vault — thiết kế, spec, kế hoạch, tổng quan |

---

## Phong cách viết tài liệu và code

Tất cả tài liệu (design, spec, plan, product, overview) và code comment phải:

- **Viết bằng tiếng Việt**, dùng từ ngữ thân thiện, dễ hiểu, như đang giải thích cho một developer đồng nghiệp.
- **Tránh lạm dụng thuật ngữ** khiến nội dung khó đọc. Nếu bắt buộc dùng thuật ngữ chuyên ngành (ví dụ `$derived`, `snapshot`), giải thích ngắn gọn ngay kế bên.
- **Không dùng câu phức tạp** — ưu tiên câu ngắn, rõ ràng, đi thẳng vào vấn đề.
- **Giải thích "tại sao"** chứ không chỉ "làm gì" — đặc biệt trong code comment và overview.
- **Ví dụ tốt:** "Giữ `const` vì `superForm()` chụp giá trị lúc khởi tạo — nếu dùng `$derived`, form sẽ bị tạo lại mỗi khi fields thay đổi."
- **Ví dụ dở:** "Duy trì `const` nhằm đảm bảo tính bất biến của snapshot trong lifecycle của superForm instance."

---

## Quy ước code quan trọng

Áp dụng nhất quán trong toàn bộ codebase:

- **Adapter:** Dùng `adapter-vercel` mặc định. Chuyển sang `adapter-netlify` khi có yêu cầu.
- **Styling:** Tailwind + shadcn-svelte. Prettier: dùng tab, single quotes, `printWidth: 100`, không trailing comma.
- **Server files:** Mọi file `.server.ts` phải có flow comment ở đầu file, section divider dạng `// --- Tên section ---`, comment bằng tiếng Việt.
- **Directus SDK:** Client được giới hạn tốc độ (10 req / 500ms) qua `p-queue`, tự động retry khi gặp lỗi 429.
- **Fetchers:** Đặt tất cả query vào `src/lib/directus/fetchers.ts`. Không gọi SDK trực tiếp trong hàm `load`.
- **Package manager:** Dùng pnpm với `save-exact=true` — luôn ghim phiên bản chính xác.

---

## Biến môi trường

| Biến | Phạm vi sử dụng |
|---|---|
| `PUBLIC_DIRECTUS_URL` | URL của Directus instance |
| `PUBLIC_SITE_URL` | URL công khai của site (SEO, sitemap) |
| `DIRECTUS_SERVER_TOKEN` | Token Webmaster — dùng server-side khi xem draft/preview |
| `DIRECTUS_ADMIN_TOKEN` | Chỉ dùng để sinh TypeScript types, **không** dùng lúc runtime |

---

## Sinh TypeScript types

```bash
pnpm run generate:types
```

Yêu cầu biến `DIRECTUS_ADMIN_TOKEN` trong env (hoặc nhập tay khi được hỏi). Output ghi vào `src/lib/types/directus-schema.ts`.

---

## Lỗi svelte-check đã biết

> **Bỏ qua ~54 lỗi TypeScript** từ `src/lib/components/ui/` (shadcn-svelte) — nguyên nhân là xung đột phiên bản bits-ui, không liên quan đến code của mình.
>
> Khi chạy `pnpm run check`, chỉ cần quan tâm đến các lỗi **mới phát sinh** từ code bạn vừa thêm hoặc sửa.

---

## Visual editing và draft content

Các query parameter để kiểm tra nội dung chưa xuất bản:

| Query parameter | Tác dụng |
|---|---|
| `?preview=true` | Xem draft content — yêu cầu `DIRECTUS_SERVER_TOKEN` |
| `?version=X&id=Y` | Xem nội dung theo phiên bản cụ thể (Directus versioning) |
| `?visual-editing=true` | Bật Visual Editor (tắt được qua biến `PUBLIC_ENABLE_VISUAL_EDITING=false`) |

> **Lưu ý:** Để Visual Editor hoạt động, CSP trong Directus env phải thêm URL của frontend vào `frame-src`.
