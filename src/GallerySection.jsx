import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame, useReducedMotion } from 'framer-motion'
import './gallery-section.css'

const photos = [
  { src: '/images/footimg2%20(1).jpg', alt: 'Photographer capturing a Code Red moment' },
  { src: '/images/footimg3%20(1).webp', alt: 'Participants working together during Code Red' },
  { src: '/images/footimg7%20(1).webp', alt: 'Participants gathered by a fire at a previous Code Red event' },
  { src: '/images/footimg8%20(1).webp', alt: 'Team presenting a project to judges' },
  { src: '/images/footimg5%20(1).webp', alt: 'Code Red participants holding their certificates' },
  { src: '/gallery/optimized/20251212_161438.webp', alt: 'Participant building a hardware project at Code Red' },
  { src: '/gallery/optimized/20251212_193615.webp', alt: 'Code Red participants discussing their project in a classroom' },
  { src: '/gallery/optimized/20251213_022705.webp', alt: 'Teams working on projects during Code Red' },
  { src: '/gallery/optimized/DSC01642.webp', alt: 'Mentor reviewing a participant’s work' },
  { src: '/gallery/optimized/DSC01924.webp', alt: 'Code Red participant presenting on stage' },
  { src: '/gallery/optimized/DSC01950.webp', alt: 'Participants speaking with a judge at Code Red' },
]

export default function GallerySection({ followedByFaq = false }) {
  const reducedMotion = useReducedMotion()
  const windowRef = useRef(null)
  const cardsRef = useRef([])
  const offsetRef = useRef(0)
  const visibleRef = useRef(true)
  const pausedRef = useRef(false)

  useEffect(() => {
    const node = windowRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    const node = windowRef.current
    const first = cardsRef.current[0]
    if (!node || !first || !visibleRef.current) return
    const cardWidth = first.offsetWidth
    const isPhone = window.innerWidth <= 700
    const gap = isPhone ? 28 : 40
    const stride = cardWidth + gap
    const loopWidth = cardsRef.current.length * stride
    const viewWidth = node.offsetWidth
    if (!reducedMotion && !pausedRef.current) offsetRef.current = (offsetRef.current + Math.min(delta, 64) * (isPhone ? .08 : .147)) % loopWidth

    cardsRef.current.forEach((card, index) => {
      if (!card) return
      let x = ((index * stride - stride * .43 - offsetRef.current) % loopWidth + loopWidth) % loopWidth
      if (x > loopWidth - stride) x -= loopWidth
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
  })

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
    <div className="event-gallery-window" ref={windowRef} onPointerEnter={() => { pausedRef.current = true }} onPointerLeave={() => { pausedRef.current = false }}>
      <div className="event-gallery-track">
        {[...photos, ...photos].map((photo, index) => <figure
          className="event-gallery-frame"
          key={`${photo.src}-${index}`}
          ref={element => { cardsRef.current[index] = element }}
          aria-hidden={index >= photos.length || undefined}
        >
          <img src={photo.src} alt={index >= photos.length ? '' : photo.alt} loading={index < photos.length ? 'eager' : 'lazy'} />
        </figure>)}
      </div>
    </div>
  </section>
}
