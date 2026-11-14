import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { tracks } from './trackData.js'
import { useTrackEntrance, useBriefReveals } from './trackMotion.js'
import TrackBriefRail from './TrackBriefRail.jsx'
import TrackScene from './TrackScene.jsx'
import TrackButtonContent from './TrackButtonContent.jsx'
import OfficialBriefContent, { officialBriefSections } from './OfficialBriefContent.jsx'
import useTrackSectionHighlight from './useTrackSectionHighlight.js'
import { getHeroConnections } from './heroConnections.js'
import { getMobileHeroCompression, MOBILE_HERO_SPACE_BUDGET } from './mobileHeroFit.js'
import './track-detail.css'

const sections = [
  ['problem', 'The challenge'], ['focus', 'Focus areas'], ['ideas', 'Example projects'],
  ['judging', 'Judging'], ['next', 'Explore more'],
]

function TopicIcon({ index }) {
  const drawings = [
    <><path d="m12 3 2.6 5.4 5.9.8-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.8Z" /></>,
    <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2" /></>,
    <><circle cx="12" cy="8" r="4" /><path d="M5 21v-3a7 7 0 0 1 14 0v3M9 18h6" /></>,
    <><path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7Z" /><path d="m8 12 3 3 5-6" /></>,
    <><path d="M4 20V8l8-5 8 5v12ZM9 20v-7h6v7M8 9h.1M16 9h.1" /></>,
    <><path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8m-8 4h6" /></>,
  ]
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[index % drawings.length]}</svg>
}

function useDemoPrompt(track, stageRef, cycle = true) {
  const [demo, setDemo] = useState({ index: 0, count: 0 })
  const [running, setRunning] = useState(false)
  const prompt = track.prompts[demo.index]
  const letters = useMemo(() => typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(prompt.text), item => item.segment)
    : Array.from(prompt.text), [prompt.text])
  const done = demo.count >= letters.length

  useLayoutEffect(() => {
    const element = stageRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let intersecting = false
    const update = () => {
      setRunning(intersecting && !document.hidden && !motion.matches && !document.documentElement.classList.contains('preloader-active'))
      if (motion.matches) setDemo({ index: 0, count: Infinity })
    }
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update() }, { threshold: 0.15 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    window.addEventListener('preloaderComplete', update)
    update()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
      window.removeEventListener('preloaderComplete', update)
    }
  }, [stageRef])

  useEffect(() => {
    if (!running || !cycle) return
    const timer = window.setTimeout(() => {
      if (done) setDemo({ index: (demo.index + 1) % track.prompts.length, count: 0 })
      else setDemo({ index: demo.index, count: demo.count + 1 })
    }, done ? 2450 : 70)
    return () => window.clearTimeout(timer)
  }, [demo, done, running, track, cycle])

  return { ...demo, prompt, text: letters.slice(0, demo.count).join(''), done, running }
}

