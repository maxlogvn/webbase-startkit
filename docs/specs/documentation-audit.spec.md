# Spec: Tài liệu hóa các tính năng đã có

## Mô tả

Rà soát toàn bộ codebase SvelteKit + Directus, xác định tất cả tính năng đã được code, cập nhật Roadmap với ghi chú chi tiết, và bổ sung tài liệu overview cho các tính năng chưa có tài liệu.

## Yêu cầu

1. Roadmap phải liệt kê đầy đủ tất cả tính năng với trạng thái chính xác.
2. Mỗi tính năng trong nhóm 2 (gồm 13 tính năng) phải có một file overview tại `docs/overviews/`.
3. Overview viết bằng tiếng Việt, dễ hiểu cho developer mới vào dự án.
4. Mỗi overview gồm: tính năng làm gì, file chính nằm ở đâu, cách dùng/cấu hình, lưu ý quan trọng.
5. Không thay đổi bất kỳ dòng code nào.
6. Nếu code và tài liệu mâu thuẫn, code là nguồn sự thật.

## Danh sách tính năng cần viết overview

| STT | Tên tính năng | File gợi ý |
|-----|--------------|------------|
| 1 | Directus SDK client | `directus-sdk-client.overview.md` |
| 2 | Draft / Preview mode | `draft-preview.overview.md` |
| 3 | Directus Visual Editor | `visual-editing.overview.md` |
| 4 | Dynamic form builder + submission | `form-builder.overview.md` |
| 5 | Search API | `search-api.overview.md` |
| 6 | Redirect handling | `redirect-handling.overview.md` |
| 7 | Type generation từ Directus schema | `type-generation.overview.md` |
| 8 | Dark mode (mode-watcher) | `dark-mode.overview.md` |
| 9 | Enhanced image (DirectusImage) | `enhanced-image.overview.md` |
| 10 | Blog system | `blog-system.overview.md` |
| 11 | Navigation system | `navigation-system.overview.md` |
| 12 | SEO management | `seo-management.overview.md` |
| 13 | Zod schema builder | `zod-schema-builder.overview.md` |

## Cấu trúc mỗi overview

```markdown
# <Tên tính năng>

Tính năng này dùng để làm gì? (1-2 câu)

## File chính

- `path/to/file.svelte` -- vai trò của file này
- `path/to/file.ts` -- vai trò của file này

## Cách dùng

Hướng dẫn ngắn: cần cấu hình gì, chạy thế nào, query param ra sao?

## Liên quan

- Liên kết đến các tính năng khác có tương tác
- Ví dụ: Search API liên quan đến Posts và Pages

## Lưu ý

- Điểm quan trọng khi sử dụng
- Hạn chế đã biết
- Biến môi trường cần thiết (nếu có)
```

## Đầu ra

- `docs/ROADMAP.md` -- đã cập nhật
- `docs/designs/documentation-audit.design.md`
- `docs/specs/documentation-audit.spec.md`
- `docs/plans/documentation-audit.plan.md`
- `docs/overviews/*.overview.md` -- 13 files

## Kiểm tra

### Nội dung
- Mỗi overview trả lời được 4 câu: tính năng làm gì, file chính ở đâu, cách dùng thế nào, lưu ý gì?
- Mô tả trong overview khớp với code hiện tại (không bịa đặt, không suy diễn)
- Các file path trong overview trỏ đúng file có thật trong codebase

### Format
- Không lỗi chính tả, viết đúng tiếng Việt có dấu
- ROADMAP.md có link đến tất cả overview files
- Link trong overview trỏ đúng đường dẫn
