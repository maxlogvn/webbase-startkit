# Spec: Tài liệu hóa các tính năng đã có

## Mô tả

Rà soát toàn bộ codebase SvelteKit + Directus, xác định tất cả tính năng đã được code, cập nhật Roadmap với ghi chú chi tiết, và bổ sung tài liệu product và overview cho các tính năng chưa có tài liệu.

## Yêu cầu

1. Roadmap phải liệt kê đầy đủ tất cả tính năng với trạng thái chính xác.
2. Mỗi tính năng trong nhóm 2 (gồm 13 tính năng) phải có:
   - File product tại `docs/products/<tên>.product.md` -- tài liệu tính năng cho developer
   - File overview tại `docs/overviews/<tên>.overview.md` -- báo cáo tổng quan kết quả thực hiện plan
3. Product viết bằng tiếng Việt, dễ hiểu cho developer mới vào dự án.
4. Mỗi product gồm: tính năng làm gì, file chính nằm ở đâu, cách dùng/cấu hình, lưu ý quan trọng.
5. Không thay đổi bất kỳ dòng code nào.
6. Nếu code và tài liệu mâu thuẫn, code là nguồn sự thật.

## Danh sách tính năng cần viết tài liệu

| STT | Tên tính năng | Product | Overview |
|-----|--------------|---------|----------|
| 1 | Directus SDK client | `products/directus-sdk-client.product.md` | `overviews/directus-sdk-client.overview.md` |
| 2 | Draft / Preview mode | `products/draft-preview.product.md` | `overviews/draft-preview.overview.md` |
| 3 | Directus Visual Editor | `products/visual-editing.product.md` | `overviews/visual-editing.overview.md` |
| 4 | Dynamic form builder + submission | `products/form-builder.product.md` | `overviews/form-builder.overview.md` |
| 5 | Search API | `products/search-api.product.md` | `overviews/search-api.overview.md` |
| 6 | Redirect handling | `products/redirect-handling.product.md` | `overviews/redirect-handling.overview.md` |
| 7 | Type generation từ Directus schema | `products/type-generation.product.md` | `overviews/type-generation.overview.md` |
| 8 | Dark mode (mode-watcher) | `products/dark-mode.product.md` | `overviews/dark-mode.overview.md` |
| 9 | Enhanced image (DirectusImage) | `products/enhanced-image.product.md` | `overviews/enhanced-image.overview.md` |
| 10 | Blog system | `products/blog-system.product.md` | `overviews/blog-system.overview.md` |
| 11 | Navigation system | `products/navigation-system.product.md` | `overviews/navigation-system.overview.md` |
| 12 | SEO management | `products/seo-management.product.md` | `overviews/seo-management.overview.md` |
| 13 | Zod schema builder | `products/zod-schema-builder.product.md` | `overviews/zod-schema-builder.overview.md` |

## Cấu trúc mỗi product

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
- `docs/products/*.product.md` -- 13 files (tài liệu tính năng)
- `docs/overviews/*.overview.md` -- 13 files (báo cáo tổng quan kết quả)

## Kiểm tra

### Nội dung
- Mỗi product trả lời được 4 câu: tính năng làm gì, file chính ở đâu, cách dùng thế nào, lưu ý gì?
- Mô tả khớp với code hiện tại (không bịa đặt, không suy diễn)
- Các file path trỏ đúng file có thật trong codebase

### Format
- Không lỗi chính tả, viết đúng tiếng Việt có dấu
- ROADMAP.md có link đến tất cả product và overview files
- Link giữa các product file trỏ qua lại chính xác