function useHeroLayout(stageRef, diagram, measuredConnections = false) {
  const [anchor, setAnchor] = useState({ left: 31, right: 69, y: 35 })

  useLayoutEffect(() => {
    const stage = stageRef.current
    const hero = stage.closest('.td-hero')
    const intro = stage.closest('.td-intro')
    const page = intro.closest('.track-detail')
    const visibleViewport = window.visualViewport
    const topbar = intro.querySelector('.td-topbar')
    const heading = hero.querySelector('.td-heading')
    const demo = stage.querySelector('.td-demo')
    const search = stage.querySelector('.td-search')
    const calls = stage.querySelector('.td-scene-calls')
    const ticker = stage.querySelector('.td-scene-ticker')
    const topics = [...stage.querySelectorAll('.td-topic')]
    let frame = 0
    let disposed = false
    const measure = () => {
      frame = 0
      if (disposed) return
      const heroStyle = window.getComputedStyle(hero)
      const stageStyle = window.getComputedStyle(stage)
      if (diagram && measuredConnections && window.matchMedia('(max-width: 639.98px)').matches) {
        const currentCompression = Number.parseFloat(page.style.getPropertyValue('--td-mobile-fit')) || 0
        const flowHeight = (Number.parseFloat(window.getComputedStyle(page).paddingTop) || 0)
          + topbar.offsetHeight + (Number.parseFloat(heroStyle.paddingTop) || 0)
          + heading.offsetHeight + (Number.parseFloat(stageStyle.marginTop) || 0) + demo.offsetHeight
        const compression = getMobileHeroCompression({
          flowHeight,
          currentCompression,
          viewportHeight: Math.min(window.innerHeight, visibleViewport?.height || window.innerHeight),
        })
        if (compression === 0) page.style.removeProperty('--td-mobile-fit')
        else if (Math.abs(compression - currentCompression) * MOBILE_HERO_SPACE_BUDGET > 1.5) {
          page.style.setProperty('--td-mobile-fit', compression.toFixed(4))
        }
      } else page.style.removeProperty('--td-mobile-fit')
      const outer = stage.getBoundingClientRect()
      if (!outer.width || !outer.height) return

      // A definite viewport budget constrains SVGs; measured content sets its safe floor.
      if (window.matchMedia('(min-width: 1024px)').matches) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const short = window.matchMedia('(max-height: 850px)').matches
        const stageMinimum = diagram ? demo.offsetHeight + 20
          : ticker.offsetHeight + (reduced ? calls.offsetHeight + 260 : short ? Math.max(calls.offsetHeight, 220) : calls.offsetHeight + 180)
        const fixedHeight = topbar.offsetHeight + heading.offsetHeight
          + (Number.parseFloat(heroStyle.paddingTop) || 0) + (Number.parseFloat(stageStyle.marginTop) || 0)
        const minimumStageHeight = Math.max(stageMinimum, diagram ? 0 : Number.parseFloat(stageStyle.minHeight) || 0)
        const minimum = `${Math.ceil(fixedHeight + minimumStageHeight)}px`
        if (intro.style.getPropertyValue('--td-intro-min-height') !== minimum) intro.style.setProperty('--td-intro-min-height', minimum)
      }

      if (diagram) {
        const height = `${demo.offsetHeight}px`
        if (stage.style.getPropertyValue('--td-demo-height') !== height) stage.style.setProperty('--td-demo-height', height)
        const query = search.getBoundingClientRect()
        const next = {
          left: (query.left - outer.left) / outer.width * 100,
          right: (query.right - outer.left) / outer.width * 100,
          y: (query.top + query.height / 2 - outer.top) / outer.height * 100,
        }
        if (measuredConnections && topics.every(topic => topic.offsetWidth > 0)) {
          const frameBounds = { left: query.left - outer.left, right: query.right - outer.left, top: query.top - outer.top, height: query.height }
          const topicPorts = topics.map((topic, index) => {
            const style = getComputedStyle(topic)
            const bounds = topic.getBoundingClientRect()
            // Ignore the active card's 2px decorative translation to keep paths steady.
            const centerX = parseFloat(style.left)
            const centerY = parseFloat(style.top)
            return { x: centerX + (index < 3 ? bounds.width / 2 - 3 : -bounds.width / 2 + 3), y: centerY }
          })
          next.connections = { viewBox: `0 0 ${outer.width} ${outer.height}`, routes: getHeroConnections(frameBounds, topicPorts) }
        }
        const signature = value => value?.connections ? `${value.connections.viewBox}:${value.connections.routes.map(route => route.path).join('|')}` : ''
        setAnchor(previous => ['left', 'right', 'y'].some(key => Math.abs(previous[key] - next[key]) > .1) || signature(previous) !== signature(next) ? next : previous)
      }
    }
    const schedule = () => { if (!disposed && !frame) frame = window.requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    for (const element of [stage, topbar, heading, demo, search, calls, ticker, ...(measuredConnections ? topics : [])].filter(Boolean)) observer.observe(element)
    window.addEventListener('resize', schedule, { passive: true })
    visibleViewport?.addEventListener('resize', schedule, { passive: true })
    document.fonts?.ready.then(schedule, schedule)
    schedule()
    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      visibleViewport?.removeEventListener('resize', schedule)
      page.style.removeProperty('--td-mobile-fit')
      window.cancelAnimationFrame(frame)
    }
  }, [diagram, stageRef, measuredConnections])

  return anchor
}

