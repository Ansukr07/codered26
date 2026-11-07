import { useId } from 'react'
import './track-scene.css'

// Fixed seeds make the SVG identical in the server-rendered and client versions.
function random(seed) {
  let value = seed
  return () => ((value = value * 16807 % 2147483647) - 1) / 2147483646
}

function Buildings({ seed, base, count, className, windows = false }) {
  const next = random(seed)
  return <g className={className}>{Array.from({ length: count }, (_, i) => {
    const x = i * 86 - 60, height = 50 + next() * 155, width = 50 + next() * 35
    return <g key={i}><rect x={x} y={base - height} width={width} height={height + 90} />
      {next() > .65 && <path d={`M${x + width / 2} ${base - height}v-30m-7 12h14`} className="tds-outline" />}
      {windows && Array.from({ length: 5 }, (_, row) => Array.from({ length: 3 }, (_, col) => <rect key={`${row}-${col}`} className="tds-window" x={x + 9 + col * 14} y={base - height + 15 + row * 21} width="7" height="10" />))}
    </g>
  })}</g>
}

function Packet({ path, duration = 5, delay = 0 }) {
  return <circle className="tds-packet" r="6" style={{ offsetPath: `path('${path}')`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }} />
}

function Antenna({ x, y }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-18 100 0 0l18 100M-10 60h20M-5 30H5" className="tds-outline" />
    {[0, 1, 2].map(i => <path className="tds-signal" style={{ animationDelay: `${i * .4}s` }} key={i} d={`M${-15 - i * 13} ${-8 - i * 10}a${22 + i * 15} ${22 + i * 15} 0 0 1 ${30 + i * 26} 0`} />)}
  </g>
}

function CityScene() {
  const links = ['M120 430 Q320 210 510 410', 'M510 410 Q710 240 900 420', 'M900 420 Q1090 170 1310 400', 'M1310 400 Q1430 280 1550 420']
  return <>
    <circle cx="830" cy="210" r="138" className="tds-halo" />
    <g className="tds-scan" style={{ transformOrigin: '830px 210px' }}><path d="m830 210-240 380h480Z" className="tds-beam" /></g>
    <g className="tds-orbit" style={{ transformOrigin: '830px 210px' }}><circle cx="830" cy="210" r="123" className="tds-ring" /><circle cx="953" cy="210" r="6" className="tds-red" /></g>
    <g transform="translate(830 210)"><circle r="93" className="tds-paper-disc" /><path d="M-31 28V-25L0-44l31 19v53ZM-8 28V4H8v24M-19-12h6m26 0h6M-3-25h6" className="tds-outline" /><path d="m-55 48 55 16 55-16" className="tds-accent-line" /></g>
    <Buildings seed={23} count={21} base={470} className="tds-buildings-far" />
    <Buildings seed={42} count={21} base={550} className="tds-buildings-mid" windows />
    <Antenna x={290} y={280} /><Antenna x={1210} y={270} />
    {links.map((path, i) => <g key={path}><path d={path} className="tds-link" /><Packet path={path} duration={4.8 + i * .5} delay={-i} /><circle cx={[120, 510, 900, 1310][i]} cy={[430, 410, 420, 400][i]} r="9" className="tds-node" /></g>)}
    <path d="M0 585Q300 562 520 590t470-5 610 5v60H0Z" className="tds-ground" />
    <path d="M0 614H1600" className="tds-road" />
    <g className="tds-traffic"><rect x="170" y="592" width="45" height="16" rx="3" className="tds-red" /><rect x="177" y="583" width="27" height="12" className="tds-red" /><circle cx="180" cy="610" r="5" /><circle cx="206" cy="610" r="5" /></g>
    <g className="tds-traffic tds-traffic-return"><rect x="1200" y="620" width="58" height="15" rx="3" className="tds-paper" /><circle cx="1210" cy="638" r="5" /><circle cx="1248" cy="638" r="5" /></g>
    <g className="tds-caption-art"><text x="70" y="540" className="tds-label">SHARED SPACES</text><text x="1440" y="540" className="tds-label" textAnchor="end">CONNECTED IDEAS</text></g>
  </>
}

function CareScene({ clipId }) {
  const nodes = [[340, 225], [470, 460], [1150, 200], [1280, 440]]
  return <>
    <path d="M0 560Q300 460 610 540T1200 530t400 30v90H0Z" className="tds-soft-ground" />
    {[120, 165, 215].map((r, i) => <circle key={r} cx="800" cy="310" r={r} className={`tds-ring${i === 1 ? ' tds-orbit' : ''}`} style={{ transformOrigin: '800px 310px', animationDirection: i === 1 ? 'reverse' : undefined }} />)}
    {nodes.map(([x, y], i) => {
      const path = `M${x} ${y} Q${(x + 800) / 2} ${y - 95} 800 310`
      return <g key={x}><path d={path} className="tds-link" /><Packet path={path} duration={5 + i * .7} delay={-i * 1.1} /><g transform={`translate(${x} ${y})`}><circle r="42" className="tds-paper-disc" /><circle cy="-10" r="10" className="tds-outline" /><path d="M-20 22v-5a20 20 0 0 1 40 0v5" className="tds-outline" /><circle r="53" className="tds-node-ping" style={{ animationDelay: `${i * .5}s` }} /></g></g>
    })}
    <g className="tds-orbit" style={{ transformOrigin: '800px 310px', animationDuration: '38s' }}><circle cx="1015" cy="310" r="8" className="tds-red" /><circle cx="585" cy="310" r="5" className="tds-ink" /></g>
    <defs><clipPath id={clipId}><circle cx="800" cy="310" r="113" /></clipPath></defs>
    <circle cx="800" cy="310" r="123" className="tds-paper-disc" /><circle cx="800" cy="310" r="113" className="tds-red" />
    <g clipPath={`url(#${clipId})`}><path d="M680 310H920M800 190V430M720 230 880 390m0-160L720 390" className="tds-care-grid" /><rect x="685" y="210" width="230" height="5" className="tds-care-scan" /></g>
    <path d="M800 366c-18-15-61-41-61-70 0-34 42-46 61-16 19-30 61-18 61 16 0 29-43 55-61 70Z" className="tds-heart" />
    <path d="M740 315h32l12-24 16 47 14-29 12 6h34" className="tds-heart-line" pathLength="100" />
    <g className="tds-caption-art"><text x="800" y="535" textAnchor="middle" className="tds-label">PEOPLE · ACCESS · COORDINATION</text>
      <g transform="translate(726 562)"><rect width="148" height="34" className="tds-tag" /><text x="74" y="22" textAnchor="middle" className="tds-label">CARE DEMO</text></g>
    </g>
  </>
}

