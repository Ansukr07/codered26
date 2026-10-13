# Code Red 2026 SEO plan

Production origin: https://www.codered26.xyz/
Domain migration checked on 14 October 2026: `https://codered26.xyz/` returns HTTP 308 to the www host; the www homepage returns HTTP 200. Canonicals, schema, social metadata and sitemap now use the www host. The repository adds a permanent, path-preserving redirect from the former `codered26.vercel.app` host; deploy to activate it. Verify the custom-domain property in Google Search Console and Bing Webmaster Tools and submit `https://www.codered26.xyz/sitemap.xml` after deployment.
Audit date: 13 October 2026. Goal: attract eligible student teams and relevant partners searching for Code Red, Bengaluru hackathons, and 2026 student product development events.

## Findings and implemented fixes

Live HTTP audit: `/`, `/tracks`, `/robots.txt`, `/sitemap.xml` and an invented URL all returned HTTP 200, identical homepage HTML and the same title. Crawl files were HTML rather than valid crawler resources. The HTML root was empty. This limits discovery outside JavaScript-capable crawlers and causes soft 404s.

| Priority | Finding | Local change |
| --- | --- | --- |
| P0 | Empty initial HTML; all routes share metadata | Build-time React rendering of all six real pages, with hydration |
| P0 | Missing real robots and sitemap | Generate both resources from the route configuration |
| P0 | Every unknown URL becomes the homepage | Remove blanket Vercel rewrite; generate a noindex 404 page |
| P0 | No canonical origin | Use the confirmed production origin consistently in canonicals, sitemap and schema |
| P1 | Social crawlers receive generic information | Unique Open Graph and Twitter card metadata in initial HTML |
| P1 | Every route contains unrelated hidden sections | Render only relevant sections on each secondary page |
| P1 | Secondary pages lack a visible-route H1 | One accessible H1 per route; descriptive homepage H1 |
| P1 | Event and organizer lack structured context | WebSite, WebPage, Organization and homepage Event JSON-LD with confirmed dates and venue |
| P1 | About route lacks navigation discovery | Add a crawlable footer About link |
| P1 | Intro delays first content and storage can fail | Immediate initial reveal; handle blocked session storage; usable HTML without JavaScript |
| P1 | HTML can silently regress | Add `npm run check:seo` for generated output |

No invented entry fee, exact finale start time, ticket inventory, ratings or confirmed track details were added. Date-only event markup matches the published 3–4 December dates. The production site will retain its old behavior until these changes are deployed.

## Search intent and content map

| URL | Primary intent | Next content work |
| --- | --- | --- |
| `/` | Code Red 2026; Bengaluru student hackathon 2026 | Concise event summary, date, venue, eligibility, prize pool and registration |
| `/about` | BMSIT hackathon; Code Red organizer | Explain selection stages, organizer identity and verified previous-edition evidence |
| `/tracks` | Code Red problem statements | Publish confirmed sponsor statements, deliverables and evaluation criteria; currently placeholders |
| `/prizes` | Code Red prize pool and awards | Confirm advertised individual award amounts and terms with organizers |
| `/sponsors` | Code Red partners; sponsor a student hackathon | Confirm permission and current relationships for every displayed logo; add partnership contact |
| `/faq` | Team size, fees, eligibility, accommodation | Publish final confirmation fee, travel/accommodation policy and submission requirements |

Use natural language in visible headings and answers. Explain Bengaluru, BMSIT&M, student eligibility and product development explicitly. Avoid stuffing repeated city/keyword variants or creating thin duplicate pages. There is no separate schedule page: link to `/#timeline`.

## Before deployment

1. Run `npm run build`, `npm run lint` and `npm run check:seo`. Publish only `dist`, not `dist-ssr`. Existing Navbar edits predating this task should be retained and reviewed separately.
2. Resolve registration behavior: the hero contains a Unstop destination while its click handler and other buttons announce “coming soon.” Registration is stated to open on 18 October. Confirm the correct destination and enable all entry points consistently on opening day; do not infer that registration is currently open.
3. Confirm finale dates, individual prize distribution, sponsors and address. Exact start/end times and ticket terms should be added to schema only when public and confirmed.
4. Keep this origin canonical until an official custom domain is approved. If changed, update `src/seo.js`, redirect the old host permanently, update profiles and resubmit the sitemap.
5. Mark preview deployments noindex using hosting controls or preview-only response headers. Do not block production crawlers. No account credentials or verification tokens are embedded in source.

