# Auth System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xay dung he thong auth cho end-user (login email/pass + OAuth Google/GitHub, register, profile, admin toggle provider)

**Architecture:** Directus xu ly OAuth gateway + user management. SvelteKit quan ly session cookie httpOnly, giao dien login/register/profile, admin panel.

**Tech Stack:** Svelte 5 runes, Directus SDK v21, shadcn-svelte, Tailwind CSS v4, adapter-node

---

### Task 1: Cau hinh backend (env vars + Directus collection)

**Files:**
- Modify: `backend/.env.example`
- Modify: `svelte/src/lib/types/directus-schema.ts`

- [ ] **Them OAuth env vars vao `backend/.env.example`**
- [ ] **Tao collection `auth_providers` trong Directus Admin UI**
- [ ] **Seed du lieu mau**

### Task 2: Session management (`session.ts` + `hooks.server.ts`)

**Files:**
- Create: `svelte/src/lib/server/session.ts`
- Modify: `svelte/src/hooks.server.ts`
- Modify: `svelte/src/app.d.ts`

### Task 3: Directus SDK auth methods + fetchers

**Files:**
- Modify: `svelte/src/lib/directus/directus.ts`
- Modify: `svelte/src/lib/directus/fetchers.ts`

### Task 4: Login page (email/password + OAuth)

**Files:**
- Create: `svelte/src/routes/auth/login/+page.server.ts`
- Create: `svelte/src/routes/auth/login/+page.svelte`

### Task 5: Register page

**Files:**
- Create: `svelte/src/routes/auth/register/+page.server.ts`
- Create: `svelte/src/routes/auth/register/+page.svelte`

### Task 6: OAuth callback handler

**Files:**
- Create: `svelte/src/routes/auth/callback/+server.ts`

### Task 7: Logout handler

**Files:**
- Create: `svelte/src/routes/auth/logout/+server.ts`

### Task 8: Account/Profile page

**Files:**
- Create: `svelte/src/routes/account/+page.server.ts`
- Create: `svelte/src/routes/account/+page.svelte`

### Task 9: Auth components

**Files:**
- Create: `svelte/src/lib/components/auth/AuthButtons.svelte`
- Create: `svelte/src/lib/components/auth/UserMenu.svelte`
- Create: `svelte/src/lib/components/auth/LoginPrompt.svelte`

### Task 10: Layout cap nhat (UserMenu + user data)

**Files:**
- Modify: `svelte/src/routes/+layout.server.ts`
- Modify: `svelte/src/routes/+layout.svelte`

### Task 11: Form submission dung user token

**Files:**
- Modify: `svelte/src/routes/api/forms/submit/+server.ts`

### Task 12: Admin auth panel

**Files:**
- Create: `svelte/src/routes/admin/auth/+page.server.ts`
- Create: `svelte/src/routes/admin/auth/+page.svelte`
