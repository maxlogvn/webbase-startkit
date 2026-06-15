# Quy ước dự án

> Đọc trước khi code. Giúp codebase nhất quán và dễ maintain.

---


---

## Đặt tên

| Loại             | Convention   | Ví dụ                |
| ---------------- | ------------ | -------------------- |
| File             | `kebab-case` | `signup-form.svelte` |
| Component        | `PascalCase` | `<SignupForm />`     |
| Function         | `camelCase`  | `getUserById()`      |
| Type / Interface | `PascalCase` | `UserProfile`        |

---

## Comment & Format code

### Đầu file — Flow comment

Mỗi file server (`.server.ts`) phải có comment mô tả luồng hoạt động ở đầu file.

```ts
/**
 * Tên trang — Mô tả ngắn
 *
 * Luồng hoạt động:
 *
 *  1. Bước đầu tiên
 *     └─ Hàm xử lý
 *        ├─ Trường hợp A → kết quả A
 *        └─ Trường hợp B → kết quả B
 *
 *  2. Bước tiếp theo
 *     └─ ...
 */
```

### Phân vùng code — Section divider

Dùng divider để chia file thành các phần rõ ràng.

```ts
// ─── Tên phần ─────────────────────────────────────────────────────────────
```

Các phần thường gặp theo thứ tự:

```ts
// ─── Import ──────────────────────────────────────────────────────────────────
// ─── Types ───────────────────────────────────────────────────────────────────
// ─── Constants ───────────────────────────────────────────────────────────────
// ─── Load ────────────────────────────────────────────────────────────────────
// ─── Actions ─────────────────────────────────────────────────────────────────
// ─── Helpers ─────────────────────────────────────────────────────────────────
```

### Inline comment — Trong function

Dùng comment ngắn để đánh dấu từng bước xử lý.

```ts
// ── Bước 1: Mô tả bước
const form = await superValidate(...)

// ── Bước 2: Mô tả bước
try {
  await auth.api.signUpEmail(...)
} catch (e) {
  // Mô tả trường hợp lỗi cụ thể
  if (e instanceof APIError) { ... }

  // Lỗi không xác định
  return fail(500, { form })
}

// ── Bước 3: Kết thúc
redirect(303, '/')
```

### Quy tắc chung

- Flow comment → **bắt buộc** với mọi `.server.ts`
- Section divider → **bắt buộc** khi file có từ 2 phần trở lên
- Inline comment → **bắt buộc** trong function có nhiều bước
- Comment bằng **tiếng Việt**, mô tả **tại sao** chứ không chỉ **làm gì**

---

## Directus API

- Luôn dùng `useDirectus()` từ `$lib/directus/directus.ts`
- Rate limit: 10 requests / 500ms qua `p-queue`
- Tự động retry khi gặp HTTP 429
- Server-side: inject token qua `withToken(TOKEN, ...)` cho draft/preview
- Token server: `DIRECTUS_SERVER_TOKEN` từ env

---

## Visual Editing & Draft

- `?preview=true` + `DIRECTUS_SERVER_TOKEN` để xem draft content
- `?version=X&id=Y` cho Directus versioning
- `?visual-editing=true` kích hoạt Visual Editor overlays
- CSP trong Directus env phải include frontend URL trong `frame-src`

---

## Type Generation

- File `src/lib/types/directus-schema.ts` được sinh tự động
- Chạy `pnpm run generate:types` từ thư mục `svelte/`
- Yêu cầu `DIRECTUS_ADMIN_TOKEN` (hoặc nhập tay khi chạy)

---

## Git

- Chỉ commit khi được yêu cầu
- Không commit `.env` hoặc secrets

---

## Error Handling

### Trong +page.server.ts / +server.ts

Dùng `fail()` cho lỗi validation hoặc lỗi người dùng có thể xử lý:

```ts
if (!data) {
  return fail(404, { message: 'Không tìm thấy nội dung' })
}
```

Dùng `error()` của SvelteKit cho lỗi cần hiển thị trang lỗi:

```ts
import { error } from '@sveltejs/kit'

if (!page) {
  error(404, 'Trang không tồn tại')
}
```

Dùng `try/catch` bao quanh Directus SDK call, log lỗi và trả về fallback:

```ts
// -- Bước 2: Lấy dữ liệu từ Directus
try {
  const data = await fetchPage(client, slug)
  if (!data) error(404, 'Không tìm thấy')
  return { page: data }
} catch (e) {
  // Lỗi kết nối hoặc timeout
  console.error('Directus error:', e)
  error(500, 'Lỗi server')
}
```

### Quy tắc chung
- Không để lỗi Directus SDK bubble lên thẳng client
- Log lỗi bằng `console.error` trước khi throw/return
- Comment bằng tiếng Việt mô tả loại lỗi cụ thể

---

## Fetcher Pattern

Tất cả Directus query phải viết trong `src/lib/directus/fetchers.ts`.
Không gọi SDK trực tiếp trong load function.

### Template fetcher mới

```ts
// --- Ten fetcher ---

export async function fetchTenFeature(
  client: DirectusClient,          // client từ useDirectus()
  params: { slug: string },        // params cụ thể
  options?: { preview?: boolean }  // tùy chọn draft/preview
): Promise<TenType | null> {
  try {
    const result = await client.request(
      readItems('ten_collection', {
        filter: { slug: { _eq: params.slug } },
        fields: ['id', 'title', 'slug', '...'],
        limit: 1,
      })
    )
    return result[0] ?? null
  } catch {
    return null
  }
}
```

### Dùng với draft/preview

```ts
// Trong +page.server.ts -- inject token cho preview và draft
const client = useDirectus()
const authedClient = withToken(DIRECTUS_SERVER_TOKEN, client)
const data = await fetchTenFeature(authedClient, { slug }, { preview: true })
```

### Quy tắc chung
- Return `null` thay vì throw khi không tìm thấy data
- Khai báo rõ return type, không dùng `any`
- Dùng `fields` array để chỉ lấy field cần thiết, không lấy `['*']`
