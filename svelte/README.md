# SvelteKit CMS Template with Directus Integration

This is a **SvelteKit-based CMS Template** fully integrated with [Directus](https://directus.io/), offering
a headless CMS solution for managing and delivering content seamlessly. The template leverages modern technologies like
**Tailwind CSS**, and **Shadcn components**, providing a complete and scalable starting
point for building CMS-powered web applications.

## Features

- **SvelteKit file-based routing**: Uses SvelteKit file-based routing for layouts and dynamic routes.
- **Full Directus Integration**: Directus API integration for fetching and managing relational data.
- **Tailwind CSS**: Fully integrated for rapid UI styling (v4).
- **TypeScript**: Ensures type safety and reliable code quality.
- **Shadcn Components**: Pre-built, customizable UI components for modern design systems.
- **ESLint & Prettier**: Enforces consistent code quality and formatting.
- **Dynamic Page Builder**: A page builder interface for creating and customizing CMS-driven pages.
- **Preview Mode**: Built-in draft/live preview for editing unpublished content.
- **Visual Editing**: Inline content editing via Directus Visual Editor overlay.
- **Redirect Handling**: Server-side URL redirects managed through Directus.
- **Dark Mode**: Light/dark mode toggle using `mode-watcher`.
- **Production Docker**: Deploy as Docker container with `@sveltejs/adapter-node`.

---

## Draft Mode in Directus and Live Preview

### Draft Mode Overview

Directus allows you to work on unpublished content using **Draft Mode**. This SvelteKit template is configured to support
Directus Draft Mode out of the box, enabling live previews of unpublished or draft content as you make changes.

### Live Preview Setup

[Directus Live Preview](https://directus.io/docs/tutorials/getting-started/implementing-live-preview-in-sveltekit)

- The live preview feature works seamlessly on deployed environments.
- **For Local Development**: If using local Docker, the CSP configuration is provided in `.env.example`. See [`../backend/README.md`](../backend/README.md#content-security-policy-csp-and-preview-issues) for details.
- **For Directus Cloud**: Directus Cloud requires HTTPS for previews. You'll need to use HTTPS tunneling (ngrok, localtunnel, etc.) or configure CSP in your Directus Cloud settings.

---

## Getting Started

### Prerequisites

To set up this template, ensure you have the following:

- **Node.js** (18.x or newer)
- **pnpm** (8+)
- Access to a **Directus** instance ([cloud or self-hosted](../README.md))

## Directus Setup Instructions

For instructions on setting up Directus, see [`../backend/README.md`](../backend/README.md).

### Environment Variables

To get started, you need to configure environment variables. Follow these steps:

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Update the following variables in your `.env` file:**
   - **`PUBLIC_DIRECTUS_URL`**: URL of your Directus instance.
   - **`PUBLIC_SITE_URL`**: The public URL of your site. Used for SEO metadata and blog post routing.
   - **`DIRECTUS_SERVER_TOKEN`**: Token from the **Webmaster** account in Directus. Used server-side for preview, draft content, and form submissions.
   - **`DIRECTUS_ADMIN_TOKEN`**: Admin token for local type generation only. Never used at runtime.
   - **`PUBLIC_ENABLE_VISUAL_EDITING`**: Visual editing is enabled by default. Set to `false` to disable.

## Running the Application

### Local Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000).

> For the full stack (backend + frontend), run `pnpm dev` from the root directory.

## Production Build

```bash
pnpm run build
```

The production build outputs to the `build/` directory and can be run with:

```bash
node build/index.js
```

For Docker deployment, use the root-level `Dockerfile` with `@sveltejs/adapter-node`.

## Generate Directus Types

This repository includes a [utility](https://www.npmjs.com/package/directus-sdk-typegen) to generate TypeScript types
for your Directus schema.

#### Usage

1. Ensure your `.env` file is configured as described above.
2. Run the following command:
   ```bash
   pnpm run generate:types
   ```
3. When prompted, enter your Directus admin token (with permissions to read system collections like `directus_fields`), or set it ahead of time via the `DIRECTUS_ADMIN_TOKEN` environment variable for non-interactive runs (e.g., CI).

> **Note:** The type generation requires an admin token with permissions to read system collections like `directus_fields`. You can either provide the admin token interactively when prompted, or set it via the `DIRECTUS_ADMIN_TOKEN` environment variable (e.g., `DIRECTUS_ADMIN_TOKEN=your_token pnpm run generate:types`) to run without a TTY.

## Folder Structure

```
src/
├── app.d.ts
├── app.html                                    # Main app.html
├── fonts.css
├── globals.css
├── hooks.server.ts                             # Server hook (redirect handling)
├── lib
│   ├── components
│   │   ├── blocks                              # Block builder elements
│   │   │   ├── BaseBlock.svelte
│   │   │   ├── Button.svelte
│   │   │   ├── ButtonGroup.svelte
│   │   │   ├── Form.svelte
│   │   │   ├── Gallery.svelte
│   │   │   ├── Hero.svelte
│   │   │   ├── Posts.svelte
│   │   │   ├── Pricing.svelte
│   │   │   ├── PricingCard.svelte
│   │   │   └── RichText.svelte
│   │   ├── forms                               # Dynamic Forms
│   │   │   ├── DynamicForm.svelte
│   │   │   ├── FormBuilder.svelte
│   │   │   ├── FormField.svelte
│   │   │   └── fields
│   │   │       ├── CheckBoxGroupField.svelte
│   │   │       ├── FileUploadField.svelte
│   │   │       ├── RadioGroup.svelte
│   │   │       └── SelectField.svelte
│   │   ├── layout                              # General Layout
│   │   │   ├── Footer.svelte
│   │   │   ├── LightSwitch.svelte
│   │   │   ├── NavigationBar.svelte
│   │   │   └── PageBuilder.svelte
│   │   ├── shared
│   │   │   └── DirectusImage.svelte            # Image Component for all assets from Directus
│   │   └── ui                                  # ShadCn and custom components
│   │       ├── Container.svelte
│   │       ├── Form.svelte
│   │       ├── Headline.svelte
│   │       ├── SearchModal.svelte
│   │       ├── ShareDialog.svelte
│   │       ├── Tagline.svelte
│   │       ├── Text.svelte
│   │       ├── Title.svelte
│   │       ├── badge/
│   │       ├── button/
│   │       ├── checkbox/
│   │       ├── collapsible/
│   │       ├── command/
│   │       ├── dialog/
│   │       ├── dropdown-menu/
│   │       ├── form/
│   │       ├── input/
│   │       ├── label/
│   │       ├── pagination/
│   │       ├── radio-group/
│   │       ├── select/
│   │       ├── separator/
│   │       ├── textarea/
│   │       └── tooltip/
│   ├── directus
│   │   ├── directus-utils.ts
│   │   ├── directus.ts
│   │   ├── fetchers.ts                             # All Directus API queries
│   │   ├── fetchRedirects.ts
│   │   ├── visualEditing.ts
│   │   └── generateDirectusTypes.ts
│   ├── types
│   │   └── directus-schema.ts
│   ├── utils.ts
│   └── zodSchemaBuilder.ts
└── routes
    ├── +error.svelte
    ├── +layout.server.ts
    ├── +layout.svelte
    ├── [...permalink]                              # Dynamic page routes
    │   ├── +page.server.ts
    │   └── +page.svelte
    ├── api
    │   ├── forms
    │   │   └── submit
    │   │       └── +server.ts
    │   └── search
    │       └── +server.ts
    └── blog
        └── [slug]                                  # /blog route
            ├── +page.server.ts
            └── +page.svelte
```

---

> **Note:** This starter uses `@sveltejs/adapter-node` by default for Docker deployment.
