import { useEffect, useRef, useState } from 'react'

const CELL = 2
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const clamp = value => Math.max(0, Math.min(1, value))

function drawPhoto(context, image, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawnWidth = image.naturalWidth * scale
  const drawnHeight = image.naturalHeight * scale
  context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) * .27, drawnWidth, drawnHeight)
}

function makeHalftone(image, width, height) {
  const base = document.createElement('canvas')
  base.width = width
  base.height = height
  const context = base.getContext('2d', { willReadFrequently: true })
  drawPhoto(context, image, width, height)
  const photo = context.getImageData(0, 0, width, height)
  const pixels = photo.data
  const luminance = new Float32Array(width * height)

  for (let index = 0; index < luminance.length; index++) {
    const offset = index * 4
    const light = (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255
    const value = clamp((light - .5) * 1.3 + .58)
    luminance[index] = value
    let mix
    if (value < .52) {
      mix = value / .52
      pixels[offset] = 1 + mix * 83
      pixels[offset + 1] = 20 + mix * 161
      pixels[offset + 2] = 12 + mix * 117
    } else {
      mix = (value - .52) / .48
      pixels[offset] = 84 + mix * 164
      pixels[offset + 1] = 181 + mix * 67
      pixels[offset + 2] = 129 + mix * 117
    }
  }
  context.putImageData(photo, 0, 0)

  for (let y = 0; y < height; y += CELL) {
    for (let x = 0; x < width; x += CELL) {
      let total = 0
      let count = 0
      for (let sampleY = y; sampleY < Math.min(y + CELL, height); sampleY++) {
        for (let sampleX = x; sampleX < Math.min(x + CELL, width); sampleX++) {
          total += luminance[sampleY * width + sampleX]
          count++
        }
      }
      const light = total / count
      const column = x / CELL
      const row = y / CELL
      const ordered = (BAYER[(row % 4) * 4 + column % 4] + .5) / 16
      const noise = ((column * 73 + row * 151 + column * row * 17) % 97) / 97
      const threshold = ordered * .7 + noise * .3
      if (1 - light < threshold * .78) continue
      context.fillStyle = `rgba(0, 24, 12, ${.36 + (1 - light) * .58})`
      const dotSize = light < .25 ? 1.6 : light < .7 ? 1.2 : .85
      context.fillRect(x + noise * .5, y + ordered * .5, dotSize, dotSize)
    }
  }
  return base
}

function drawEffect(canvas, base, frame, reducedMotion) {
  const context = canvas.getContext('2d')
  const { width, height } = canvas
  context.clearRect(0, 0, width, height)
  context.drawImage(base, 0, 0)

  context.fillStyle = 'rgba(0, 20, 10, .09)'
  for (let y = 0; y < height; y += 3) context.fillRect(0, y, width, 1)

  const grainCount = Math.round(width * height / 850)
  for (let index = 0; index < grainCount; index++) {
    const x = (index * 127 + frame * 67) % width
    const y = (index * 233 + frame * 41) % height
    context.fillStyle = index % 3 ? 'rgba(0, 28, 12, .2)' : 'rgba(255, 255, 255, .24)'
    context.fillRect(x, y, 1, 1)
  }

  if (!reducedMotion && frame % 11 < 2) {
    const y = (frame * 31) % height
    context.drawImage(base, 0, y, width, 4, frame % 2 ? 3 : -3, y, width, 4)
    context.fillStyle = 'rgba(0, 80, 32, .08)'
    context.fillRect(0, y, width, 2)
  }

  const vignette = context.createRadialGradient(width / 2, height / 2, height * .18, width / 2, height / 2, Math.max(width, height) * .78)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 15, 6, .26)')
  context.fillStyle = vignette
  context.fillRect(0, 0, width, height)
}

export default function TeamPortrait({ src, name, eager }) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const touchStart = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const closeOutside = event => {
      if (!containerRef.current?.contains(event.target)) setActive(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [active])

  useEffect(() => {
    if (!active) return
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationId
    let frame = 0
    let lastDraw = 0
    let base

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(bounds.width))
      canvas.height = Math.max(1, Math.round(bounds.height))
      if (image.complete && image.naturalWidth) base = makeHalftone(image, canvas.width, canvas.height)
      if (base && reducedMotion) drawEffect(canvas, base, 0, true)
    }
    const draw = time => {
      if (base && (reducedMotion ? frame === 0 : time - lastDraw > 65)) {
        drawEffect(canvas, base, frame++, reducedMotion)
        lastDraw = time
      }
      if (!reducedMotion) animationId = requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    image.addEventListener('load', resize)
    resize()
    animationId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      image.removeEventListener('load', resize)
    }
  }, [active])

  return <div
    ref={containerRef}
    className="team-member-image"
    role="button"
    tabIndex={0}
    aria-label={`Toggle dither effect for ${name}`}
    aria-pressed={active}
    onPointerEnter={event => { if (event.pointerType !== 'touch') setActive(true) }}
    onPointerLeave={event => { if (event.pointerType !== 'touch') setActive(false) }}
    onPointerDown={event => { if (event.pointerType === 'touch') touchStart.current = { x: event.clientX, y: event.clientY } }}
    onPointerUp={event => {
      if (event.pointerType !== 'touch' || !touchStart.current) return
      const distance = Math.hypot(event.clientX - touchStart.current.x, event.clientY - touchStart.current.y)
      touchStart.current = null
      if (distance < 10) setActive(value => !value)
    }}
    onPointerCancel={() => { touchStart.current = null }}
    onKeyDown={event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setActive(value => !value)
      }
    }}
  >
    <img ref={imageRef} src={src} alt={name} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    <canvas ref={canvasRef} className={`team-member-canvas${active ? ' is-active' : ''}`} aria-hidden="true" />
  </div>
}
