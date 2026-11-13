import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import { trackRoutes } from '../src/trackData.js'

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const inlineScript = id => {
  const source = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`))?.[1]
  assert.ok(source, `Missing ${id}`)
  return new vm.Script(source, { filename: id })
}
const policy = inlineScript('preloader-route-policy')
const controller = inlineScript('preloader-controller')
const mainPages = ['home', 'about', 'tracks', 'prizes', 'schedule', 'sponsors', 'faq', 'team']

// Run the actual inline controller with a small DOM and a deterministic clock.
function browser(pathname, { hash = '', seen = false, blockedStorage = false, width = 1280, height = 720 } = {}) {
  let now = 0
  let nextId = 0
  const timers = new Map()
  const schedule = (callback, delay = 0, interval = 0) => {
    const id = ++nextId
    timers.set(id, { callback, at: now + delay, interval })
    return id
  }
  const element = (text = '') => {
    const classes = new Set()
    const node = {
      style: {}, dataset: {}, children: [],
      classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
      appendChild(child) { this.children.push(child) },
      replaceChildren() { this.children = []; text = '' },
    }
    Object.defineProperty(node, 'textContent', {
      get: () => text + node.children.map(child => child.textContent).join(''),
      set: value => { text = value; node.children = [] },
    })
    return node
  }
  const elements = {
    preloader: element(), 'intro-text': element(), 'intro-text-inner': element("CODERED'26"),
  }
  const document = {
    documentElement: element(), body: element(),
    getElementById: id => elements[id], createElement: () => element(),
    addEventListener(name, callback) { assert.equal(name, 'DOMContentLoaded'); this.ready = callback },
  }
  const storage = new Map(seen ? [['CR_TAB_MEMORY', 'true']] : [])
  const events = []
  const window = {
    location: { pathname, hash }, innerWidth: width, innerHeight: height,
    dispatchEvent: event => events.push(event.type),
  }
  const context = vm.createContext({
    window, document, Event: class { constructor(type) { this.type = type } },
    sessionStorage: {
      getItem(key) { if (blockedStorage) throw new Error('Storage blocked'); return storage.get(key) },
      setItem(key, value) { if (blockedStorage) throw new Error('Storage blocked'); storage.set(key, value) },
    },
    setTimeout: (callback, delay) => schedule(callback, delay),
    setInterval: (callback, delay) => schedule(callback, delay, delay),
    clearInterval: id => timers.delete(id),
    requestAnimationFrame: callback => schedule(callback, 16),
  })
  policy.runInContext(context)
  const initialDecision = document.documentElement.dataset.preloader
  controller.runInContext(context)
  document.ready()
  const active = () => document.documentElement.classList.contains('preloader-active')
  const tick = async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve()
    const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]
    if (!next) return false
    const [id, timer] = next
    now = timer.at
    if (timer.interval) timer.at += timer.interval
    else timers.delete(id)
    timer.callback()
    return true
  }
  const settle = async () => {
    for (let i = 0; i < 3000; i++) {
      if (!await tick()) return
    }
    assert.fail('Preloader timers did not settle')
  }
  return { document, window, elements, storage, events, initialDecision, active, tick, settle }
}

function assertRevealed(page) {
  assert.equal(page.active(), false)
  assert.equal(page.document.documentElement.dataset.preloader, 'skip')
  assert.equal(page.document.body.style.overflow || '', '')
  assert.equal(page.elements.preloader.style.display, 'none')
  assert.equal(page.elements['intro-text'].style.display, 'none')
}

test('only exact main pages play; every real nested route and error skips', () => {
  const page = browser('/tracks/track-3/problems/ps-1')
  for (const route of mainPages) {
    for (const spelling of [route, `/${route}/`, `/${route}?source=nav`, `#/${route}`]) {
      assert.equal(page.window.shouldPlayPagePreloader(spelling), true, spelling)
    }
  }
  assert.equal(page.window.shouldPlayPagePreloader('/'), true)
  for (const route of [...trackRoutes.map(route => route.path), '/404', '/notFound', '/missing', '/about/missing', '/tracks/missing']) {
    assert.equal(page.window.shouldPlayPagePreloader(route), false, route)
  }
  assert.equal(browser('/', { hash: '#/tracks/track-3/problems/ps-1' }).initialDecision, 'skip')
  assert.equal(browser('/', { hash: '#/about' }).initialDecision, 'play')
})

