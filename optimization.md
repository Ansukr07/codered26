# Performance optimization

This document tracks loading work for the Code Red 2026 Vite/React site. Measure a production build before and after each change; development mode is not representative.

## Completed

- Generated 480, 960, and 1440 px WebP variants for all 11 gallery photos in `public/gallery/responsive`, using `scripts/optimize-gallery.py`. The gallery now selects a variant with `srcSet` and `sizes`.
- Set gallery images to lazy loading, low fetch priority, and asynchronous decoding.
- Stopped the gallery's animation frame loop while it is off screen, cached layout measurements on resize, and provided a static, horizontally scrollable gallery for reduced motion.
- Confirmed `npm run build` succeeds after these changes. The client bundle was about 555 KB before gzip at this stage.
- Generated 400 and 800 px WebP variants for 40 team photos with `scripts/optimize-team.py`. The original team directory totals about 62.6 MB; the 400 px set totals about 1.2 MB and the 800 px set about 3.4 MB. Team cards now use responsive sources. Production preview of `/team` showed no broken images.
- Traced the apparent `/team` hydration error to Vite preview serving the home HTML for a path without a trailing slash. The build now emits both `/team.html` and `/team/index.html` (and equivalents for other routes), so the clean URL serves matching prerendered HTML. Verified `/team` hydrates without errors. The team component is now a separate client chunk, loaded only on that route.
- Sponsor logos now use native lazy loading, low fetch priority, and asynchronous decoding.
- Added reproducible WOFF2 generation in `scripts/optimize-fonts.py` for LilGrotesk, Valentine, and Vivaldi. CSS now prefers WOFF2 with the original OTF/TTF files as fallbacks; the preloaded bold font also uses WOFF2. All ten generated font files reopen successfully with FontTools.
- The gallery initially assigns sources to five unique photos, then activates upcoming photos as the carousel advances. In production preview, 10 duplicated image elements initially had sources for five unique URLs; more sources appeared during scrolling, with no broken loaded images.

## Current findings

- `src/GallerySection.jsx` renders 22 cards from 11 photos. The second set makes the carousel loop, but both sets point to the same URLs, so browser caching should prevent duplicate transfers.
- The gallery previously marked the first 11 images as eager even though the section appears below the hero. All gallery images now use native lazy loading, low fetch priority, and asynchronous decoding. Explicit dimensions give the browser an aspect ratio while CSS controls the displayed crop.
- Six legacy files in `public/gallery/optimized` total about 7.6 MB. The twelve `public/images/footimg* (1).*` files total about 9.9 MB and have no remaining source references; the gallery uses smaller responsive files.
- `src/App.jsx` already lazy loads the revolving footer images and pauses its animation off screen.
- `src/EditorialSections.jsx` still statically imports the gallery. The team page is split into a separate client chunk, but the remaining initial JavaScript bundle is about 540 KB before gzip.

## Next changes, in priority order

1. **Measure gallery requests and visual quality.** Check a 2× phone display and desktop for sharpness. Capture network transfer sizes and confirm the next images finish loading before they move into view. The source gate reduces initial requests to five unique photos, but slow networks still need verification.
2. **Split the gallery and other page code.** Load the gallery component when the schedule/gallery area approaches the viewport. Preserve the prerendered gallery markup during hydration; test direct navigation and server rendered hydration because `scripts/build-seo.mjs` prerenders routes. Continue reducing the 540 KB initial client chunk.
3. **Review remaining assets.** Audit the larger `public/images/footimg* (1).*` files and sponsor photos for display size, compression, `width`/`height`, `loading`, and `decoding`. Keep the hero's critical visual resources eager and give only the actual LCP image high fetch priority. Confirm the bold font preload is used above the fold and check whether Vivaldi also merits preload under a network trace.

## Verification

Run `npm run build`, then test `npm run preview` in a fresh browser profile with mobile network throttling. Record transferred image bytes, image request count, LCP, CLS, INP, and total blocking time for `/` and `/schedule`. Inspect the Network waterfall to confirm gallery requests start near the gallery, no image returns 404, and only one copy of each URL transfers. Repeat on a narrow viewport and with `prefers-reduced-motion: reduce`; scroll the carousel long enough to verify images remain available as they wrap.
