# Directus Visual Editor

Tính năng này cho phép chỉnh sửa nội dung trực tiếp trên trang frontend thông qua overlay, giúp người quản trị nội dung thao tác trực quan mà không cần vào Directus admin.

## File chính

- `src/lib/directus/visualEditing.ts` -- wrapper cho thư viện `@directus/visual-editing`
- `src/routes/+layout.svelte` -- nơi kích hoạt visual editing và áp overlay sau mỗi lần điều hướng
- `src/routes/+layout.server.ts` -- kiểm tra query param và biến môi trường

## Cách dùng

Thêm `?visual-editing=true` vào URL trang. Nếu biến `PUBLIC_ENABLE_VISUAL_EDITING` không bị set thành `false`, overlay chỉnh sửa sẽ xuất hiện.

Các element được đánh dấu bằng attribute `data-directus` do function `setAttr()` tạo ra:

```svelte
<div data-directus={setAttr({ collection: 'pages', item: id, fields: ['title'], mode: 'modal' })}>
  {title}
</div>
```

Hỗ trợ 3 chế độ hiển thị:
- `modal` -- cửa sổ popup lớn
- `popover` -- bong bóng nhỏ gọn
- `drawer` -- bảng trượt ra từ cạnh màn hình

## Liên quan

- [Draft / Preview Mode](draft-preview.overview.md) -- visual editing sử dụng chung cơ chế preview token
- [Block Builder](../overviews/blocks.overview.md) -- nút "Edit All Blocks" chỉnh sửa toàn bộ block trên trang

## Lưu ý

- Cần cấu hình CSP trong Directus admin: thêm URL frontend vào `frame-src`
- Có thể tắt hoàn toàn bằng biến `PUBLIC_ENABLE_VISUAL_EDITING=false`
- Trạng thái visual editing được lưu trong `sessionStorage`
- CSS tùy chỉnh overlay trong `[...permalink]/+page.svelte` giúp nút "Edit All Blocks" hoạt động đúng