function TrackHero({ track }) {
  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const diagram = track.heroMode === 'diagram'
  const isOfficialBrief = Boolean(track.officialBrief)
  const isRea = track.officialBrief?.company === 'MyStartupWave' && track.officialBrief.number === 1
  const demo = useDemoPrompt(track, stageRef, diagram)
  const anchor = useHeroLayout(stageRef, diagram, isOfficialBrief)
  useTrackEntrance(heroRef)
  const positions = [[12, 16], [9, 49], [15, 82], [88, 16], [91, 49], [85, 82]]

  const paths = isOfficialBrief ? anchor.connections?.routes.map(route => route.path) || [] : positions.map(([x, y], index) => {
    const end = index < 3 ? anchor.left : anchor.right
    const mid = (x + end) / 2
    return `M ${x} ${y} C ${mid} ${y}, ${mid} ${anchor.y}, ${end} ${anchor.y}`
  })

  return <section ref={heroRef} className={`td-hero${diagram ? '' : ' td-hero--scene'}${isOfficialBrief ? ' td-hero--brief' : ''}${isRea ? ' td-hero--rea' : ''}`} aria-labelledby="td-title">
    <div className="td-heading">
      <p className="td-kicker">{isOfficialBrief ? <>{track.parentTrackTitle}<span> / </span>{track.briefKind === 'open-challenge' ? 'Open challenge' : `PS ${track.problemNumber}`}</> : <>{track.problemNumber ? `${track.parentTrackTitle} · ${track.briefKind === 'open-challenge' ? 'Open challenge' : `PS ${track.problemNumber}`}` : `Track ${track.numeral}`} <span> / </span> {track.category}</>}</p>
      <h1 id="td-title"><span className="td-title-mask"><span>{track.title}</span></span></h1>
      <p className="td-subtitle">{isRea ? 'Understand an app. Build a better version.' : track.subtitle}</p>
    </div>
    <div ref={stageRef} className={`td-stage${demo.running ? ' td-stage--running' : ''}`}>
      {diagram ? <>
      <svg className="td-connections" viewBox={isOfficialBrief ? anchor.connections?.viewBox || '0 0 100 100' : '0 0 100 100'} preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path, i) => {
          return <g key={i} className={track.topics[i].id === demo.prompt.topicId ? 'td-path--active' : ''}>
            <path d={path} className="td-connection" vectorEffect="non-scaling-stroke" />
            <path d={path} className="td-pulse" vectorEffect="non-scaling-stroke" pathLength="100" />
          </g>
        })}
      </svg>
      {track.topics.map((topic, i) => <div className={`td-topic${topic.id === demo.prompt.topicId ? ' td-topic--active' : ''}`} key={topic.label} style={{ left: `${positions[i][0]}%`, top: `${positions[i][1]}%` }} aria-hidden="true">
        <span className="td-topic-icon"><TopicIcon index={i} /></span><span>{topic.label}</span>
      </div>)}
      <div className="td-demo">
        <div className="td-search" role="img" aria-label={`Illustrative example: ${track.prompts[0].text}`}>
          <svg className="td-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <span className="td-query" aria-hidden="true">
            {track.prompts.map(prompt => <span className="td-query-size" key={prompt.text}>{prompt.text}<i /></span>)}
            <span className="td-query-text">{demo.text}<i /></span>
          </span>
          <span className="td-demo-label" aria-hidden="true">{demo.prompt.channel}</span>
          <span className="td-mic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11v1a7 7 0 0 0 14 0v-1m-7 8v3m-4 0h8" /></svg></span>
        </div>
        <div className={`td-answer${demo.done ? ' td-answer--visible' : ''}`} aria-hidden="true">
          {track.prompts.map(prompt => <div className="td-answer-set td-answer-size" key={prompt.text}>{prompt.answers.map(answer => <span key={answer}>{answer}</span>)}</div>)}
          <div className="td-answer-set td-answer-live">{demo.prompt.answers.map((answer, i) => <span key={answer} style={{ transitionDelay: demo.done ? `${i * 90}ms` : '0ms' }}>{answer}</span>)}</div>
        </div>
        <p className="td-summary">{track.summary}</p>
        <div className="td-actions"><a className="td-button td-button--red td-button--motion" href="#problem"><TrackButtonContent arrow="↗">Read the brief</TrackButtonContent></a><a className="td-button td-button--motion" href={`#${track.heroExploreTarget || 'focus'}`}><TrackButtonContent arrow="↓">{track.heroExploreLabel || 'Explore focus areas'}</TrackButtonContent></a></div>
      </div>
      </> : <>
        <div className="td-scene-calls"><p className="td-summary">{track.summary}</p><div className="td-actions"><a className="td-button td-button--red td-button--motion" href="#problem"><TrackButtonContent arrow="↗">Read the brief</TrackButtonContent></a><a className="td-button td-button--motion" href="#focus"><TrackButtonContent arrow="↓">Explore focus areas</TrackButtonContent></a></div></div>
        <TrackScene slug={track.slug} running={demo.running} />
        <div className="td-scene-ticker"><span>FOCUS AREAS</span><div><div className="td-scene-ticker-run" data-running={demo.running}>{[0, 1].map(copy => <div key={copy} aria-hidden={copy === 1 ? true : undefined}>{track.topics.map(topic => <span key={topic.label}>{topic.label}<i aria-hidden="true">✳</i></span>)}</div>)}</div></div></div>
      </>}
    </div>
  </section>
}

