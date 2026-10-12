import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TracksSection, PrizesSection } from './TracksAndPrizes'
import SponsorsSection from './SponsorsSection'
import RegisterButton from './components/RegisterButton'
import './editorial.css'
import './why-participate.css'

gsap.registerPlugin(ScrollTrigger)

const finaleStart = new Date('2026-12-03T00:00:00+05:30').getTime()

function Countdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, finaleStart - Date.now()))

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, finaleStart - Date.now())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const totalSeconds = Math.floor(remaining / 1000)
  const units = [
    ['Days', Math.floor(totalSeconds / 86400)],
    ['Hrs', Math.floor(totalSeconds / 3600) % 24],
    ['Mins', Math.floor(totalSeconds / 60) % 60],
    ['Secs', totalSeconds % 60],
  ]

  return <div className="shift-countdown" role="timer" aria-label={`Countdown to 3 December 2026: ${units.map(([name, value]) => `${value} ${name}`).join(', ')}`}>
    {units.map(([name, value]) => <div className="shift-countdown-unit" key={name}>
      <strong className={`shift-countdown-value${String(value).length > 2 ? ' shift-countdown-value--wide' : ''}`}>{String(value).padStart(2, '0')}</strong>
      <span>{name}</span>
    </div>)}
  </div>
}

const rounds = [
  ['01', '18 OCTOBER–31 OCTOBER', 'Registrations', 'SUBMIT YOUR PROPOSED SOLUTION IN THE PRESCRIBED PPT FORMAT.'],
  ['02', '9 NOVEMBER', 'Round 1 evaluation', 'SUBMITTED IDEAS ARE REVIEWED AND TEAMS ARE SHORTLISTED.'],
  ['03', '14–15 NOVEMBER', 'Round 2 online evaluation', 'SHORTLISTED TEAMS PITCH THEIR IDEAS ONLINE TO THE JUDGING PANEL.'],
  ['04', '18 NOVEMBER', 'Final results announcement', 'THE TOP 50 TEAMS ARE SELECTED FOR THE 24-HOUR GRAND FINALE AT BMSIT&M.'],
]

const participationReasons = [
  ['Compete & Win', 'Battle for a ₹2,00,000 prize pool and recognition.'],
  ['Build Real Products', 'Turn bold ideas into functional prototypes in 24 hours.'],
  ['Learn from Experts', 'Get guidance and feedback from experienced industry mentors.'],
  ['Challenge Yourself', 'Push your skills through intense real-world problem-solving.'],
  ['Connect & Collaborate', 'Meet student innovators, developers, and builders across India.'],
  ['Go Beyond Code Red', 'Top teams may qualify for VentureX, a separate investor-pitching event.'],
]

const DotArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none" className="tp-icon-svg">
    <circle cx="2.481" cy="14.98" r="1.756" fill="currentColor" />
    <circle cx="6.733" cy="15.004" r="1.756" fill="currentColor" />
    <circle cx="10.938" cy="14.985" r="1.756" fill="currentColor" />
    <circle cx="15.19" cy="15.017" r="1.756" fill="currentColor" />
    <circle cx="19.434" cy="15.033" r="1.756" fill="currentColor" />
    <circle cx="23.649" cy="15" r="1.756" fill="currentColor" />
    <circle cx="27.93" cy="15.009" r="1.756" fill="currentColor" />
    <circle cx="23.67" cy="19.085" r="1.756" fill="currentColor" />
    <circle cx="19.417" cy="23.29" r="1.756" fill="currentColor" />
    <circle cx="15.192" cy="27.6" r="1.756" fill="currentColor" />
    <circle r="1.756" transform="matrix(1 0 0 -1 23.656 10.906)" fill="currentColor" />
    <circle r="1.756" transform="matrix(1 0 0 -1 19.402 6.708)" fill="currentColor" />
    <circle r="1.756" transform="matrix(1 0 0 -1 15.187 2.39)" fill="currentColor" />
  </svg>
);

