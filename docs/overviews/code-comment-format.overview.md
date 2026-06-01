# Overview: Chuẩn hóa code comment và format theo CONVENTIONS.md

## Kế hoạch ban đầu

Chia thành 7 phase, mỗi phase là một nhóm file cùng loại, chạy lint + check sau mỗi phase:

| Phase | Nhóm file | Số lượng |
|-------|-----------|----------|
| 1 | Server files `.server.ts` | 6 |
| 2 | Directus library `src/lib/directus/*.ts` | 6 |
| 3 | Lib utilities `src/lib/*.ts` | 2 |
| 4 | Block components `src/lib/components/blocks/*.svelte` | 10 |
| 5 | Form components `src/lib/components/forms/**/*.svelte` | 7 |
| 6 | Layout + shared + ui custom `src/lib/components/{layout,shared,ui}/*.svelte` | 13 |
| 7 | Route pages `src/routes/*.svelte` | 2 |

**Tổng cộng:** 46 file

## Sai lệch so với kế hoạch

- Phase 5: thực tế có 7 file (3 + 4 trong `fields/`), kế hoạch ghi 6 file.
- Phase 6: thực tế có 13 file (4 layout + 1 shared + 8 ui), kế hoạch ghi 9 file vì chưa tính các UI component tự viết.
- Không phát hiện sai lệch về nội dung — tất cả các file trong phạm vi đều được xử lý.

## Những gì đã làm

### Phase 1: Server files (`.server.ts`)

Thêm flow comment đầu file, section divider, inline comment cho 6 file:

- `src/hooks.server.ts` — redirect handling + CORS headers
- `src/routes/+layout.server.ts` — load globals + navigation + SEO
- `src/routes/[...permalink]/+page.server.ts` — load page by permalink
- `src/routes/blog/[slug]/+page.server.ts` — load blog post + related posts
- `src/routes/api/forms/submit/+server.ts` — form submission endpoint
- `src/routes/api/search/+server.ts` — search endpoint

### Phase 2: Directus library (`src/lib/directus/*.ts`)

Thêm section divider + inline comment cho 6 file:

- `directus.ts` — client setup + rate limit + retry
- `directus-utils.ts` — helper functions (asset URL, token injection)
- `fetchers.ts` — tất cả query functions
- `fetchRedirects.ts` — redirect loading
- `visualEditing.ts` — visual editing setup
- `generateDirectusTypes.ts` — type generation script

### Phase 3: Lib utilities (`src/lib/*.ts`)

Thêm section divider + inline comment cho 2 file:

- `utils.ts` — utility functions (cn, debounce)
- `zodSchemaBuilder.ts` — dynamic Zod schema builder

### Phase 4: Block components (10 file)

Thêm inline comment cho tất cả block Svelte components:

- `BaseBlock.svelte`, `Button.svelte`, `ButtonGroup.svelte`
- `Form.svelte`, `Gallery.svelte`, `Hero.svelte`
- `Posts.svelte`, `Pricing.svelte`, `PricingCard.svelte`, `RichText.svelte`

### Phase 5: Form components (7 file)

Thêm inline comment cho form components:

- `DynamicForm.svelte`, `FormBuilder.svelte`, `FormField.svelte`
- `fields/CheckBoxGroupField.svelte`, `fields/FileUploadField.svelte`
- `fields/RadioGroup.svelte`, `fields/SelectField.svelte`

### Phase 6: Layout + shared + ui custom (13 file)

Thêm inline comment:

- Layout: `NavigationBar.svelte`, `Footer.svelte`, `LightSwitch.svelte`, `PageBuilder.svelte`
- Shared: `DirectusImage.svelte`
- UI: `Container.svelte`, `Headline.svelte`, `Tagline.svelte`, `Text.svelte`, `Title.svelte`, `SearchModal.svelte`, `ShareDialog.svelte`, `Form.svelte`

### Phase 7: Route pages (2 file)

Thêm inline comment:

- `+error.svelte`, `+layout.svelte`

## Kiểm tra

### Lint (ESLint + Prettier)

- Pass hoàn toàn ở phase 1-3.
- Phase 4-7: phát hiện lỗi `{/* ... */}` (cú pháp JSX) trong template Svelte — đã sửa thành `<!-- ... -->`.
- Sau khi sửa: **pass**.

### Type check (svelte-check)

- 55 lỗi — tất cả từ shadcn-svelte (`dropdown-menu-*.svelte`) và `DynamicForm.svelte` (lỗi type instantiation đã biết).
- **Không có lỗi mới** từ code tự viết.

## Kết luận

- Toàn bộ 46 file trong phạm vi đã được chuẩn hóa theo `docs/CONVENTIONS.md`.
- `.server.ts`: có flow comment + section divider + inline comment.
- File `.ts` có từ 2 phần trở lên: có section divider.
- File `.svelte`: có inline comment, giải thích "tại sao" bằng tiếng Việt có dấu.
- Bỏ qua đúng phạm vi: `ui/` (shadcn-svelte), `types/directus-schema.ts` (tự động sinh), `app.html`, `fonts.css`, `globals.css`.
- Lint pass, svelte-check không có lỗi mới.
