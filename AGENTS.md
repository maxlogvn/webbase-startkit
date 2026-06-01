# AGENTS.md

Huong dan danh cho AI agent khi lam viec voi du an nay. Doc ky truoc khi viet bat ky dong code nao.

---

## Doc truoc khi bat dau

Cac tai lieu duoi day chua toan bo ngu canh quan trong cua du an — **khong bo qua**:

| Tai lieu                                     | Noi dung |
|----------------------------------------------|---|
| [docs/Welcome.md](docs/Welcome.md)         | Tong quan du an |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Quy uoc dat ten, cau truc file, phong cach code |
| [docs/STACK.md](docs/STACK.md)             | Cong nghe su dung |
| [docs/ROADMAP.md](docs/ROADMAP.md)         | Theo doi tien do tat ca tinh nang |
| [docs/WORKFLOW.md](docs/WORKFLOW.md)       | Quy trinh phat trien tinh nang tu dau den cuoi |

---

## Quy trinh phat trien (bat buoc)

Moi tinh nang thay doi **phai** tuan theo quy trinh trong [docs/WORKFLOW.md](docs/WORKFLOW.md):

1. **Cap nhat ROADMAP.md** -> danh dau "Dang lam"
2. **Viet docs/designs/** -> brainstorm, de xuat giai phap
3. **Viet docs/specs/** -> dac ta chi tiet
4. **Viet docs/plans/** -> ke hoach tung buoc
5. **Review** -> cho nguoi dung duyet spec + plan
6. **Code** -> thuc hien theo plan
7. **Kiem tra** -> lint, type-check, test
8. **Cap nhat ROADMAP.md** -> danh dau "Hoan thanh"

> **Khong duoc bo qua bat ky buoc nao.** Dac biet, KHONG duoc chuyen thang sang buoc 6 (Code) ma khong co design, spec, plan, va review tu nguoi dung.

---

## Cau truc thu muc

| Thu muc | Mo ta |
|---|---|
| directus/ | Directus CMS, Docker Compose, PostgreSQL, Redis |
| svelte/ | SvelteKit frontend (package name: sveltekit) |
| docs/ | Obsidian vault — thiet ke, spec, ke hoach, tong quan |

---

## Quy uoc code quan trong

Ap dung nhat quan trong toan bo codebase:

- **Adapter:** Dung dapter-vercel mac dinh. Chuyen sang dapter-netlify khi co yeu cau.
- **Styling:** Tailwind + shadcn-svelte. Prettier: dung tab, single quotes, printWidth: 100, khong trailing comma.
- **Server files:** Moi file .server.ts phai co flow comment o dau file, section divider dang // --- Ten section ---, comment bang tieng Viet.
- **Directus SDK:** Client duoc gioi han toc do (10 req / 500ms) qua p-queue, tu dong retry khi gap loi 429.
- **Fetchers:** Dat tat ca query vao src/lib/directus/fetchers.ts. Khong goi SDK truc tiep trong ham load.
- **Package manager:** Dung pnpm voi save-exact=true — luon ghim phien ban chinh xac.

---

## Bien moi truong

| Bien | Pham vi su dung |
|---|---|
| PUBLIC_DIRECTUS_URL | URL cua Directus instance |
| PUBLIC_SITE_URL | URL cong khai cua site (SEO, sitemap) |
| DIRECTUS_SERVER_TOKEN | Token Webmaster — dung server-side khi xem draft/preview |
| DIRECTUS_ADMIN_TOKEN | Chi dung de sinh TypeScript types, **khong** dung luc runtime |

---

## Sinh TypeScript types

pnpm run generate:types

Yeu cau bien DIRECTUS_ADMIN_TOKEN trong env (hoac nhap tay khi duoc hoi). Output ghi vao src/lib/types/directus-schema.ts.

---

## Loi svelte-check da biet

> **Bo qua ~54 loi TypeScript** tu src/lib/components/ui/ (shadcn-svelte) — nguyen nhan la xung dot phien ban bits-ui, khong lien quan den code cua minh.
>
> Khi chay pnpm run check, chi can quan tam den cac loi **moi phat sinh** tu code ban vua them hoac sua.

---

## Visual editing va draft content

Cac query parameter de kiem tra noi dung chua xuat ban:

| Query parameter | Tac dung |
|---|---|
| ?preview=true | Xem draft content — yeu cau DIRECTUS_SERVER_TOKEN |
| ?version=X&id=Y | Xem noi dung theo phien ban cu the (Directus versioning) |
| ?visual-editing=true | Bat Visual Editor (tat duoc qua bien PUBLIC_ENABLE_VISUAL_EDITING=false) |

> **Luu y:** De Visual Editor hoat dong, CSP trong Directus env phai them URL cua frontend vao rame-src.
