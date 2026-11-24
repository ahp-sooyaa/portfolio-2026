# aunghtetpaing — portfolio

A static, single-page Astro site styled with Tailwind CSS and hosted on Cloudflare Pages at https://aunghtetpaing.pages.dev.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm build` | Static build to `./dist` |
| `pnpm preview` | Serves the last build locally |
| `pnpm preview:pages` | Builds, then serves it through Wrangler the way Pages does (404 handling, `_headers`) |

## Editing content

All content lives in `src/content/` and is checked by the Zod schemas in `src/content.config.ts`. A bad field fails the build with a clear error.

- **`site.json`**: name, bio, hero badges, the facts strip, email, socials, the stack groups, "Currently learning" and section intros.
- **`experience.json`**: one object per role. `start` and `end` use `YYYY-MM`. Leave out `end` for a current role.
- **`projects/<slug>/index.md`**: one folder per project, with its images beside the Markdown file.
  - `featured: true` shows the large card. `highlights` fills its step panel.
  - `layout: card` (the default) puts it in the grid. `layout: list` puts it under "More experiments".
  - `order` sets the order. Each project needs a `liveUrl` or a `repoUrl`.
  - `thumbnail` is optional (`src` and the required `alt`). Cards and case study pages show it; a 1600×900 WebP works well.

### Case studies

1. Write the case study in the project's `index.md` body (Markdown; styled by `.case-study` in `global.css`).
2. Set `hasDetail: true`. It's published at `/projects/<slug>`, and the featured button or card links to it.
3. Optionally add `role`, `timeframe` and `status` (`live`, `released`, `in-progress`, `archived`) for the quick-facts row.

The page is `src/pages/projects/[slug].astro`; previous/next links follow `order`.

## Deploying

The Cloudflare Pages project `aunghtetpaing` is connected to this GitHub repo.

- A push to `main` builds and deploys to https://aunghtetpaing.pages.dev.
- A push to any other branch gets its own preview URL. Pages marks preview URLs `noindex`.
- Build settings (Workers & Pages › aunghtetpaing › Settings › Build): preset Astro, command `pnpm build`, output `dist`, env `NODE_VERSION=24`. pnpm's version comes from `packageManager` in `package.json`.
- Web Analytics is turned on in the project's Metrics tab. Cloudflare adds the tracking script itself, so it isn't in the code. It uses no cookies.
- The canonical URL comes from the fallback in `astro.config.mjs`. The sitemap, `robots.txt`, canonical and Open Graph URLs all use it. To use a custom domain later, add it under the project's Custom domains tab and change that fallback (or set `SITE_URL` in the build settings).

`public/og.png` (1200×630) is the social preview image. Replace it if you change the hero.
