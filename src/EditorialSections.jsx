import { useEffect, useState, useRef } from 'react'
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
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (containerRef.current) {
      containerRef.current.querySelectorAll('.anim-slide-up, .anim-slide-down, .anim-blur-reveal').forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>
    <section className="shift-hero" aria-labelledby="hero-title">
      <div className="shift-hero-main anim-slide-down">
        <img className="shift-hero-corner-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true" />
        <img className="shift-hero-ribbon" src="/codered2026/codered2026/vector%20files/elements/Asset%2018.svg" alt="" aria-hidden="true" />
        <div className="shift-hero-composition">
          <div className="shift-hero-topline anim-slide-up"><p className="shift-hero-presented">E-CELL × BMSIT&amp;M PRESENTS</p><a className="shift-mobile-register" href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">REGISTER NOW ↗</a></div>
          <div className="shift-hero-text-wrapper">
            <div className="shift-hero-first-line" aria-hidden="true">
              <span style={{ display: 'block' }}>
                {"CODE".split('').map((char, i) => (
                  <span key={i} className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${i * 0.08}s` }}>{char}</span>
                ))}
              </span>
            </div>
            <h1 id="hero-title" className="shift-hero-display">
              <span className="sr-only">CODE RED'26</span>
              <span aria-hidden="true" style={{ display: 'block' }}>
                {"RED".split('').map((char, i) => (
                  <span key={i} className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${0.32 + i * 0.08}s` }}>{char}</span>
                ))}
                <sup className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${0.32 + 3 * 0.08}s` }}>'26</sup>
              </span>
            </h1>
          </div>
          <div className="shift-hero-bottom-action anim-slide-up" style={{transitionDelay: '0.2s'}}><a href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">REGISTER NOW <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>

      <aside className="shift-hero-rail anim-slide-down" style={{transitionDelay: '0.2s'}}>
        <div className="shift-rail-intro anim-slide-up" style={{transitionDelay: '0.3s'}}><strong>National Level<br/>24-Hour Hackathon.</strong><img className="shift-rail-tagline" src="/vivaldi-tagline.png" alt="Code Till You Drop." /></div>
        <div className="shift-rail-status shift-countdown-panel anim-slide-up" style={{transitionDelay: '0.4s'}}><div className="shift-countdown-heading"><span>UNTIL THE BUILD BEGINS</span><h2>12 / 12 / 26</h2></div><Countdown /></div>
      </aside>
    </section>

    <section id="about" className="shift-about" aria-labelledby="about-title">
      <div className="shift-about-top"><div className="shift-about-copy"><h2 id="about-title" className="anim-blur-reveal">What is<br/>CODERED?</h2><p className="anim-blur-reveal" style={{transitionDelay: '0.2s'}}><span className="shift-about-lead">CODERED 3.0</span> is a National Level 24-hour Hackathon where builders, designers, and makers come together to prototype bold ideas<span className="shift-period">.</span></p></div><div className="shift-about-side anim-slide-down"><img className="shift-about-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true"/></div></div>
      <div className="shift-info-grid">
        <article className="anim-slide-down" style={{transitionDelay: '0.1s'}}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{transitionDelay: '0.2s'}}>Tracks</h3><ul className="anim-slide-up" style={{transitionDelay: '0.3s'}}><li>Software</li><li>Hardware</li></ul></article>
        <article className="anim-slide-down" style={{transitionDelay: '0.2s'}}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{transitionDelay: '0.3s'}}>Prizes</h3><ul className="anim-slide-up" style={{transitionDelay: '0.4s'}}><li>Overall Winner: â‚¹60,000</li><li>Runner-up: â‚¹30,000</li><li>Category Winners</li></ul></article>
        <article className="anim-slide-down" style={{transitionDelay: '0.3s'}}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{transitionDelay: '0.4s'}}>Details</h3><ul className="anim-slide-up" style={{transitionDelay: '0.5s'}}><li>Duration: 24 hours</li><li>Team size: 3-4</li><li>Venue: BMS Institute Of Technology &amp; Management</li><li>Date: Dec 12-13, 2026</li></ul></article>
      </div>
    </section>

    <section id="timeline" className="shift-timeline" aria-labelledby="timeline-title">
      <div className="shift-timeline-intro anim-slide-up"><h2 id="timeline-title">The whole sequence.</h2><span><span className="shift-mobile-swipe">SWIPE &rarr;&nbsp;&nbsp;</span>01 / 02 / 03</span></div>
      <div className="shift-rounds">{rounds.map(([n,phase,title,detail], i) => <article key={n} className="anim-slide-down" style={{transitionDelay: `${i * 0.15}s`}}>
        <div className="shift-round-number" aria-hidden="true">{n}</div>
        <div className="shift-round-content"><span className="shift-round-index anim-slide-up" style={{transitionDelay: `${i * 0.15 + 0.1}s`}}>{n}</span><span className="shift-mono anim-slide-up" style={{transitionDelay: `${i * 0.15 + 0.2}s`}}>{phase}</span><h3 className="anim-slide-up" style={{transitionDelay: `${i * 0.15 + 0.3}s`}}>{title}</h3><p className="anim-slide-up" style={{transitionDelay: `${i * 0.15 + 0.4}s`}}>{detail}</p></div>
      </article>)}</div>
    </section>

  </div>
}

