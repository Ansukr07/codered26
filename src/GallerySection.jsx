import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './gallery-section.css'

const photos = [
  { name: 'footimg2', alt: 'Photographer capturing a Code Red moment' },
  { name: 'footimg3', alt: 'Participants working together during Code Red' },
  { name: 'footimg7', alt: 'Participants gathered by a fire at a previous Code Red event' },
  { name: 'footimg8', alt: 'Team presenting a project to judges' },
  { name: 'footimg5', alt: 'Code Red participants holding their certificates' },
  { name: '20251212_161438', alt: 'Participant building a hardware project at Code Red' },
  { name: '20251212_193615', alt: 'Code Red participants discussing their project in a classroom' },
  { name: '20251213_022705', alt: 'Teams working on projects during Code Red' },
  { name: 'DSC01642', alt: 'Mentor reviewing a participant’s work' },
  { name: 'DSC01924', alt: 'Code Red participant presenting on stage' },
  { name: 'DSC01950', alt: 'Participants speaking with a judge at Code Red' },
]

export default function GallerySection({ followedByFaq = false }) {
  const reducedMotion = useReducedMotion()
  const windowRef = useRef(null)
  const cardsRef = useRef([])
  const offsetRef = useRef(0)
  const loadedRef = useRef(new Set([0, 1, 2, 3, 4]))
  const [loadedPhotos, setLoadedPhotos] = useState(() => new Set([0, 1, 2, 3, 4]))

  useEffect(() => {
    const node = windowRef.current
    if (!node) return
    if (reducedMotion) return
    let frame = 0
    let lastTime = 0
    let cardWidth = 0
    let viewWidth = 0
    let isPhone = false
    const measure = () => {
      cardWidth = cardsRef.current[0]?.offsetWidth || 0
      viewWidth = node.offsetWidth
      isPhone = window.innerWidth <= 700
    }
    const animate = now => {
      const delta = lastTime ? Math.min(now - lastTime, 64) : 0
      lastTime = now
      const gap = isPhone ? 28 : 40
      const stride = cardWidth + gap
      const loopWidth = cardsRef.current.length * stride
      if (loopWidth) offsetRef.current = (offsetRef.current + delta * (isPhone ? .08 : .147)) % loopWidth
      cardsRef.current.forEach((card, index) => {
        if (!card || !loopWidth) return
        let x = ((index * stride - stride * .43 - offsetRef.current) % loopWidth + loopWidth) % loopWidth
        if (x > loopWidth - stride) x -= loopWidth
        const photoIndex = index % photos.length
        if (x >= -2 * stride && x <= viewWidth + 2 * stride && !loadedRef.current.has(photoIndex)) {
          loadedRef.current.add(photoIndex)
          setLoadedPhotos(new Set(loadedRef.current))
        }
        const position = point => Math.max(-1, Math.min(1, (point - viewWidth / 2) / (viewWidth / 2)))
        const left = position(x)
        const right = position(x + cardWidth)
        const center = position(x + cardWidth / 2)
        const inset = distance => 4 * (1 - Math.abs(distance) ** 1.35)
        const topLeft = inset(left)
        const topRight = inset(right)
        card.style.clipPath = `polygon(0 ${topLeft}%, 100% ${topRight}%, 100% ${100 - topRight}%, 0 ${100 - topLeft}%)`
        card.style.transform = `translate3d(${x}px, 0, 0) rotateY(${-center * 5}deg)`
        card.style.zIndex = String(10 - Math.round(Math.abs(center) * 5))
      })
      frame = requestAnimationFrame(animate)
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(node)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) frame = requestAnimationFrame(animate)
      else if (!entry.isIntersecting && frame) {
        cancelAnimationFrame(frame)
        frame = 0
        lastTime = 0
      }
    })
    observer.observe(node)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [reducedMotion])

  return <section id="gallery" className={`event-gallery${followedByFaq ? ' event-gallery--to-faq' : ''}`} aria-labelledby="gallery-title">
    <motion.div
      className="event-gallery-intro"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .7 }}
      transition={{ duration: .8, ease: [.16, 1, .3, 1] }}
    >
      <h2 id="gallery-title">Previous Editions</h2>
      <p>Moments from previous Code Red editions.</p>
    </motion.div>
    <div className={`event-gallery-window${reducedMotion ? ' event-gallery-window--static' : ''}`} ref={windowRef}>
      <div className="event-gallery-track">
        {(reducedMotion ? photos : [...photos, ...photos]).map((photo, index) => <figure
          className="event-gallery-frame"
          key={`${photo.name}-${index}`}
          ref={element => { cardsRef.current[index] = element }}
          aria-hidden={index >= photos.length || undefined}
        >
          <img src={reducedMotion || loadedPhotos.has(index % photos.length) ? `/gallery/responsive/${photo.name}-960.webp` : undefined} srcSet={reducedMotion || loadedPhotos.has(index % photos.length) ? [480, 960, 1440].map(width => `/gallery/responsive/${photo.name}-${width}.webp ${width}w`).join(', ') : undefined} sizes="(max-width: 700px) 58vw, 22vw" alt={index >= photos.length ? '' : photo.alt} loading="lazy" fetchPriority="low" decoding="async" width="960" height="640" />
        </figure>)}
      </div>
    </div>
  </section>
}
