import { build } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { pages, siteUrl, structuredData } from '../src/seo.js'

await build()
await build({ build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr' }, ssr: { noExternal: true } })
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const template = await readFile('dist/index.html', 'utf8')
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
for (const [page, info] of Object.entries(pages)) {
  const head = `<title>${escape(info.title)}</title>
    <meta name="description" content="${escape(info.description)}" />
    <meta name="robots" content="${page === 'notFound' ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />
    <link rel="canonical" href="${siteUrl}${info.path}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Code Red 2026" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escape(info.title)}" />
    <meta property="og:description" content="${escape(info.description)}" />
    <meta property="og:url" content="${siteUrl}${info.path}" />
    <meta property="og:image" content="${siteUrl}/images/group1.webp" />
    <meta property="og:image:alt" content="Participants and organizers at a previous Code Red edition" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(info.title)}" />
    <meta name="twitter:description" content="${escape(info.description)}" />
    <meta name="twitter:image" content="${siteUrl}/images/group1.webp" />
    <script id="site-schema" type="application/ld+json">${JSON.stringify(structuredData(page)).replaceAll('<', '\\u003c')}</script>`
  const html = template.replace(/<meta name="description"[\s\S]*?\/>/, '').replace(/<title>.*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`)
  const filename = page === 'home' ? 'dist/index.html' : page === 'notFound' ? 'dist/404.html' : `dist/${page}/index.html`
  await mkdir(resolve(filename, '..'), { recursive: true })
  await writeFile(filename, html)
}
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.entries(pages).filter(([page]) => page !== 'notFound').map(([, info]) => `<url><loc>${siteUrl}${info.path}</loc></url>`).join('')}</urlset>\n`)
const crawlablePageCount = Object.keys(pages).filter((page) => page !== 'notFound').length
console.log(`Generated ${crawlablePageCount} crawlable pages, a 404 page, robots.txt and sitemap.xml.`)
