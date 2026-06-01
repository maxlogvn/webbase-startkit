# Plan: Tài liệu hóa các tính năng đã có

## Các bước thực hiện

### Bước 1: Cập nhật ROADMAP.md
- [X] Thêm mục "Tài liệu hóa các tính năng đã có" với trạng thái "Đang làm"
- [X] Thêm ghi chú chi tiết cho 16 tính năng
- [X] Chia thành 2 nhóm: đã có tài liệu (3), thiếu tài liệu (13)

### Bước 2: Viết design doc
- [X] `docs/designs/documentation-audit.design.md`

### Bước 3: Viết spec
- [X] `docs/specs/documentation-audit.spec.md`

### Bước 4: Viết plan
- [X] `docs/plans/documentation-audit.plan.md`

### Bước 5: Viết 13 product + overview files

Mỗi file product + overview follow template trong spec. Thứ tự ưu tiên: tính năng độc lập trước, tính năng phụ thuộc vào nhau sau.

1. [X] `docs/products/directus-sdk-client.product.md` + `docs/overviews/directus-sdk-client.overview.md`
2. [X] `docs/products/draft-preview.product.md` + `docs/overviews/draft-preview.overview.md`
3. [X] `docs/products/visual-editing.product.md` + `docs/overviews/visual-editing.overview.md`
4. [X] `docs/products/dark-mode.product.md` + `docs/overviews/dark-mode.overview.md`
5. [X] `docs/products/enhanced-image.product.md` + `docs/overviews/enhanced-image.overview.md`
6. [X] `docs/products/search-api.product.md` + `docs/overviews/search-api.overview.md`
7. [X] `docs/products/navigation-system.product.md` + `docs/overviews/navigation-system.overview.md`
8. [X] `docs/products/seo-management.product.md` + `docs/overviews/seo-management.overview.md`
9. [X] `docs/products/redirect-handling.product.md` + `docs/overviews/redirect-handling.overview.md`
10. [X] `docs/products/type-generation.product.md` + `docs/overviews/type-generation.overview.md`
11. [X] `docs/products/zod-schema-builder.product.md` + `docs/overviews/zod-schema-builder.overview.md`
12. [X] `docs/products/form-builder.product.md` + `docs/overviews/form-builder.overview.md`
13. [X] `docs/products/blog-system.product.md` + `docs/overviews/blog-system.overview.md`

### Bước 6: Tạo docs/products/ và chuyển overview thành product

- [X] Tạo thư mục `docs/products/`
- [X] Copy 13 overview files thành `.product.md` trong `docs/products/`
- [X] Cập nhật link trong ROADMAP.md từ `overviews/` sang `products/`
- [X] Cập nhật link nội bộ trong product files
- [X] Cập nhật Welcome.md, WORKFLOW.md, AGENTS.md để ghi nhận thư mục products/

### Bước 7: Kiểm tra
- [X] Kiểm tra nội dung: mỗi product trả lời đủ 4 câu, khớp với code
- [X] Kiểm tra format: chính tả, link, đường dẫn
- [X] ROADMAP.md có link đến tất cả product và overview files

### Bước 8: Cập nhật ROADMAP.md
- [X] Đánh dấu "Hoàn thành" cho mục tài liệu hóa

## Ghi chú
- Không thay đổi code
- Product viết bằng tiếng Việt
- Nếu code và tài liệu mâu thuẫn, ưu tiên code
