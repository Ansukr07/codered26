import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { pages, siteUrl } from '../src/seo.js'

const titles = new Set()
for (const [page, info] of Object.entries(pages)) {
  const file = page === 'home' ? 'dist/index.html' : page === 'notFound' ? 'dist/404.html' : `dist/${page}/index.html`
  const html = await readFile(file, 'utf8')
  assert.equal((html.match(/<title>/g) || []).length, 1, `${page}: one title`)
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${page}: one H1`)
  assert.equal((html.match(/name="description"/g) || []).length, 1, `${page}: one description`)
  assert(html.includes(`rel="canonical" href="${siteUrl}${info.path}"`), `${page}: canonical`)
  const title = html.match(/<title>(.*?)<\/title>/)[1]
  assert(!titles.has(title), `${page}: unique title`)
  titles.add(title)
  const schema = JSON.parse(html.match(/id="site-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.equal(schema['@context'], 'https://schema.org')
  assert(html.includes('id="root"><'), `${page}: pre-rendered content`)
  if (page !== 'home') assert(!html.includes('id="home"'), `${page}: no hidden homepage content`)
  for (const [, source] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!source.startsWith('/') || !/\.(?:svg|webp|png|jpg|js|css)(?:\?|$)/.test(source)) continue
    await access(`dist${decodeURIComponent(source.split('?')[0])}`)
  }
}
const robots = await readFile('dist/robots.txt', 'utf8')
assert(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`))
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.equal((sitemap.match(/<loc>/g) || []).length, 6)
assert(!sitemap.includes('/404'))
console.log('SEO checks passed: titles, descriptions, H1s, canonicals, schema, pre-rendering, local assets, robots and sitemap.')
