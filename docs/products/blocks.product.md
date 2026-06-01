
## Blocks hiện có

| Block | Component | Directus collection |
|---|---|---|
| Hero | `blocks/Hero.svelte` | `block_hero` |
| Rich Text | `blocks/RichText.svelte` | `block_richtext` |
| Gallery | `blocks/Gallery.svelte` | `block_gallery` |
| Pricing | `blocks/Pricing.svelte` | `block_pricing` |
| Posts | `blocks/Posts.svelte` | `block_posts` |
| Form | `blocks/Form.svelte` | `block_form` |

Mapping được định nghĩa trong `blocks/BaseBlock.svelte`.

## Cách thêm block mới

### Bước 1: Tạo collection trong Directus
Vào Directus admin -> Collections -> Tạo collection mới với prefix `block_` (ví dụ: `block_testimonial`). Thêm các field cần thiết.

### Bước 2: Tạo component Svelte
Tạo file trong `src/lib/components/blocks/`. Nhận `data` làm prop:

```svelte
<script lang="ts">
  // Thay BlockHeroData bằng type thực tế của block
  let { data }: { data: BlockHeroData } = $props();
</script>

{@html data.content}
```

### Bước 3: Đăng ký vào BaseBlock
Thêm import và mapping trong `blocks/BaseBlock.svelte`:

```ts
import Testimonial from '$lib/components/blocks/Testimonial.svelte';

const components = {
  block_hero: Hero,
  block_richtext: RichText,
  // ...block mới:
  block_testimonial: Testimonial,
};
```

### Bước 4: Thêm field mapping trong fetchers.ts
Thêm field cho block mới vào `pageFields` trong `src/lib/directus/fetchers.ts`.

### Bước 5: Generate lại types
```bash
pnpm run generate:types
```

## Props interface chuẩn

Mỗi block nhận `data` từ `block.item`:

```ts
interface BlockProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    // ...field riêng của block
  };
}
```
