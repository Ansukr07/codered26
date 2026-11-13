import { useRef } from 'react'
import { tracks } from './trackData.js'
import { TrackPixelGrid, DotArrowSVG } from './TracksAndPrizes.jsx'
import TrackButtonContent from './TrackButtonContent.jsx'
import { useBriefReveals } from './trackMotion.js'
import './track-detail.css'
import './track-problems.css'

export default function TrackProblemsPage({ track, onNavigate }) {
  const cardsRef = useRef(null)
  useBriefReveals(cardsRef)
  const follow = page => event => {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(page)
  }
  const problems = track.problemStatements || []
  const startupTracks = track.subtracks || []
  const isStartupRoot = startupTracks.length > 0
  const startupParent = track.startupParent
  const startupSiblings = startupParent ? tracks.find(item => item.slug === startupParent.slug)?.subtracks || [] : []
  const activeMainSlug = startupParent?.slug || track.slug
  const count = problems.length
  const openChallenge = track.briefKind === 'open-challenge'
  const selectionTitle = isStartupRoot ? 'Startup tracks' : openChallenge ? 'Open challenge' : 'Problem statements'
  const cards = isStartupRoot ? startupTracks : problems
  return <div className="track-detail ps-index">
    <div className="ps-container">
      <div className="ps-breadcrumb">
        <a className="td-back" href="/tracks" onClick={follow('tracks')}><span aria-hidden="true">←</span> All tracks</a>
        {startupParent && <><span className="ps-breadcrumb-separator" aria-hidden="true">/</span><a className="ps-parent-link" href={startupParent.problemsPath} onClick={follow(startupParent.problemsPage)}>{startupParent.title}</a></>}
      </div>
      {!startupParent && <nav className="ps-track-nav" aria-label="Choose a track">
        {tracks.map((item, index) => <a key={item.slug} href={item.problemsPath} onClick={follow(item.problemsPage)} aria-label={`Track ${index + 1}: ${item.title}`} aria-current={item.slug === activeMainSlug ? 'page' : undefined} title={item.title}>
          <span className="ps-track-nav-name">{item.title}</span>
          <span className="ps-track-nav-number" aria-hidden="true">{item.numeral}</span>
        </a>)}
      </nav>}
      {startupSiblings.length > 0 && <nav className="ps-track-nav ps-startup-nav" aria-label="Choose a startup track">
        {startupSiblings.map(item => <a key={item.slug} href={item.problemsPath} onClick={follow(item.problemsPage)} aria-current={item.slug === track.slug ? 'page' : undefined}>
          <span className="ps-track-nav-name">{item.title}</span>
        </a>)}
      </nav>}
      <header className="ps-header">
        <div className="ps-heading-copy"><p className="ps-category">{startupParent ? startupParent.title : `Track ${track.numeral}`} / {track.category}</p><h1>{track.title}</h1></div>
        <p className="ps-track-summary">{track.summary}</p>
      </header>
      <section aria-labelledby="ps-heading" className="ps-selection">
        <h2 id="ps-heading" className="sr-only">{selectionTitle}</h2>
        <div className="ps-section-bar">
          <p className="ps-count"><strong>{isStartupRoot ? String(startupTracks.length).padStart(2, '0') : track.hasPendingBriefs ? 'TBA' : String(count).padStart(2, '0')}</strong> {isStartupRoot ? 'Startup tracks' : openChallenge ? 'Open challenge' : `Problem ${count === 1 ? 'statement' : 'statements'}`}</p>
        </div>
        {cards.length ? <ol ref={cardsRef} className={`ps-grid${cards.length === 1 ? ' ps-grid--single' : ''}`}>{cards.map((item, index) => {
          const pending = !isStartupRoot && item.isPending
          const Card = pending ? 'article' : 'a'
          const itemId = isStartupRoot ? `startup-${index + 1}` : item.id
          const numeral = isStartupRoot ? String(index + 1).padStart(2, '0') : item.problemNumber
          const page = isStartupRoot ? item.problemsPage : item.page
          const path = isStartupRoot ? item.problemsPath : item.path
          return <li key={itemId}>
          <Card className={`ps-card track-card track-card-${index % 4 + 1}${isStartupRoot ? ' ps-company-card' : ''}${pending ? ' ps-card--pending' : ''}`} href={pending ? undefined : path} onClick={pending ? undefined : follow(page)} aria-disabled={pending || undefined} aria-labelledby={`ps-title-${itemId}`} aria-describedby={`ps-summary-${itemId}`}>
            <span className="track-top-flag">{isStartupRoot ? `Startup ${numeral}` : pending ? 'PS TBA' : openChallenge ? 'Open challenge' : `PS ${item.problemNumber}`}</span>
            <div className="track-card-body">
              <div className="tp-card-top">
                <TrackPixelGrid />
                <div className="tp-inner-box"><div className="tp-inner-icon" aria-hidden="true"><DotArrowSVG /></div><div className="tp-inner-text"><h3 className="tp-h-medium" id={`ps-title-${itemId}`}>{item.title}</h3></div></div>
              </div>
              <div className="track-card-content">
                <p className="tp-p-medium ps-card-summary" id={`ps-summary-${itemId}`}>{isStartupRoot ? item.cardDescription || item.summary : item.summary}</p>
                <span className="track-ghost-number" aria-hidden="true">{numeral}</span>
                {pending ? <span className="ps-card-action">Details coming soon</span> : <span className="ps-card-action td-button--motion"><TrackButtonContent arrow="↗">{isStartupRoot ? 'View track' : 'Read the brief'}</TrackButtonContent></span>}
              </div>
            </div>
          </Card>
        </li>})}</ol> : <p className="ps-empty">Problem statement details are TBA. They will be announced here.</p>}
      </section>
    </div>
  </div>
}