## Deployment acceptance checks

Check the published build, because local preview does not reproduce all Vercel routing rules:

- All six page URLs return 200 with distinct titles, descriptions, canonical URLs, one H1 and readable page content in View Source.
- `/robots.txt` returns plain text and `/sitemap.xml` returns XML, not the homepage.
- A random missing path returns HTTP 404 with the custom error page. `/home` and `/schedule` permanently redirect. Verify trailing-slash normalization and direct refresh on all secondary pages.
- Canonicals and social card URLs use the approved production host. Test social previews with platform debuggers.
- Test Event markup in Google's Rich Results Test and schema in Schema.org's validator. Valid markup creates eligibility, not a guarantee of a rich result. Do not use FAQ schema to promise FAQ rich results for this event site.
- Use Search Console URL Inspection to compare live HTML and rendered content. Confirm JavaScript/CSS/images are accessible.
- Test keyboard navigation, mobile layout, FAQ interactions, page back/forward, JavaScript-disabled content and failed storage access.

## Discovery across search engines and answer systems

| Priority / timing | Action | Evidence of completion |
| --- | --- | --- |
| P0 / after deployment | Verify the production property in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml` | Sitemap accepted; representative URLs inspected |
| P1 / first week | Update the official E-Cell, institute and event-platform listings with consistent event name, dates, venue and canonical link | Public listings point to the correct site |
| P1 / first week | Request contextual links from the institute, confirmed partners, college clubs and relevant hackathon calendars | Relevant referral visits and discoverable links |
| P1 / ongoing | Publish confirmed track statements, rules, submission guidance and event updates | Useful pages answer real participant questions |
| P1 / ongoing | Keep concise factual answers and organizer/contact details in accessible HTML | Search and answer crawlers can read the source without interaction |
| P2 / when supported | Consider Bing IndexNow for substantive updates with a verified host key | Successful submissions; no arbitrary tokens |
| P2 / after event | Retain this edition URL with results, winning projects and consented photographs; link to future editions | Valuable event archive instead of unrelated redirects |

This covers Google, Bing and discovery through their downstream products, social sharing and accessible source content for answer engines. No special `llms.txt` file, paid link scheme or keyword tag is required for the implemented foundation. Search inclusion and ranking cannot be guaranteed. A hackathon is not a standalone local storefront: do not create a misleading Google Business Profile just to target Maps.

## Performance and measurement

Measure mobile and desktop with PageSpeed Insights/Lighthouse after deployment, and use real-user Search Console Core Web Vitals when traffic is sufficient. Targets at the 75th percentile: LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1. No performance score or ranking lift has been assumed from the source audit.

The initial client bundle was approximately 408 kB before gzip (133 kB gzip). Animation libraries, fonts and image collections deserve measurement; lazy-load below-fold media, retain image dimensions, use licensed compressed fonts, and load motion only when it earns its cost. Check for mobile overflow and animation-driven long tasks before further optimization. Keep the hero headline readable immediately rather than relying on a long intro.

Record a baseline now and review weekly: indexed canonical URLs, non-brand and brand impressions/clicks, query relevance, CTR by page, registration referral clicks, completed registrations where the provider allows measurement, organic landing pages, CWV and crawl errors. Vercel Analytics alone does not prove completed external registrations. Define an explicit registration-click event only after the registration destination is confirmed.

## Reference guidance

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/about)
- [Bing discovery and grounding guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [Core Web Vitals thresholds](https://web.dev/articles/vitals)

## Local validation results

Production build, lint and generated SEO checks pass. A headless Edge browser loaded all six pages without console or runtime errors, verified per-page titles, canonicals and H1s, and exercised client navigation, back navigation and FAQ expansion. The homepage had no horizontal overflow at a 390-pixel viewport. A JavaScript-disabled browser could read FAQ answers. These are local functional checks, not production routing validation, field performance measurements or proof of indexing.

Account verification, external backlinks, measured field performance and indexing are post-deployment tasks requiring the relevant owner accounts. This repository work does not submit a sitemap, publish a deployment or change external accounts.
