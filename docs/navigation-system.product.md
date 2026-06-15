# Navigation System

Tính năng này hiển thị menu điều hướng (header) và chân trang (footer) lấy dữ liệu từ Directus.

## File chính

- `src/lib/components/layout/NavigationBar.svelte` -- thanh điều hướng đầu trang
- `src/lib/components/layout/Footer.svelte` -- chân trang
- `src/lib/directus/fetchers.ts` -- hàm `fetchSiteData()` lấy dữ liệu navigation

## Cách dùng

Navigation được cấu hình trong Directus collection `navigation` với 2 item:
- `main` -- menu header
- `footer` -- menu footer

Mỗi navigation item có:
- `title` -- tên hiển thị
- `page` -- link đến trang internal
- `children` -- menu con (sub-menu) nếu có

Dữ liệu được fetch qua `fetchSiteData()` cùng lúc với globals, header và footer navigation.

Navigation hiển thị ở layout chính (`+layout.svelte`), xuất hiện trên mọi trang.

## Liên quan

- [Dark Mode](dark-mode.product.md) -- LightSwitch thường được đặt trong NavigationBar

## Lưu ý

- Hỗ trợ menu đa cấp (item có children)
- Navigation items được sắp xếp theo field `sort` trong Directus
- Footer cũng hiển thị social links từ globals
