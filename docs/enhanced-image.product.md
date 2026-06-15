# Enhanced Image (DirectusImage)

Tính năng này cung cấp component hiển thị ảnh từ Directus với khả năng tối ưu tự động (lazy loading, responsive sizes).

## File chính

- `src/lib/components/shared/DirectusImage.svelte` -- component chính
- `src/lib/directus/directus-utils.ts` -- hàm `getDirectusAssetURL()` tạo URL ảnh từ Directus

## Cách dùng

```svelte
<DirectusImage
  uuid="uuid-của-file-trong-directus"
  alt="Mô tả ảnh"
  class="object-cover"
  fill
  sizes="(max-width: 768px) 100vw, 1200px"
/>
```

Props hỗ trợ: `uuid` (bắt buộc), `alt`, `class`, `fill`, `width`, `height`, `sizes`.

URL ảnh được tạo theo format: `${PUBLIC_DIRECTUS_URL}/assets/${uuid}`.

## Liên quan

- [Directus SDK Client](directus-sdk-client.product.md) -- dùng biến `PUBLIC_DIRECTUS_URL` chung
- [Blog System](blog-system.product.md) -- dùng DirectusImage cho ảnh bài viết và avatar tác giả

## Lưu ý

- Dùng thư viện `@sveltejs/enhanced-img` phiên bản 0.10.4 để tối ưu
- Ảnh được responsive tự động dựa vào prop `sizes`
- Có thể dùng với prop `fill` để ảnh lấp đầy container cha (cần container có `position: relative`)
