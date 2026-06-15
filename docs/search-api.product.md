# Search API

Tính năng này cung cấp endpoint API để tìm kiếm nội dung trong Pages và Posts.

## File chính

- `src/routes/api/search/+server.ts` -- endpoint API xử lý tìm kiếm (70 dòng)

## Cách dùng

Gửi request GET đến `/api/search?search=từ_khóa` với tối thiểu 3 ký tự.

Kết quả trả về là JSON array:

```json
[
  {
    "id": "1",
    "title": "Giới thiệu",
    "type": "Page",
    "link": "/gioi-thieu"
  },
  {
    "id": "2",
    "title": "Bài viết mẫu",
    "description": "Mô tả bài viết",
    "type": "Post",
    "link": "/blog/bai-viet-mau"
  }
]
```

Tìm kiếm trong:
- **Pages:** title, permalink
- **Posts:** title, description, slug, content (chỉ bài đã published)

## Liên quan

- [Blog System](blog-system.product.md) -- posts là một trong 2 nguồn tìm kiếm
- [Routing](routing.product.md) -- trang CMS từ pages là nguồn còn lại

## Lưu ý

- Yêu cầu ít nhất 3 ký tự, nếu không trả về lỗi 400
- Tìm kiếm dùng `_contains` filter (tìm chuỗi con, không phân biệt hoa thường)
- Chưa hỗ trợ: full-text search, sắp xếp kết quả, phân trang
