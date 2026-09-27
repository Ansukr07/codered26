import { useEffect, useState } from 'react'
import './editorial.css'

const eventStart = new Date('2026-12-12T00:00:00+05:30').getTime()

function Countdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, eventStart - Date.now()))

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, eventStart - Date.now())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const totalSeconds = Math.floor(remaining / 1000)
  const units = [
    ['Days', Math.floor(totalSeconds / 86400)],
    ['Hrs', Math.floor(totalSeconds / 3600) % 24],
    ['Mins', Math.floor(totalSeconds / 60) % 60],
    ['Secs', totalSeconds % 60],
  ]

  return <div className="shift-countdown" role="timer" aria-label={`Countdown to 12 December 2026: ${units.map(([name, value]) => `${value} ${name}`).join(', ')}`}>
    {units.map(([name, value]) => <div key={name}><strong>{String(value).padStart(2, '0')}</strong><span>{name}</span></div>)}
  </div>
}

const rounds = [
  ['01', 'OPEN CALL', 'Round one: submit the idea', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. BRING YOUR TEAM, FRAME THE PROBLEM, AND SEND IN YOUR CONCEPT.'],
  ['02', 'THE BUILD', 'Round two: 24 hours live', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SELECTED TEAMS BUILD, TEST, AND REFINE ON THE CLOCK.'],
  ['03', 'FINAL DEMO', 'Present what you made', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SHOW THE WORK, TELL THE STORY, AND CLOSE THE DAY TOGETHER.'],
]

export default function EditorialSections() {
  return <>
    <section className="shift-hero" aria-labelledby="hero-title">
      <div className="shift-hero-main">
        <img className="shift-hero-corner-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true" />
        <img className="shift-hero-ribbon" src="/codered2026/codered2026/vector%20files/elements/Asset%2018.svg" alt="" aria-hidden="true" />
        <div className="shift-hero-composition">
          <div className="shift-hero-topline"><p className="shift-hero-presented">E-CELL × BMSIT&amp;M PRESENTS</p><a className="shift-mobile-register" href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">REGISTER NOW ↗</a></div>
          <div className="shift-hero-first-line"><span aria-hidden="true">CODE</span></div>
          <h1 id="hero-title" className="shift-hero-display"><span className="sr-only">CODE </span>RED<sup>’26</sup></h1>
          <div className="shift-hero-bottom-action"><a href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">REGISTER NOW <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
      <aside className="shift-hero-rail">
        <div className="shift-rail-intro"><strong>National Level<br/>24-Hour Hackathon.</strong><img className="shift-rail-tagline" src="/vivaldi-tagline.png" alt="Code Till You Drop." /></div>
        <div className="shift-rail-status shift-countdown-panel"><div className="shift-countdown-heading"><span>UNTIL THE BUILD BEGINS</span><h2>12 / 12 / 26</h2></div><Countdown /></div>
      </aside>
    </section>

    <section id="about" className="shift-about" aria-labelledby="about-title">
      <div className="shift-about-top"><div className="shift-about-copy"><h2 id="about-title">What is<br/>CODERED?</h2><p><span className="shift-about-lead">CODERED 3.0</span> is a National Level 24-hour Hackathon where builders, designers, and makers come together to prototype bold ideas<span className="shift-period">.</span></p></div><div className="shift-about-side"><img className="shift-about-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true"/></div></div>
      <div className="shift-info-grid">
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Tracks</h3><ul><li>Software</li><li>Hardware</li></ul></article>
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Prizes</h3><ul><li>Overall Winner: ₹60,000</li><li>Runner-up: ₹30,000</li><li>Category Winners</li></ul></article>
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Details</h3><ul><li>Duration: 24 hours</li><li>Team size: 3-4</li><li>Venue: BMS Institute Of Technology &amp; Management</li><li>Date: Dec 12-13, 2026</li></ul></article>
      </div>
    </section>

    <section id="timeline" className="shift-timeline" aria-labelledby="timeline-title">
      <div className="shift-timeline-intro"><h2 id="timeline-title">The whole sequence.</h2><span>→ &nbsp; 01 / 02 / 03</span></div>
      <div className="shift-rounds">{rounds.map(([n,phase,title,detail]) => <article key={n}>
        <div className="shift-round-number" aria-hidden="true">{n}</div>
        <div className="shift-round-content"><span className="shift-round-index">{n}</span><span className="shift-mono">{phase}</span><h3>{title}</h3><p>{detail}</p></div>
      </article>)}</div>
    </section>

  </>
}
