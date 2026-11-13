import assert from 'node:assert/strict'
import test from 'node:test'
import { getMobileHeroCompression, MOBILE_HERO_SPACE_BUDGET } from '../src/mobileHeroFit.js'

test('a generous viewport keeps the preferred spacing', () => {
  assert.equal(MOBILE_HERO_SPACE_BUDGET, 98)
  assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: 900 }), 0)
  assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: 796 }), 0)
})

test('shorter viewports progressively compress spacing', () => {
  const fit = viewportHeight => getMobileHeroCompression({ flowHeight: 780, viewportHeight })
  assert.equal(fit(747), 0.5)
  assert.ok(fit(730) > fit(760))
  assert.ok(fit(760) > fit(790))
})

test('restoring viewport height restores the preferred spacing', () => {
  const currentCompression = getMobileHeroCompression({ flowHeight: 780, viewportHeight: 747 })
  const flowHeight = 780 - currentCompression * MOBILE_HERO_SPACE_BUDGET
  assert.equal(getMobileHeroCompression({ flowHeight, currentCompression, viewportHeight: 900 }), 0)
})

test('already compressed measurements produce the same fit', () => {
  for (const viewportHeight of [790, 760, 730, 700]) {
    const currentCompression = getMobileHeroCompression({ flowHeight: 780, viewportHeight })
    const flowHeight = 780 - currentCompression * MOBILE_HERO_SPACE_BUDGET
    const nextCompression = getMobileHeroCompression({ flowHeight, currentCompression, viewportHeight })
    assert.ok(Math.abs(nextCompression - currentCompression) < 1e-12)
  }
})

test('impossibly small viewports stop at full compression', () => {
  assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: 400 }), 1)
})

test('invalid measurements safely leave spacing uncompressed', () => {
  for (const invalid of [undefined, null, NaN, Infinity, -Infinity, 0, -1, '780']) {
    assert.equal(getMobileHeroCompression({ flowHeight: invalid, viewportHeight: 700 }), 0)
    assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: invalid }), 0)
  }
  assert.equal(getMobileHeroCompression(), 0)
})

test('compression is normalized and invalid bottom spacing uses the default', () => {
  for (const currentCompression of [NaN, Infinity, undefined, -1, '0.5']) {
    assert.equal(getMobileHeroCompression({ flowHeight: 780, currentCompression, viewportHeight: 747 }), 0.5)
  }
  assert.equal(getMobileHeroCompression({ flowHeight: 682, currentCompression: 2, viewportHeight: 747 }), 0.5)
  for (const bottomSpace of [NaN, Infinity, null, -1, '16']) {
    assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: 747, bottomSpace }), 0.5)
  }
  assert.equal(getMobileHeroCompression({ flowHeight: 780, viewportHeight: 780, bottomSpace: 0 }), 0)
})
