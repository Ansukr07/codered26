import { tracks } from './trackData.js'
import { TrackPixelGrid, DotArrowSVG } from './TracksAndPrizes.jsx'
import TrackButtonContent from './TrackButtonContent.jsx'
import './track-detail.css'
import './track-problems.css'

export default function TrackProblemsPage({ track, onNavigate }) {
  const follow = page => event => {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(page)
  }
  const count = track.problemStatements.length
  return <div className="track-detail ps-index">
    <div className="ps-container">
      <div className="ps-breadcrumb"><a className="td-back" href="/tracks" onClick={follow('tracks')}><span aria-hidden="true">←</span> All tracks</a></div>
      <nav className="ps-track-nav" aria-label="Choose a track">
        {tracks.map((item, index) => <a key={item.slug} href={item.problemsPath} onClick={follow(item.problemsPage)} aria-label={`Track ${index + 1}: ${item.title}`} aria-current={item.slug === track.slug ? 'page' : undefined} title={item.title}><span>Track {index + 1}</span><span className="ps-track-nav-number" aria-hidden="true">{item.numeral}</span></a>)}
      </nav>
      <header className="ps-header">
        <div className="ps-heading-copy"><p className="ps-category">Track {track.numeral} / {track.category}</p><h1>{track.title}</h1></div>
        <p className="ps-track-summary">{track.summary}</p>
      </header>
      <section aria-labelledby="ps-heading" className="ps-selection">
        <h2 id="ps-heading" className="sr-only">Problem statements</h2>
        <div className="ps-section-bar">
          <p className="ps-count"><strong>{String(count).padStart(2, '0')}</strong> Problem {count === 1 ? 'statement' : 'statements'}</p>
        </div>
        {count ? <ol className="ps-grid">{track.problemStatements.map((problem, index) => <li key={problem.id}>
          <a className={`ps-card track-card track-card-${index % 4 + 1}`} href={problem.path} onClick={follow(problem.page)} aria-labelledby={`ps-title-${problem.id}`} aria-describedby={`ps-summary-${problem.id}`}>
            <span className="track-top-flag">PS {problem.problemNumber}</span>
            <div className="track-card-body">
              <div className="tp-card-top">
                <TrackPixelGrid />
                <div className="tp-inner-box"><div className="tp-inner-icon" aria-hidden="true"><DotArrowSVG /></div><div className="tp-inner-text"><h3 className="tp-h-medium" id={`ps-title-${problem.id}`}>{problem.title}</h3></div></div>
              </div>
              <div className="track-card-content">
                <p className="tp-p-medium ps-card-summary" id={`ps-summary-${problem.id}`}>{problem.summary}</p>
                <span className="track-ghost-number" aria-hidden="true">{problem.problemNumber}</span>
                <span className="ps-card-action td-button--motion"><TrackButtonContent arrow="↗">Read the brief</TrackButtonContent></span>
              </div>
            </div>
          </a>
        </li>)}</ol> : <p className="ps-empty">Problem statements will be announced here. Check back soon.</p>}
      </section>
    </div>
  </div>
}
