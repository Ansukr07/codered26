import { useEffect, useMemo, useState } from 'react'

const INTRO_DURATION = 1600
const DISSOLVE_DELAY = 200
const BLOCK_STAGGER = 12
const BLOCK_ANIMATION = 400

function gridSize() {
  const columns = window.innerWidth <= 768 ? 6 : 10
  const rows = Math.ceil(window.innerHeight / (window.innerWidth / columns))
  return { columns, rows }
}

export default function Preloader() {
  const [firstVisit] = useState(() => !sessionStorage.getItem('CR_TAB_MEMORY'))
  const [{ columns, rows }] = useState(gridSize)
  const [dissolving, setDissolving] = useState(false)
  const [finished, setFinished] = useState(false)
  const count = columns * rows

  const revealOrder = useMemo(() => {
    const order = Array.from({ length: count }, (_, index) => index)
    let seed = count * 2654435761
    for (let index = order.length - 1; index > 0; index--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      const random = seed % (index + 1)
      ;[order[index], order[random]] = [order[random], order[index]]
    }
    return order
  }, [count])

  useEffect(() => {
    sessionStorage.setItem('CR_TAB_MEMORY', 'true')
    document.documentElement.classList.add('preloader-active')
    document.body.style.overflow = 'hidden'

    const introTime = firstVisit ? INTRO_DURATION : 0
    const dissolveTimer = window.setTimeout(() => setDissolving(true), introTime + DISSOLVE_DELAY)
    const finishTimer = window.setTimeout(() => {
      setFinished(true)
      document.documentElement.classList.remove('preloader-active')
      document.body.style.overflow = ''
      window.dispatchEvent(new Event('preloaderComplete'))
    }, introTime + DISSOLVE_DELAY + count * BLOCK_STAGGER + BLOCK_ANIMATION)

    return () => {
      window.clearTimeout(dissolveTimer)
      window.clearTimeout(finishTimer)
      document.documentElement.classList.remove('preloader-active')
      document.body.style.overflow = ''
    }
  }, [count, firstVisit])

  if (finished) return null

  return <>
    <div
      id="preloader"
      aria-hidden="true"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {revealOrder.map((order, index) =>
        <div
          className={`block${dissolving ? ' hide' : ''}`}
          key={index}
          style={{ '--block-delay': `${order * BLOCK_STAGGER}ms` }}
        />
      )}
    </div>
    {firstVisit && !dissolving && <div id="intro-text" aria-hidden="true">
      <span id="intro-text-inner">
        {[..."CODERED'26"].map((character, index) =>
          <span className="intro-char" key={index} style={{ '--char-delay': `${index * 35}ms` }}>{character}</span>
        )}
      </span>
    </div>}
  </>
}
