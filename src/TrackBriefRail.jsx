import { useId, useState } from 'react'
import './track-brief-rail.css'

function BriefIcon({ section }) {
  const paths = {
    problem: ['M15 12H3', 'M17 18H3', 'M21 6H3'],
    focus: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M12 11h4', 'M12 16h4', 'M8 11h.01', 'M8 16h.01'],
    ideas: ['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', 'M9 18h6', 'M10 22h4'],
    judging: ['m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z', 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z', 'M7 21h10', 'M12 3v18', 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'],
    next: ['M5 12h14', 'm12 5 7 7-7 7'],
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {section === 'focus' && <rect width="8" height="4" x="8" y="2" rx="1" />}
    {(paths[section] || paths.next).map(path => <path key={path} d={path} />)}
  </svg>
}

export default function TrackBriefRail({ sections, activeSection, title }) {
  const [expanded, setExpanded] = useState(true)
  const bodyId = useId()
  const rowHeight = 44
  const trunk = 12
  const radius = 9
  const reach = 34
  const activeIndex = sections.findIndex(([id]) => id === activeSection)
  const rowY = (index) => 6 + index * rowHeight + rowHeight / 2
  const height = 12 + sections.length * rowHeight

  return <nav className="td-branched" aria-label="In this track brief" data-open={expanded ? '' : undefined} style={{ '--td-branched-row': `${rowHeight}px` }}>
    <span className="td-branched__marker" aria-hidden="true" data-active={activeIndex >= 0 ? '' : undefined} />
    <button className="td-branched__head" type="button" aria-expanded={expanded} aria-controls={bodyId} onClick={() => setExpanded(value => !value)}>
      <span>On this page{title ? ` · ${title}` : ''}</span>
    </button>
    <div id={bodyId} className="td-branched__body" inert={!expanded}>
      <div className="td-branched__fold">
        <div className="td-branched__tree" style={{ height }}>
          <svg className="td-branched__lines" width="39" height={height} aria-hidden="true">
            <path className="td-branched__base" d={`M ${trunk} 0 V ${Math.max(0, rowY(sections.length - 1) - radius)}`} />
            {sections.map(([id], index) => {
              const y = rowY(index)
              const branch = `M ${trunk} ${y - radius} A ${radius} ${radius} 0 0 0 ${trunk + radius} ${y} H ${reach}`
              const length = y - radius + Math.PI * radius / 2 + reach - trunk - radius
              return <g key={id}>
                <path className="td-branched__base" d={branch} />
                <path className="td-branched__reach" d={`M ${trunk} 0 V ${y - radius} A ${radius} ${radius} 0 0 0 ${trunk + radius} ${y} H ${reach}`} style={{ strokeDasharray: length, strokeDashoffset: activeSection === id ? 0 : length }} />
              </g>
            })}
          </svg>
          {sections.map(([id, label]) => <a className="td-branched__item" key={id} href={`#${id}`} tabIndex={expanded ? 0 : -1} aria-current={activeSection === id ? 'location' : undefined}>
            <span className="td-branched__icon"><BriefIcon section={id} /></span><span>{label}</span>
          </a>)}
        </div>
      </div>
    </div>
  </nav>
}
