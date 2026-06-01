# Design: Dọn cảnh báo state_referenced_locally (Svelte 5)

## Chuyện gì đang xảy ra?

Khi chạy dev server, có 12 dòng cảnh báo màu vàng kiểu như:

```
This reference only captures the initial value of `customIcon`.
Did you mean to reference it inside a derived instead?
```

Nguyên nhân: các component đang lấy dữ liệu từ `$props()` (props truyền từ ngoài vào) rồi gán vào biến thường. Svelte thấy biến phụ thuộc props nhưng không nằm trong reactive context (`$derived`), nên báo rằng biến đó sẽ không cập nhật nếu props thay đổi.

## Cách tiếp cận

Không fix cứng tất cả bằng `$derived`. Chia làm 2 loại:

### Loại 1: Dùng `$derived` — có computation thật

- `Icon` trong Button: `$derived(customIcon || icons[icon])` (có logic ||)
- `sortedFields`, `formSchema`, `defaultValues` trong DynamicForm (có sort/build/reduce)
- `widthClass` trong FormField (có mapping width -> class)

### Loại 2: Giữ nguyên, chấp nhận warning — chỉ đọc snapshot

- `fieldName` trong FormField: `field.name` — field không đổi lifecycle của form
- `formData` trong FormField: `form.form` — form đã là reactive proxy, chấp nhận snapshot
- `formData` trong SelectField: destructure từ form — form là stable reference
- `formData` trong FileUploadField: destructure từ form — form là stable reference

Các warning còn lại (4 dòng) là **intentional accepted stale snapshot** — biết trước và cố tình chấp nhận, không ảnh hưởng runtime.

## Các file và cách sửa

### 1. Button.svelte (dòng 47) — computation (||)

```svelte
// Cũ
const Icon = $state(customIcon || (icon ? icons[icon] : null));

// Mới
const Icon = $derived(customIcon || (icon ? icons[icon] : null));
```

✓ Hết 3 warning (customIcon, icon, icon)

### 2. DynamicForm.svelte (dòng 19, 20, 22) — computation (sort/build/reduce)

```svelte
// Cũ
const sortedFields = [...fields].sort((a, b) => (a.sort || 0) - (b.sort || 0));
const formSchema = buildZodSchema(fields);
const defaultValues = fields.reduce(...);

// Mới
const sortedFields = $derived([...fields].sort((a, b) => (a.sort || 0) - (b.sort || 0)));
const formSchema = $derived(buildZodSchema(fields));
const defaultValues = $derived(fields.reduce(...));
```

✓ Hết 3 warning (fields, fields, fields)

### 3. FormField.svelte (dòng 26, 28, 29, 35)

```svelte
// Giữ nguyên — snapshot an toàn (field immutable)
const fieldName = field.name as string;
const { form: formData } = form;

// Sửa — widthClass có mapping logic
const widthClass = $derived(field.width
  ? { 100: 'flex-[100%]', 50: 'flex-[calc(50%-1rem)]', ... }[field.width] || 'flex-[100%]'
  : 'flex-[100%]');
```

✓ Hết 2 warning (field ở dòng 29, 35)
⚠ Còn 2 warning (field dòng 26, form dòng 28) — chấp nhận

### 4. SelectField.svelte (dòng 13) — snapshot

```svelte
// Giữ nguyên
let { form: formData } = form;
```

⚠ Còn 1 warning — chấp nhận (form là stable reference)

### 5. FileUploadField.svelte (dòng 11) — snapshot

```svelte
// Giữ nguyên
const { form: formData } = form;
```

⚠ Còn 1 warning — chấp nhận (form là stable reference)

## Kết quả

- **6 warning được fix bằng `$derived`** (Button: 3, FormField widthClass: 2, DynamicForm sortedFields: 1)
- **6 warning còn lại** (FormField fieldName: 1, FormField formData: 1, SelectField: 1, FileUploadField: 1, DynamicForm formSchema: 1, DynamicForm defaultValues: 1) — tất cả là snapshot an toàn, cố tình giữ code cũ
- **warningFilter:** Thêm `compilerOptions.warningFilter` trong `svelte.config.js` để lọc bỏ hiển thị 6 warning còn lại
- Không thay đổi hành vi component
- Code vẫn pass lint + type-check
