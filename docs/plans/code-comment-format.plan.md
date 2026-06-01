# Plan: Chuẩn hóa code comment và format theo CONVENTIONS.md

## Các bước thực hiện

### Phase 1: Server files (.server.ts) — 6 file
- [x] `src/hooks.server.ts` — flow comment + section divider
- [x] `src/routes/+layout.server.ts` — flow comment + section divider
- [x] `src/routes/[...permalink]/+page.server.ts` — flow comment + section divider
- [x] `src/routes/blog/[slug]/+page.server.ts` — flow comment + section divider
- [x] `src/routes/api/forms/submit/+server.ts` — flow comment + section divider
- [x] `src/routes/api/search/+server.ts` — flow comment + section divider
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 2: Directus library (src/lib/directus/) — 6 file
- [x] `directus.ts` — section divider + inline comment
- [x] `directus-utils.ts` — section divider + inline comment
- [x] `fetchers.ts` — section divider + inline comment
- [x] `fetchRedirects.ts` — section divider + inline comment
- [x] `visualEditing.ts` — section divider + inline comment
- [x] `generateDirectusTypes.ts` — section divider + inline comment
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 3: Lib utilities (src/lib/) — 2 file
- [x] `utils.ts` — section divider + inline comment
- [x] `zodSchemaBuilder.ts` — section divider + inline comment
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 4: Block components — 10 file
- [x] `BaseBlock.svelte`, `Button.svelte`, `ButtonGroup.svelte` — inline comment
- [x] `Form.svelte`, `Gallery.svelte`, `Hero.svelte` — inline comment
- [x] `Posts.svelte`, `Pricing.svelte`, `PricingCard.svelte`, `RichText.svelte` — inline comment
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 5: Form components — 7 file
- [x] `DynamicForm.svelte`, `FormBuilder.svelte`, `FormField.svelte` — inline comment
- [x] `CheckBoxGroupField.svelte`, `FileUploadField.svelte`, `RadioGroup.svelte`, `SelectField.svelte` — inline comment
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 6: Layout + shared + ui — 13 file
- [x] `Footer.svelte`, `LightSwitch.svelte`, `NavigationBar.svelte`, `PageBuilder.svelte` — inline comment
- [x] `DirectusImage.svelte` — inline comment
- [x] `Container.svelte`, `Headline.svelte`, `SearchModal.svelte`, `ShareDialog.svelte`, `Tagline.svelte`, `Text.svelte`, `Title.svelte`, `Form.svelte` — inline comment
- [x] Chạy `pnpm run lint` và `pnpm run check`

### Phase 7: Route pages — 2 file
- [x] `src/routes/+layout.svelte` — inline comment
- [x] `src/routes/+error.svelte` — inline comment

## Kiểm tra

Sau mỗi phase:
1. `pnpm run lint` — không lỗi ESLint + Prettier
2. `pnpm run check` — không lỗi svelte-check mới

## Ghi chú

- Bỏ qua `src/lib/components/ui/` (shadcn-svelte)
- Bỏ qua `src/lib/types/directus-schema.ts` (tự động sinh)
- Nếu có lỗi Prettier, chạy `pnpm run format` để tự động format
