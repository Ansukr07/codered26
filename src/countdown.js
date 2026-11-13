export const FINALE_START = Date.parse('2026-12-28T00:00:00+05:30')
export const FINALE_COUNTDOWN_DATE = '28 December 2026'

export function getCountdownState(now = Date.now()) {
  const remainingMs = Math.max(0, FINALE_START - now)
  // Keep one second visible until the start time is actually reached.
  const totalSeconds = Math.ceil(remainingMs / 1000)

  return {
    remainingMs,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  }
}
