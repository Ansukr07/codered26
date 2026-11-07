import { useEffect, useRef, useState } from 'react'
import './track-wheel.css'

const clamp = (value, last) => Math.max(0, Math.min(last, value))

function wheelStyle(index, position, spacing, reduced = false) {
  const distance = index - position
  const angle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, distance * 8 * Math.PI / 180))
  const radius = spacing / (8 * Math.PI / 180)
  const absolute = Math.abs(distance)
  return {
    transform: `translate(calc(${(radius * Math.sin(angle)).toFixed(1)}px - 50%), calc(${(radius * (1 - Math.cos(angle))).toFixed(1)}px - 50%)) rotate(${(angle * 180 / Math.PI).toFixed(2)}deg) scale(${Math.max(.7, 1 - .12 * absolute).toFixed(3)})`,
    opacity: Math.max(0, Math.min(1, 1.05 - .42 * absolute)),
    filter: reduced || absolute < .3 ? 'none' : `blur(${Math.min(2.4, .9 * absolute).toFixed(2)}px)`,
    '--td-wheel-progress': Math.max(0, 1 - Math.min(absolute, 1)),
  }
}

/** The reference's eight-degree arc, damped movement and delayed route commit. */
export default function TrackWheel({ tracks, activeIndex, onNavigate }) {
  const root = useRef(null)
  const items = useRef([])
  const engine = useRef(null)
  const latest = useRef({ tracks, activeIndex, onNavigate })
  const [selected, setSelected] = useState(activeIndex)
  useEffect(() => { latest.current = { tracks, activeIndex, onNavigate } }, [tracks, activeIndex, onNavigate])

  useEffect(() => {
    const element = root.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const state = {
      position: latest.current.activeIndex, target: latest.current.activeIndex,
      frame: 0, lastTime: 0, commitTimer: 0, settleTimer: 0, clickTimer: 0,
      pointer: null, suppressClick: false, spacing: 220,
    }
    const paint = () => items.current.forEach((item, index) => {
      if (!item) return
      const style = wheelStyle(index, state.position, state.spacing, motion.matches)
      item.style.transform = style.transform
      item.style.opacity = style.opacity
      item.style.filter = style.filter
      item.style.setProperty('--td-wheel-progress', style['--td-wheel-progress'])
    })
    const animate = (time) => {
      const dt = Math.min((time - state.lastTime) / 1000, .05)
      state.lastTime = time
      state.position += (state.target - state.position) * (motion.matches ? 1 : 1 - Math.exp(-dt / .16))
      const settled = Math.abs(state.target - state.position) < .002
      if (settled) state.position = state.target
      paint()
      state.frame = settled ? 0 : requestAnimationFrame(animate)
    }
    const wake = () => {
      if (state.frame) return
      state.lastTime = performance.now()
      state.frame = requestAnimationFrame(animate)
    }
    const move = (value, snap) => {
      const target = clamp(value, latest.current.tracks.length - 1)
      state.target = snap ? Math.round(target) : target
      const index = Math.round(state.target)
      setSelected(index)
      wake()
      window.clearTimeout(state.commitTimer)
      if (snap && index !== latest.current.activeIndex) {
        state.commitTimer = window.setTimeout(() => {
          const track = latest.current.tracks[index]
          if (latest.current.onNavigate) latest.current.onNavigate(track.page)
          else window.location.assign(track.path)
        }, motion.matches ? 0 : 420)
      }
    }
    const measure = () => {
      const widest = Math.max(...items.current.filter(Boolean).map(item => item.offsetWidth), 0)
      state.spacing = Math.max(element.clientWidth < 500 ? 190 : 220, widest + 20)
      paint()
    }
    const wheel = event => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const focused = element.contains(document.activeElement)
      if (!horizontal && !focused) return
      const delta = horizontal ? event.deltaX : event.deltaY
      if (!delta) return
      const direction = Math.sign(delta)
      if ((state.target <= 0 && direction < 0) || (state.target >= latest.current.tracks.length - 1 && direction > 0)) return
      event.preventDefault()
      move(state.target + Math.max(-1, Math.min(1, delta / 60)), false)
      window.clearTimeout(state.settleTimer)
      state.settleTimer = window.setTimeout(() => move(state.target, true), 160)
    }
    const resize = new ResizeObserver(measure)
    resize.observe(element)
    items.current.filter(Boolean).forEach(item => resize.observe(item))
    element.addEventListener('wheel', wheel, { passive: false })
    motion.addEventListener('change', wake)
    engine.current = { state, move, wake }
    measure()
    return () => {
      cancelAnimationFrame(state.frame)
      window.clearTimeout(state.commitTimer)
      window.clearTimeout(state.settleTimer)
      window.clearTimeout(state.clickTimer)
      resize.disconnect()
      element.removeEventListener('wheel', wheel)
      motion.removeEventListener('change', wake)
      engine.current = null
    }
  }, [])

  useEffect(() => {
    if (engine.current) {
      engine.current.move(activeIndex, true)
    }
  }, [activeIndex])

  const finishDrag = event => {
    const api = engine.current
    if (!api) return
    const pointer = api.state.pointer
    api.state.pointer = null
    if (root.current.hasPointerCapture(event.pointerId)) root.current.releasePointerCapture(event.pointerId)
    if (pointer?.moved) {
      api.move(api.state.target, true)
      api.state.clickTimer = window.setTimeout(() => { api.state.suppressClick = false }, 250)
    }
  }

  return <nav
    ref={root}
    className="td-track-wheel"
    aria-label="Choose a track. Drag, scroll horizontally, or use the arrow keys."
    tabIndex={0}
    onKeyDown={event => {
      const api = engine.current
      if (!api || event.altKey || event.ctrlKey || event.metaKey) return
      let target
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = Math.round(api.state.target) - 1
      else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = Math.round(api.state.target) + 1
      else if (event.key === 'Home') target = 0
      else if (event.key === 'End') target = tracks.length - 1
      else return
      event.preventDefault()
      api.move(target, true)
    }}
    onPointerDown={event => {
      const api = engine.current
      if (!api || event.button !== 0 || !event.isPrimary) return
      window.clearTimeout(api.state.clickTimer)
      window.clearTimeout(api.state.commitTimer)
      window.clearTimeout(api.state.settleTimer)
      api.state.suppressClick = false
      api.state.pointer = { x: event.clientX, y: event.clientY, start: api.state.target, id: event.pointerId, moved: false }
    }}
    onPointerMove={event => {
      const api = engine.current
      const pointer = api?.state.pointer
      if (!pointer || pointer.id !== event.pointerId) return
      const dx = event.clientX - pointer.x
      const dy = event.clientY - pointer.y
      if (!pointer.moved && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { api.state.pointer = null; return }
      const dragging = pointer.moved || Math.abs(dx) > 5
      if (!pointer.moved && dragging) {
        api.state.pointer = { ...pointer, moved: true }
        api.state.suppressClick = true
        root.current.setPointerCapture(event.pointerId)
      }
      if (dragging) api.move(pointer.start - dx / api.state.spacing, false)
    }}
    onPointerUp={finishDrag}
    onPointerCancel={event => {
      const api = engine.current
      if (!api) return
      api.state.pointer = null
      if (root.current.hasPointerCapture(event.pointerId)) root.current.releasePointerCapture(event.pointerId)
      api.move(activeIndex, false)
      api.state.clickTimer = window.setTimeout(() => { api.state.suppressClick = false }, 250)
    }}
    onClickCapture={event => {
      if (engine.current?.state.suppressClick) { event.preventDefault(); event.stopPropagation() }
    }}
  >
    {tracks.map((track, index) => <a
      key={track.page}
      ref={item => { items.current[index] = item }}
      className="td-track-wheel__item"
      href={track.path}
      draggable={false}
      aria-current={index === activeIndex ? 'page' : undefined}
      data-selected={index === selected ? '' : undefined}
      tabIndex={index === selected ? 0 : -1}
      style={wheelStyle(index, activeIndex, 220)}
      onClick={event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        engine.current?.move(index, true)
      }}
    ><span>{track.numeral}</span>{track.title}</a>)}
    <span className="td-track-wheel__mark" aria-hidden="true" />
  </nav>
}
