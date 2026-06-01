# Dark Mode (mode-watcher)

Tính năng này cho phép chuyển đổi giữa giao diện sáng (light) và tối (dark) trên toàn bộ ứng dụng.

## File chính

- `src/lib/components/layout/LightSwitch.svelte` -- component nút bật/tắt dark mode
- `src/routes/+layout.svelte` -- dòng `57` nơi `ModeWatcher` được khai báo

## Cách dùng

Component `ModeWatcher` được đặt trong layout chính, tự động quản lý trạng thái sáng/tối. Component `LightSwitch` hiển thị nút chuyển đổi ở giao diện người dùng.

Thư viện `mode-watcher` tích hợp sẵn với Tailwind CSS, chỉ cần dùng class `dark:` trong CSS.

```svelte
<div class="bg-white dark:bg-gray-900">
  Nền sẽ tự động đổi màu khi chuyển dark mode.
</div>
```

## Liên quan

- [Navigation System](navigation-system.overview.md) -- LightSwitch thường được đặt trong NavigationBar

## Lưu ý

- Sử dụng thư viện `mode-watcher` phiên bản 1.1.0
- Trạng thái dark mode được lưu trong localStorage, giữ nguyên khi reload trang
- Tích hợp với biến CSS `--accent-color` để đảm bảo màu nhấn hoạt động tốt trên cả 2 chế độ