export default function EditorialSections() {
  const containerRef = useRef(null);
  const roundsRef = useRef(null);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  const handleContainerScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const distance = Math.abs(child.offsetLeft - container.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });
    if (closestIndex !== activeRoundIndex) {
      setActiveRoundIndex(closestIndex);
    }
  };

  const handleScrollDots = (dir) => {
    if (roundsRef.current) {
      const container = roundsRef.current;
      const targetIndex = Math.max(0, Math.min(rounds.length - 1, activeRoundIndex + dir));
      const child = container.children[targetIndex];
      if (child) {
        container.scrollTo({ left: child.offsetLeft - container.offsetLeft, behavior: 'smooth' });
      }
    }
  };


  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 701px)", () => {
      if (!containerRef.current || !roundsRef.current) return;
      const timelineSection = containerRef.current.querySelector('#timeline');
      const roundsContainer = roundsRef.current;
      
      gsap.set(timelineSection, { overflow: 'hidden' });
      gsap.set(roundsContainer, { width: 'max-content', overflow: 'visible', flexWrap: 'nowrap' });
      
      const getScrollAmount = () => {
        const cards = roundsContainer.querySelectorAll('article');
        if (cards.length < 2) return 0;
        return -(roundsContainer.scrollWidth - timelineSection.offsetWidth);
      };

      gsap.to(roundsContainer, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: timelineSection,
          start: "top top",
          end: () => `+=${(roundsContainer.scrollWidth - timelineSection.offsetWidth) * 1.5}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        }
      });
      
      return () => {
        gsap.set(timelineSection, { clearProps: "overflow" });
        gsap.set(roundsContainer, { clearProps: "width,overflow,flexWrap,x" });
      };
    });
  }, { scope: containerRef });

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
    <section id="home" className="shift-hero" aria-labelledby="hero-title">
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
          <div className="shift-hero-bottom-action anim-slide-up" style={{ transitionDelay: '0.2s' }}><RegisterButton href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" /></div>
        </div>
      </div>
      <aside className="shift-hero-rail anim-slide-down" style={{ transitionDelay: '0.2s' }}>
        <div className="shift-rail-intro anim-slide-up" style={{ transitionDelay: '0.3s' }}>
          <strong>National level<br />24-hour product sprint.</strong>
          <span className="shift-rail-tagline" style={{ fontFamily: "Valentine, Georgia, serif", fontSize: "2rem", display: "block", marginTop: "1rem", lineHeight: "1" }}>From Idea to Impact.</span>
        </div>
        <div className="shift-rail-status shift-countdown-panel anim-slide-up" style={{ transitionDelay: '0.4s' }}><div className="shift-countdown-heading"><span>24-HOUR GRAND FINALE</span><h2>3–4 December 2026</h2></div><Countdown /><p>Top 50 teams build at BMSIT&amp;M.</p></div>
      </aside>
    </section>

    <section id="about" className="shift-about" aria-labelledby="about-title">
      <div className="shift-about-top"><div className="shift-about-copy"><h2 id="about-title" className="anim-blur-reveal">What is<br />CODERED?</h2><p className="anim-blur-reveal" style={{ transitionDelay: '0.2s' }}><span className="shift-about-lead">Code Red ’26</span> is E-Cell BMSIT&amp;M’s national product development sprint. Teams turn ideas into functional products in 24 hours, with promising projects getting the chance to pitch at VentureX<span className="shift-period">.</span></p></div><div className="shift-about-side anim-slide-down"><img className="shift-about-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true" /></div></div>
      <div className="shift-info-grid">
        <article className="anim-slide-down" style={{ transitionDelay: '0.1s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.2s' }}>Tracks</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.3s' }}><li>Four company based tracks</li><li>Details to be announced</li></ul></article>
        <article className="anim-slide-down" style={{ transitionDelay: '0.2s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.3s' }}>Prizes</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.4s' }}><li>₹2,00,000 total prize pool</li><li>Recognition for standout teams</li></ul></article>
        <article className="anim-slide-down" style={{ transitionDelay: '0.3s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.4s' }}>Details</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.5s' }}><li>24-hour offline sprint</li><li>3–4 December 2026</li><li>Teams of 3–4</li><li>Top 50 teams at BMSIT&amp;M</li></ul></article>
      </div>
    </section>

    <section id="why-participate" className="shift-participate" aria-labelledby="participate-title">
      <div className="shift-participate-inner">
        <h2 id="participate-title" className="anim-slide-up">Why participate?</h2>
        <figure className="shift-participate-photo">
          <img src="/images/group1.webp" width="1020" height="572" alt="Participants and organizers at a previous Code Red event, standing behind large Code Red letters" loading="lazy" />
          <figcaption>Previous Code Red edition</figcaption>
        </figure>
        <div className="shift-participate-grid">
          {participationReasons.map(([title, description]) => (
            <article className="shift-participate-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <TracksSection />
    <SponsorsSection />
    <PrizesSection />

    <section id="timeline" className="shift-timeline" aria-labelledby="timeline-title">
      <div className="shift-timeline-intro anim-slide-up"><h2 id="timeline-title">The road to the finale.</h2></div>
      <div className="shift-rounds" ref={roundsRef} onScroll={handleContainerScroll}>{rounds.map(([n, phase, title, detail, opening], i) => <article key={n} className="anim-slide-down" style={{ transitionDelay: `${i * 0.15}s` }}>
        <div className="shift-round-number" aria-hidden="true">{n}</div>
        <div className="shift-round-content"><span className="shift-round-index anim-slide-up" style={{ transitionDelay: `${i * 0.15 + 0.1}s` }}>{n}</span><span className="shift-mono anim-slide-up" style={{ transitionDelay: `${i * 0.15 + 0.2}s` }}>{phase}</span><h3 className={`anim-slide-up${title === 'Final results announcement' ? ' shift-round-title--single-line' : ''}`} style={{ transitionDelay: `${i * 0.15 + 0.3}s` }}>{title}</h3>{opening && <p className="shift-round-opening">{opening}</p>}<p className="shift-round-description">{detail}</p></div>
      </article>)}</div>
      
      {/* Mobile Carousel Controls */}
      <div className="mobile-carousel-controls">
        <div className="carousel-arrows">
          <button className="carousel-btn" onClick={() => handleScrollDots(-1)} disabled={activeRoundIndex === 0}>
            <span style={{ transform: 'rotate(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px' }}><DotArrowSVG /></span>
          </button>
          <button className="carousel-btn" onClick={() => handleScrollDots(1)} disabled={activeRoundIndex === rounds.length - 1}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px' }}><DotArrowSVG /></span>
          </button>
        </div>
        <div className="carousel-dots">
          {rounds.map((_, i) => (
            <span key={i} className={`carousel-dot ${i === activeRoundIndex ? 'active' : ''}`} onClick={() => {
              if (roundsRef.current && roundsRef.current.children[i]) {
                const child = roundsRef.current.children[i];
                roundsRef.current.scrollTo({ left: child.offsetLeft - roundsRef.current.offsetLeft, behavior: 'smooth' });
              }
            }} />
          ))}
        </div>
      </div>
    </section>
  </div>
}
