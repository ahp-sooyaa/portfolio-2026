# aunghtetpaing — portfolio

A static, single-page Astro site styled with Tailwind CSS and deployed to Cloudflare Workers Static Assets.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm build` | Static build to `./dist` |
| `pnpm preview` | Serves the last build locally |
| `pnpm preview:worker` | Builds, then serves it through Wrangler like production (404 handling, `_headers`) |
| `pnpm run deploy` | `astro build && wrangler deploy` |

## Editing content

All content lives in `src/content/` and is checked by the Zod schemas in `src/content.config.ts`. A bad field fails the build with a clear error.

- **`site.json`**: name, bio, hero badges, the facts strip, email, socials, the stack groups, "Currently learning" and section intros.
- **`experience.json`**: one object per role. `start` and `end` use `YYYY-MM`. Leave out `end` for a current role.
- **`projects/<slug>/index.md`**: one folder per project, with its images beside the Markdown file.
  - `featured: true` shows the large card. `highlights` fills its step panel.
  - `layout: card` (the default) puts it in the grid. `layout: list` puts it under "More experiments".
  - `order` sets the order. Each project needs a `liveUrl` or a `repoUrl`.
  - `thumbnail` is optional (`src` and the required `alt`). The home page design doesn't show thumbnails yet. They're stored for the detail pages.

### Adding project detail pages later

1. Write the case study in the project's `index.md` body.
2. Set `hasDetail: true`. The featured card then links to "Read the case study".
3. Add `src/pages/projects/[slug].astro` using `getStaticPaths()` over `getCollection("projects", (p) => p.data.hasDetail)` and `render(entry)`.

## Deploying (manual steps)

1. `pnpm wrangler login` (one time, opens the browser).
2. `pnpm run deploy` (not `pnpm deploy`, which is a built-in pnpm command). The first deploy creates the `aunghtetpaing` Worker and prints its `*.workers.dev` URL.
3. Custom domain: once the domain's zone is on your Cloudflare account, either add it in the dashboard (Workers & Pages › aunghtetpaing › Settings › Domains & Routes) or uncomment `routes` in `wrangler.jsonc` and deploy again.
4. Set the canonical URL. Change the fallback in `astro.config.mjs` or build with `SITE_URL=https://your-domain pnpm run deploy`. The sitemap, `robots.txt`, canonical and Open Graph URLs all use it.
5. Optional: retire the Netlify site, or redirect it to the new domain.

`public/og.png` (1200×630) is the social preview image. Replace it if you change the hero.
