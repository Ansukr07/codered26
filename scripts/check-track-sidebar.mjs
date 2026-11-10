import assert from 'node:assert/strict'
import { test } from 'node:test'
import { selectTrackSection } from '../src/useTrackSectionHighlight.js'

const starts = [600, 1500, 2200, 3000, 3600]
const ids = ['problem', 'focus', 'ideas', 'judging', 'next']
const snapshot = (scroll, positions = starts) => positions.map((top, index) => ({ id: ids[index], top: top - scroll }))
const select = (scroll, options = {}, positions = starts) => selectTrackSection(snapshot(scroll, positions), { viewportHeight: 900, ...options })

test('tracks downward and upward scrolling across every boundary', () => {
  for (let index = 0; index < starts.length; index++) {
    const boundary = starts[index] - 315 //35% of a 900px viewport
    assert.equal(select(boundary), ids[index])
    assert.equal(select(boundary + 1), ids[index])
    assert.equal(select(boundary - 1), ids[Math.max(0, index - 1)])
  }
  assert.deepEqual([3400, 2800, 2000, 1300, 0].map(scroll => select(scroll)), ['next', 'judging', 'ideas', 'focus', 'problem'])
})

test('a direct hash jump or smooth-scroll frame uses current geometry without stale entries', () => {
  // Native anchors leave the root's 30px scroll padding; section padding clears the navbar.
  for (let index = 0; index < starts.length; index++) assert.equal(select(starts[index] - 30), ids[index])
  assert.deepEqual([0, 1000, 2100, 2905].map(scroll => select(scroll)), ['problem', 'problem', 'ideas', 'judging'])
  const reversed = snapshot(2100).reverse()
  assert.equal(selectTrackSection(reversed, { viewportHeight: 900 }), 'ideas')
})

test('the final section remains active throughout a large footer', () => {
  assert.equal(select(4000), 'next')
  assert.equal(select(9000), 'next')
  assert.equal(select(9000, { atPageEnd: true }), 'next')
})

test('a short final section is selected when the page cannot scroll it up to the activation line', () => {
  const positions = [0, 500, 1000, 1500, 2000]
  // At scroll 1300, a 900px viewport ends at 2200; the final top at 700 cannot reach 315.
  assert.equal(select(1300, {}, positions), 'judging')
  assert.equal(select(1300, { atPageEnd: true }, positions), 'next')
})

test('viewport and font/layout changes recalculate selection without another scroll', () => {
  assert.equal(select(1900, { viewportHeight: 600 }), 'focus')
  assert.equal(select(1900, { viewportHeight: 1000 }), 'ideas')
  assert.equal(select(2100), 'ideas')
  assert.equal(select(2100, {}, starts.map(top => top + 300)), 'focus')
  // A short landscape viewport still activates anchored sections below the header.
  assert.equal(select(1405, { viewportHeight: 240 }), 'focus')
})

test('before the brief, empty sections and invalid measurements are safe', () => {
  assert.equal(select(0), 'problem')
  assert.equal(selectTrackSection([], { viewportHeight: 900 }), null)
  assert.equal(selectTrackSection([{ id: 'bad', top: NaN }, ...snapshot(2100)], { viewportHeight: 900 }), 'ideas')
})