function Tree({ x, y, size = 1, shade = 0 }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}><ellipse cy="4" rx="24" ry="4" className="tds-tree-shadow" /><path d="M-3 0v-57h6V0Z" className="tds-ink" /><g className={`tds-tree tds-tree-${shade}`}><circle cy="-67" r="23" /><circle cx="-19" cy="-49" r="19" /><circle cx="19" cy="-49" r="19" /><circle cy="-35" r="20" /></g></g>
}

function Turbine({ x, y, height, duration }) {
  return <g transform={`translate(${x} ${y})`}><path d={`M-5 0-2 ${-height}h4L5 0Z`} className="tds-turbine-base" /><g transform={`translate(0 ${-height})`}><g className="tds-rotor" style={{ animationDuration: `${duration}s` }}>{[0, 120, 240].map(angle => <path key={angle} transform={`rotate(${angle})`} d="M0 0Q12-30 0-100Q-7-40 0 0Z" className="tds-turbine-blade" />)}<circle r="6" className="tds-red" /></g></g></g>
}

function CircularScene() {
  const next = random(7)
  return <>
    <circle cx="1150" cy="165" r="67" className="tds-halo" />
    <g className="tds-clouds"><path d="M220 150h160q12-28-16-36-8-42-46-25-36-24-54 16-30-2-44 45ZM990 100h130q-7-31-33-28-9-36-42-17-36-6-55 45Z" className="tds-cloud" /></g>
    <path d="M0 400Q170 290 360 370T760 350 1200 365t400-20v305H0Z" className="tds-land-far" />
    {Array.from({ length: 23 }, (_, i) => <Tree key={i} x={i * 77 - 20} y={415 + next() * 24} size={.5 + next() * .3} shade={0} />)}
    <Turbine x={285} y={440} height={235} duration={8} /><Turbine x={430} y={420} height={180} duration={10} /><Turbine x={1300} y={427} height={245} duration={7} />
    <path d="M0 490Q240 390 470 460t380-15 420 20 330-5v190H0Z" className="tds-land-mid" />
    <path d="M800 440Q960 455 850 505T600 650H900Q900 590 1020 535T800 440Z" className="tds-river" />
    <path d="M0 586Q260 495 540 565t620-5 440 20v70H0Z" className="tds-land-near" />
    <g transform="translate(650 490)"><ellipse cx="160" cy="122" rx="220" ry="16" className="tds-tree-shadow" /><path d="M0 120 40 0h335l40 120Z" className="tds-solar-frame" /><path d="M20 102 50 15h315l28 87Z" className="tds-solar" />{[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${55 + i * 58} 15 ${25 + i * 69} 102`} className="tds-solar-lines" />)}<path d="M39 44h335M30 73h353M35 122v24m340-24v24" className="tds-solar-lines" /><path d="m70 17 50 85h40l-50-85Z" className="tds-solar-glint" /></g>
    {[[80, 640, 1.6], [200, 610, 1.15], [350, 600, .95], [1190, 602, 1], [1350, 615, 1.3], [1515, 640, 1.7]].map(([x, y, size], i) => <Tree key={x} x={x} y={y} size={size} shade={i % 2 + 1} />)}
    <g className="tds-birds"><path d="M1050 120q10-10 20 0t20 0M1120 90q7-7 14 0t14 0M1090 155q6-6 12 0t12 0" /></g>
  </>
}

export default function TrackScene({ slug, running = false }) {
  const clipId = `tds-care-${useId().replace(/:/g, '')}`
  const label = slug === 'track-2' ? 'Illustration of a connected city with moving information and signal towers' : slug === 'track-3' ? 'Illustration of people linked through a care coordination network' : 'Illustration of a circular future with forests, clean energy and a river'
  const captions = slug === 'track-2' ? ['Shared spaces', 'Connected ideas'] : slug === 'track-3' ? ['People · Access · Coordination', 'Care demo'] : []
  return <div className={`tds-scene tds-scene--${slug}`} data-running={running ? 'true' : 'false'}><svg viewBox="0 0 1600 650" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">{slug === 'track-2' ? <CityScene /> : slug === 'track-3' ? <CareScene clipId={clipId} /> : <CircularScene />}</svg>{captions.length > 0 && <div className="tds-caption" aria-hidden="true">{captions.map(caption => <span key={caption}>{caption}</span>)}</div>}</div>
}
