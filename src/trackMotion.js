import { useLayoutEffect } from 'react'

// Progressive enhancement: server-rendered content stays readable without motion.
export function useTrackEntrance(ref) {
  useLayoutEffect(() => {
    const element = ref.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || motion.matches) return
    let disposed = false
    let started = false
    let frame = 0
    let finishTimer = 0
    let readyTimer = 0
    element.dataset.intro = 'prepared'
    const play = () => {
      if (disposed || started || document.documentElement.classList.contains('preloader-active')) return
      started = true
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (disposed) return
          element.dataset.intro = 'playing'
          finishTimer = window.setTimeout(() => { delete element.dataset.intro }, 1750)
        })
      })
    }
    const ready = () => {
      if (!document.documentElement.classList.contains('preloader-active')) play()
    }
    readyTimer = window.setTimeout(ready, 500)
    document.fonts?.ready.then(ready, ready)
    window.addEventListener('preloaderComplete', play)
    const reduce = () => { if (motion.matches) delete element.dataset.intro }
    motion.addEventListener('change', reduce)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.clearTimeout(finishTimer)
      window.clearTimeout(readyTimer)
      window.removeEventListener('preloaderComplete', play)
      motion.removeEventListener('change', reduce)
      delete element.dataset.intro
    }
  }, [ref])
}

export function useBriefReveals(ref) {
  useLayoutEffect(() => {
    const root = ref.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || motion.matches) return
    const nodes = [...root.querySelectorAll('.td-section-heading, .td-body-copy, .td-number-card, .td-tags, .td-focus-grid > li, .td-ideas li, .td-resource-grid > a, .td-criteria > div, .td-next-banner, .td-other-tracks > a')]
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.reveal = 'visible'
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 })
    nodes.forEach(node => {
      node.dataset.reveal = 'pending'
      const siblings = [...node.parentElement.children]
      const stagger = node.matches('li, .td-resource-grid > a, .td-criteria > div, .td-other-tracks > a')
      node.style.setProperty('--td-reveal-delay', `${stagger ? siblings.indexOf(node) * 60 : 0}ms`)
      observer.observe(node)
    })
    const rules = [...root.querySelectorAll('.td-brief-section')]
    const ruleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.dataset.rule = 'visible'
        ruleObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    rules.forEach(rule => { rule.dataset.rule = 'pending'; ruleObserver.observe(rule) })
    const revealAll = () => {
      if (!motion.matches) return
      nodes.forEach(node => { delete node.dataset.reveal })
      rules.forEach(rule => { delete rule.dataset.rule })
      observer.disconnect()
      ruleObserver.disconnect()
    }
    motion.addEventListener('change', revealAll)
    const finishReveal = event => {
      if (event.animationName === 'td-brief-up') delete event.target.dataset.reveal
      if (event.animationName === 'td-mask-open') {
        const heading = event.target.closest('.td-section-heading')
        if (heading) delete heading.dataset.reveal
      }
    }
    root.addEventListener('animationend', finishReveal)
    return () => {
      observer.disconnect()
      ruleObserver.disconnect()
      motion.removeEventListener('change', revealAll)
      root.removeEventListener('animationend', finishReveal)
      nodes.forEach(node => { delete node.dataset.reveal })
      rules.forEach(rule => { delete rule.dataset.rule })
    }
  }, [ref])
}
