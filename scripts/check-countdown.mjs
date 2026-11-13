import assert from 'node:assert/strict'
import test from 'node:test'
import { FINALE_START, getCountdownState } from '../src/countdown.js'

const displayedTime = now => {
  const { days, hours, minutes, seconds } = getCountdownState(now)
  return [days, hours, minutes, seconds]
}

test('the target is midnight IST on 28 December, independent of local timezone', () => {
  assert.equal(FINALE_START, Date.parse('2026-12-27T18:30:00Z'))
  assert.deepEqual(displayedTime(Date.parse('2026-12-28T00:00:00+05:30')), [0, 0, 0, 0])
})

test('the final fraction of a second never shows zero early', () => {
  for (const milliseconds of [1, 499, 999, 1000]) {
    assert.deepEqual(displayedTime(FINALE_START - milliseconds), [0, 0, 0, 1])
  }
  assert.deepEqual(displayedTime(FINALE_START - 1001), [0, 0, 0, 2])
})

test('day, hour and minute boundaries roll over correctly', () => {
  for (const [remainingSeconds, expected] of [
    [60, [0, 0, 1, 0]],
    [61, [0, 0, 1, 1]],
    [3600, [0, 1, 0, 0]],
    [3599, [0, 0, 59, 59]],
    [86400, [1, 0, 0, 0]],
    [86399, [0, 23, 59, 59]],
    [90061, [1, 1, 1, 1]],
  ]) {
    assert.deepEqual(displayedTime(FINALE_START - remainingSeconds * 1000), expected)
  }
})

test('reaching and passing the start never produces negative time', () => {
  for (const now of [FINALE_START, FINALE_START + 1, FINALE_START + 86400000]) {
    assert.deepEqual(getCountdownState(now), {
      remainingMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
    })
  }
})

test('a suspended tab or clock jump catches up from the current time', () => {
  const beforeSleep = FINALE_START - 172800000
  const afterSleep = FINALE_START - 5400000
  assert.deepEqual(displayedTime(beforeSleep), [2, 0, 0, 0])
  assert.deepEqual(displayedTime(afterSleep), [0, 1, 30, 0])
  assert.deepEqual(displayedTime(beforeSleep), [2, 0, 0, 0])
})

test('three-digit day counts retain their full value', () => {
  assert.deepEqual(displayedTime(FINALE_START - 100 * 86400000), [100, 0, 0, 0])
})
