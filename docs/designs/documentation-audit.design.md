# Design: Tài liệu hóa các tính năng đã có

## Mục tiêu

Rà soát toàn bộ codebase, ghi nhận tất cả tính năng đã được code, cập nhật Roadmap với trạng thái chính xác, và bổ sung tài liệu product cho các tính năng chưa có.

## Phạm vi

Tổng cộng **16 tính năng**, chia làm 2 nhóm:

### Nhóm 1: Đã có tài liệu (giữ nguyên -- 3 tính năng)
1. Nâng cấp packages 2026
2. Block builder
3. Routing

### Nhóm 2: Đã code, thiếu tài liệu (cần viết mới -- 13 tính năng)
4. Directus SDK client
5. Draft / Preview mode
6. Directus Visual Editor
7. Dynamic form builder + submission
8. Search API
9. Redirect handling (server hook)
10. Type generation từ Directus schema
11. Dark mode (mode-watcher)
12. Enhanced image (DirectusImage)
13. Blog system (nâng cao)
14. Navigation system
15. SEO management
16. Zod schema builder

## Cách tiếp cận

### Đầu ra
- **Spec tổng thể** -- `docs/specs/documentation-audit.spec.md` (một file duy nhất cho toàn bộ dự án)
- **Plan tổng thể** -- `docs/plans/documentation-audit.plan.md` (một file duy nhất)
- **Product** (cho mỗi tính năng nhóm 2) -- `docs/products/<tên>.product.md`, 13 files -- tài liệu tính năng cho developer

Không viết spec hay plan riêng cho từng tính năng vì đây là dự án tài liệu thuần túy, không có thay đổi code.

### Thứ tự ưu tiên (kèm định nghĩa "done")
1. **Cập nhật Roadmap** -- done khi ROADMAP.md có trạng thái "Đang làm" (đã xong).
2. **Viết design** -- done khi bạn approve file này (đang làm).
3. **Viết spec tổng thể** -- một file `.spec.md` duy nhất mô tả toàn bộ dự án tài liệu hóa (không tách từng tính năng). Done khi được bạn approve.
4. **Viết plan tổng thể** -- một file `.plan.md` liệt kê các bước cụ thể để viết 13 product files. Done khi được bạn approve.
5. **Viết 13 product files** tại `docs/products/` -- tài liệu tính năng cho developer. Done khi tất cả file đã tạo.
6. **Review + chỉnh sửa** -- đọc lại toàn bộ, sửa lỗi, đảm bảo nhất quán. Done khi không còn lỗi.
7. **Cập nhật Roadmap** -- đánh dấu "Hoàn thành" cho mục tài liệu hóa. Done khi ROADMAP.md được cập nhật.

> **Lưu ý về thứ tự spec → plan:** Thông thường plan viết trước spec. Ở đây tôi đảo lại vì spec mô tả "cần viết gì" (nội dung), còn plan mô tả "viết thế nào" (các bước gõ phím). Với dự án tài liệu thuần túy, biết nội dung trước mới lên kế hoạch được -- nên spec trước plan là hợp lý.

### Cấu trúc mỗi product
- Tính năng làm gì?
- File/component chính ở đâu?
- Cách dùng / cấu hình?
- Lưu ý quan trọng?

## Rủi ro / Lưu ý

- Không thay đổi code -- chỉ viết tài liệu dựa trên code hiện tại
- Nếu code và tài liệu mâu thuẫn => ưu tiên code là nguồn sự thật
- Product viết bằng tiếng Việt, ngắn gọn, dễ hiểu
- Roadmap sẽ tham chiếu đến product files sau khi hoàn thành
- Chỉ có 1 người thực hiện (AI agent)
