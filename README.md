# Code Red 2026

React/Vite event website for E-Cell BMSIT&M’s national student product sprint.

## Development

Run `npm install` and `npm run dev`.

## Production and verification

Run `npm run build`, `npm run lint`, `npm run check:seo`, then `npm run preview`.

The build generates client assets and pre-renders `/`, `/about`, `/tracks`, `/prizes`, `/sponsors` and `/faq`, plus a custom 404 page, `robots.txt` and `sitemap.xml`. Deploy the `dist` directory. `dist-ssr` contains the intermediate server renderer and is not deployed. The build requires Node.js compatible with Vite 8.

`src/seo.js` holds the canonical production origin and page metadata. Update it when moving to an approved custom domain. React hydrates the static HTML and updates metadata during navigation. Vercel configuration uses static routes rather than a blanket SPA rewrite, so unknown URLs can return 404.

See [SEO-PLAN.md](SEO-PLAN.md) for the audit, prioritized content and discovery work, release checks and measurement plan.