test('direct subpages and errors render without a grid, scroll lock or consumed intro', async () => {
  for (const path of [...trackRoutes.map(route => route.path), '/404', '/notFound', '/missing']) {
    const page = browser(path)
    assert.equal(page.initialDecision, 'skip', path)
    assertRevealed(page)
    assert.equal(page.elements.preloader.children.length, 0)
    assert.equal(page.storage.size, 0)
    assert.equal(typeof page.window.playPagePreloader, 'function')
    await page.settle()
    assertRevealed(page)
  }
})

test('desktop and mobile main page initial loads retain the intro and finish unlocked', async () => {
  for (const [width, height, columns] of [[1280, 720, 10], [390, 844, 6]]) {
    const page = browser('/tracks', { width, height })
    assert.equal(page.initialDecision, 'play')
    assert.equal(page.active(), true)
    assert.equal(page.document.body.style.overflow, 'hidden')
    assert.equal(page.elements['intro-text'].style.display, 'flex')
    assert.equal(page.elements.preloader.children.length, columns * Math.ceil(height / (width / columns)))
    await page.settle()
    assertRevealed(page)
    assert.equal(page.storage.get('CR_TAB_MEMORY'), 'true')
  }
})

test('opening Home from a direct subpage still plays the first main-page intro', async () => {
  const page = browser('/tracks/track-4/mystartupwave/problems/ps-1')
  let destination
  page.window.playPagePreloader(() => { destination = 'home' }, 'home', 'tracks/track-4/mystartupwave/problems/ps-1')
  assert.equal(page.active(), true)
  assert.equal(page.elements.preloader.style.display, 'grid')
  await page.tick()
  await page.tick()
  assert.equal(destination, 'home')
  assert.equal(page.elements['intro-text'].style.display, 'flex')
  await page.settle()
  assertRevealed(page)
})

test('returning from any track, company or PS to Tracks skips without consuming the intro', async () => {
  for (const route of trackRoutes) {
    const page = browser(route.path)
    for (const source of [route.page, `${route.path}/`, `#/${route.page}`]) {
      assert.equal(page.window.shouldPlayPagePreloader('/tracks', source), false, source)
    }
    let destination
    page.window.playPagePreloader(() => { destination = 'tracks' }, 'tracks', route.page)
    assert.equal(destination, 'tracks', route.page)
    assertRevealed(page)
    assert.equal(page.elements.preloader.children.length, 0)
    assert.equal(page.storage.size, 0)
    await page.settle()
    assertRevealed(page)
  }
})

test('Tracks still animates on direct entry or from other main pages', () => {
  const page = browser('/faq', { seen: true })
  for (const source of [undefined, ...mainPages, 'notFound']) {
    assert.equal(page.window.shouldPlayPagePreloader('/tracks', source), true, source)
  }
  page.window.playPagePreloader(() => {}, 'tracks', 'faq')
  assert.equal(page.active(), true)
})

test('main page transitions dissolve while nested and error destinations skip immediately', async () => {
  const page = browser('/about', { seen: true })
  assert.notEqual(page.elements['intro-text'].style.display, 'flex')
  await page.settle()
  let destination
  for (const target of ['tracks', 'tracks/track-4/problems', 'tracks/track-4/mystartupwave/problems/ps-1', 'notFound', 'home']) {
    page.window.playPagePreloader(() => { destination = target }, target)
    if (mainPages.includes(target)) {
      assert.equal(page.active(), true, target)
      assert.notEqual(page.elements['intro-text'].style.display, 'flex')
    } else {
      assert.equal(destination, target)
      assertRevealed(page)
    }
    await page.settle()
    assert.equal(destination, target)
    assertRevealed(page)
  }
})

test('a newer destination cancels pending transitions without stale overlays or routes', async () => {
  const page = browser('/tracks')
  let destination
  page.window.playPagePreloader(() => { destination = 'about' }, 'about')
  page.window.playPagePreloader(() => { destination = 'notFound' }, 'notFound')
  assertRevealed(page)
  await page.settle()
  assert.equal(destination, 'notFound')
  assertRevealed(page)

  page.window.playPagePreloader(() => { destination = 'about' }, 'about')
  page.window.playPagePreloader(() => { destination = 'schedule' }, 'schedule')
  await page.settle()
  assert.equal(destination, 'schedule')
  assertRevealed(page)
})

test('blocked session storage does not prevent main pages from being revealed', async () => {
  const page = browser('/faq', { blockedStorage: true })
  await page.settle()
  assertRevealed(page)
  page.window.playPagePreloader(() => {}, 'home')
  await page.settle()
  assertRevealed(page)
})