function SectionHeading({ label, children }) {
  return <div className="td-section-heading"><p className="td-kicker"><span className="td-dash" /><span>{label}</span></p><div className="td-section-mask"><h2>{children}</h2></div></div>
}

export default function TrackDetailPage({ track, parentTrack = track, onNavigate }) {
  const pageRef = useRef(null)
  useBriefReveals(pageRef)
  const activeSection = useTrackSectionHighlight(pageRef, track.page)
  const openChallenge = track.briefKind === 'open-challenge'
  const isProblem = Boolean(track.problemNumber)
  const trackGroup = parentTrack.startupParent
    ? tracks.find(item => item.page === parentTrack.startupParent.page)?.subtracks || []
    : tracks
  const trackLinks = trackGroup.map(item => ({ ...item, page: item.problemsPage, path: item.problemsPath }))
  const siblings = isProblem ? (parentTrack.problemStatements || []).filter(item => !item.isPending) : trackLinks
  const position = siblings.findIndex(item => item.page === (isProblem ? track.page : parentTrack.problemsPage))
  const hasSiblingNavigation = position >= 0 && siblings.length > 1
  const railSections = track.officialBrief ? (openChallenge ? [officialBriefSections[0], ['directions', 'Suggested directions'], ...officialBriefSections.slice(1)] : officialBriefSections) : sections
  const briefKind = track.problemNumber ? (openChallenge ? 'challenge' : 'problem') : 'track'
  const previous = hasSiblingNavigation ? siblings[(position - 1 + siblings.length) % siblings.length] : null
  const next = hasSiblingNavigation ? siblings[(position + 1) % siblings.length] : null
  const backTrack = !isProblem && parentTrack.startupParent ? parentTrack.startupParent : parentTrack
  const backLabel = backTrack !== parentTrack ? backTrack.title : openChallenge ? `${parentTrack.title} track` : 'Challenges'
  const register = () => onNavigate('notFound')
  const follow = (page) => (event) => {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(page)
  }

  return <div ref={pageRef} className={`track-detail${track.officialBrief ? ' track-detail--official' : ''}`}>
    <div className="td-intro">
      <div className="td-topbar">
        <a className="td-back td-back--button" href={backTrack.problemsPath} onClick={follow(backTrack.problemsPage)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg><span>{backLabel}</span></a>
      </div>
      <TrackHero key={track.page} track={track} />
    </div>
    <div className="td-brief-layout">
      <aside className="td-rail"><TrackBriefRail sections={railSections} activeSection={activeSection} title={track.title} kind={briefKind} /></aside>
      <div className="td-brief">
        {track.officialBrief ? <OfficialBriefContent track={track} /> : <>
        <section id="problem" className="td-brief-section td-problem">
          <div className="td-number-card"><span>BRIEF / {track.category}</span><strong>{track.problemNumber || track.numeral}</strong><p>{track.title}</p></div>
          <div><SectionHeading label="The objective">{track.subtitle}</SectionHeading><p className="td-body-copy">{track.problem}</p><div className="td-tags">{track.focus.map((area) => <span key={area.title}>{area.title}</span>)}</div></div>
        </section>
        <section id="focus" className="td-brief-section"><SectionHeading label="Focus areas">Where you can make<br />a difference.</SectionHeading><ol className="td-focus-grid">{track.focus.map((area, i) => <li key={area.title}><span className="td-focus-number">{String(i + 1).padStart(2, '0')}</span><h3>{area.title}</h3><p>{area.text}</p></li>)}</ol></section>
        <section id="ideas" className="td-brief-section td-ideas"><div><SectionHeading label="Example projects">A spark to<br />start with.</SectionHeading><p className="td-body-copy">A few directions to explore. Your team can approach the challenge in its own way.</p></div><ol>{track.ideas.map((idea, i) => <li key={idea}><span>{String(i + 1).padStart(2, '0')}</span><p>{idea}</p></li>)}</ol></section>
        <section id="judging" className="td-brief-section"><SectionHeading label="Judging">Build with purpose.</SectionHeading><dl className="td-criteria">{[['Originality', 'A thoughtful approach to the challenge and a clear reason for your solution.'], ['Working prototype', 'A demonstrable core experience with a realistic scope.'], ['Usability', 'A product that is clear and accessible for its intended users.'], ['Potential impact', 'A useful outcome and a credible path to making it happen.']].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl></section>
        </>}
        <section id="next" className="td-brief-section td-next">
          <div className="td-next-banner" aria-labelledby="td-register-title">
            <p className="td-kicker">28–29 December 2026 · BMSIT&amp;M, Bengaluru</p>
            <h2 id="td-register-title">Register for {track.title}</h2>
            <p className="td-register-summary">Teams of 3–4. Turn ideas into working products during Code Red’s 24-hour finale.</p>
            <div className="td-register-actions">
              <button className="td-button td-button--motion" type="button" onClick={register}><TrackButtonContent arrow="↗">Register your team</TrackButtonContent></button>
              <a className="td-button td-button--outline td-button--motion" href="/faq" onClick={follow('faq')}><TrackButtonContent>Participation details</TrackButtonContent></a>
            </div>
            <p className="td-register-note">Registration coming soon</p>
          </div>
          {hasSiblingNavigation && <nav className="td-other-tracks" aria-label={isProblem ? 'Other challenges' : parentTrack.startupParent ? 'Other startup tracks' : 'Other tracks'}>
            <a href={previous.path} onClick={follow(previous.page)}><span>← PREVIOUS {track.problemNumber ? 'PS' : 'TRACK'} / {previous.problemNumber || previous.numeral}</span><strong>{previous.title}</strong></a>
            <a href={next.path} onClick={follow(next.page)}><span>NEXT {track.problemNumber ? 'PS' : 'TRACK'} / {next.problemNumber || next.numeral} →</span><strong>{next.title}</strong></a>
          </nav>}
        </section>
      </div>
    </div>
  </div>
}
