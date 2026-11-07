import { useLayoutEffect, useState } from 'react'

/** Select from one current layout snapshot, rather than observer callback order. */
export function selectTrackSection(sections, { viewportHeight, atPageEnd = false, anchorOffset = 95 }) {
  const ordered = sections.filter(section => section.id && Number.isFinite(section.top)).sort((a, b) => a.top - b.top)
  if (!ordered.length) return null
  if (atPageEnd) return ordered[ordered.length - 1].id

  // Use height explicitly: vertical rootMargin percentages differ across engines.
  const line = Math.max(0, Math.min(viewportHeight - 1, Math.max(anchorOffset, viewportHeight * .35)))
  let active = ordered[0].id
  for (const section of ordered) {
    if (section.top > line) break
    active = section.id
  }
  return active
}

export default function useTrackSectionHighlight(ref, page) {
  const [activeSection, setActiveSection] = useState('problem')

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const sections = [...root.querySelectorAll('.td-brief-section[id]')]
    if (!sections.length) return
    let frame = 0
    let disposed = false

    const update = () => {
      frame = 0
      if (disposed) return
      const viewportHeight = window.innerHeight
      const scrollRoot = document.scrollingElement || document.documentElement
      const next = selectTrackSection(sections.map(section => ({
        id: section.id,
        top: section.getBoundingClientRect().top,
      })), {
        viewportHeight,
        anchorOffset: parseFloat(window.getComputedStyle(sections[0]).scrollMarginTop) || 95,
        atPageEnd: scrollRoot.scrollTop + viewportHeight >= scrollRoot.scrollHeight - 2,
      })
      if (next) setActiveSection(previous => previous === next ? previous : next)
    }
    const schedule = () => {
      if (!disposed && !frame) frame = window.requestAnimationFrame(update)
    }

    const events = ['scroll', 'resize', 'orientationchange', 'hashchange', 'popstate', 'pageshow', 'load', 'preloaderComplete']
    events.forEach(event => window.addEventListener(event, schedule, { passive: true }))
    window.visualViewport?.addEventListener('resize', schedule)
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null
    // Sections catch internal reflow; the root catches hero shifts above the brief.
    const observedElements = [root, document.documentElement, ...sections]
    observedElements.forEach(element => resize?.observe(element))
    document.fonts?.addEventListener('loadingdone', schedule)
    document.fonts?.addEventListener('loadingerror', schedule)
    document.fonts?.ready.then(schedule, schedule)
    schedule()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      events.forEach(event => window.removeEventListener(event, schedule))
      window.visualViewport?.removeEventListener('resize', schedule)
      resize?.disconnect()
      document.fonts?.removeEventListener('loadingdone', schedule)
      document.fonts?.removeEventListener('loadingerror', schedule)
    }
  }, [ref, page])

  return activeSection
}
