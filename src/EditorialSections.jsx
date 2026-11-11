import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TracksSection, PrizesSection } from './TracksAndPrizes'
import GallerySection from './GallerySection'
import SponsorsSection from './SponsorsSection'
import RegisterButton from './components/RegisterButton'
import './editorial.css'
import './why-participate.css'

gsap.registerPlugin(ScrollTrigger)

const finaleStart = new Date('2026-12-28T00:00:00+05:30').getTime()

function Countdown() {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    const updateRemaining = () => setRemaining(Math.max(0, finaleStart - Date.now()))
    const initialTimer = window.setTimeout(updateRemaining, 0)
    const timer = window.setInterval(updateRemaining, 1000)
    return () => { window.clearTimeout(initialTimer); window.clearInterval(timer) }
  }, [])

  const totalSeconds = remaining === null ? null : Math.floor(remaining / 1000)
  const units = [
    ['Days', totalSeconds === null ? null : Math.floor(totalSeconds / 86400)],
    ['Hrs', totalSeconds === null ? null : Math.floor(totalSeconds / 3600) % 24],
    ['Mins', totalSeconds === null ? null : Math.floor(totalSeconds / 60) % 60],
    ['Secs', totalSeconds === null ? null : totalSeconds % 60],
  ]

  const countdownLabel = remaining === null
    ? 'Countdown to 28 December 2026'
    : `Countdown to 28 December 2026: ${units.map(([name, value]) => `${value} ${name}`).join(', ')}`

  return <div className="shift-countdown" role="timer" aria-label={countdownLabel}>
    {units.map(([name, value]) => <div className="shift-countdown-unit" key={name}>
      <strong className={`shift-countdown-value${value !== null && String(value).length > 2 ? ' shift-countdown-value--wide' : ''}`}>{value === null ? '--' : String(value).padStart(2, '0')}</strong>
      <span>{name}</span>
    </div>)}
  </div>
}

const rounds = [
  ['01', '14–15 NOVEMBER', 'Code Red ’26 launch & registration', 'THE CHALLENGE BRIEFS GO LIVE ON THE WEBSITE AND REGISTRATION OPENS.'],
  ['02', '27 NOVEMBER', 'Round 1 PPT submissions', 'REGISTRATION CLOSES. SUBMIT YOUR IDEA BY THE DEADLINE.'],
  ['03', '2 DECEMBER', 'Round 1 results', 'ROUND 1 RESULTS WILL BE PUBLISHED ON THE WEBSITE.'],
  ['04', '12–13 DECEMBER', 'Round 2 online evaluation', 'SHORTLISTED TEAMS ARE EVALUATED ONLINE VIA GOOGLE MEET.'],
  ['05', '14 DECEMBER', 'Top 50 teams announced', 'ROUND 2 RESULTS WILL BE PUBLISHED ON THE WEBSITE.'],
  ['06', '28–29 DECEMBER', '24-hour on-campus sprint', 'THE CODE RED ’26 GRAND FINALE TAKES PLACE AT BMSIT&M.'],
  ['07', '30 DECEMBER', 'VentureX', 'SELECTED TEAMS PITCH THEIR PRODUCTS, BUSINESS MODELS AND VISION TO INVESTORS.'],
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

export default function EditorialSections({ page = 'home', onNavigate }) {
  const show = (section) => page === 'home' || page === section;
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
      if (!timelineSection) return;
      
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
    {page === 'home' && <section id="home" className="shift-hero" aria-labelledby="hero-title">
      <div className="shift-hero-main anim-slide-down">
        <img className="shift-hero-corner-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true" />
        <img className="shift-hero-ribbon" src="/codered2026/codered2026/vector%20files/elements/Asset%2018.svg" alt="" aria-hidden="true" />
        <div className="shift-hero-composition">
          <div className="shift-hero-topline anim-slide-up"><p className="shift-hero-presented">E-CELL × BMSIT&amp;M PRESENTS</p><a className="shift-mobile-register" href="#register" onClick={(event) => { event.preventDefault(); onNavigate('notFound'); }}>REGISTER NOW ↗</a></div>
          <div className="shift-hero-text-wrapper">
            <div className="shift-hero-first-line" aria-hidden="true">
              <span style={{ display: 'block' }}>
                {"CODE".split('').map((char, i) => (
                  <span key={i} className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${i * 0.08}s` }}>{char}</span>
                ))}
              </span>
            </div>
            <h1 id="hero-title" className="shift-hero-display">
              <span className="sr-only">Code Red 2026 — National 24-hour hackathon in Bengaluru</span>
              <span aria-hidden="true" style={{ display: 'block' }}>
                {"RED".split('').map((char, i) => (
                  <span key={i} className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${0.32 + i * 0.08}s` }}>{char}</span>
                ))}
                <sup className="anim-slide-up" style={{ display: 'inline-block', transitionDelay: `${0.32 + 3 * 0.08}s` }}>'26</sup>
              </span>
            </h1>
          </div>
          <div className="shift-hero-bottom-action anim-slide-up" style={{ transitionDelay: '0.2s' }}>
            <div className="shift-hero-copy">
              <p className="shift-hero-slogan">Sprint into Creation</p>
              <p className="shift-hero-promise">Build in 24 hours. Turn your idea into a venture.</p>
            </div>
            <RegisterButton href="https://unstop.com/o/qjIA3CN?utm_medium=Share&utm_source=ecell-bmsitm&utm_campaign=Online_coding_challenge" />
          </div>
        </div>
      </div>
      <aside className="shift-hero-rail anim-slide-down" style={{ transitionDelay: '0.2s' }}>
        <div className="shift-rail-intro anim-slide-up" style={{ transitionDelay: '0.3s' }}>
          <div className="shift-venturex-panel">
            <strong className="shift-venturex-heading">
              Your finish line here is your startup’s day one.
            </strong>
            <p className="shift-venturex-desc">
              Top Code Red teams get direct access to pitch at VentureX and turn ideas into reality.
            </p>
            <a
              href="https://venture-x-bmsit.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="shift-venturex-cta"
            >
              EXPLORE VENTUREX <span className="shift-venturex-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="shift-rail-status shift-countdown-panel anim-slide-up" style={{ transitionDelay: '0.4s' }}>
          
          <strong>National level<br />24-hour product sprint.</strong>
          <span className="shift-rail-tagline" style={{ fontFamily: "Valentine, Georgia, serif", fontSize: "clamp(1.4rem, 1.7vw, 2rem)", fontWeight: 400, display: "block", marginTop: "1.5rem", lineHeight: "1", whiteSpace: "nowrap" }}>₹2,00,000 Prize Pool</span>
        <div className="shift-countdown-heading"><span>24-HOUR GRAND FINALE</span><h2>28–29 December 2026</h2></div><Countdown /></div>
      </aside>
    </section>}

    {show('about') && <section id="about" className="shift-about" aria-labelledby="about-title">
      <div className="shift-about-top"><div className="shift-about-copy"><h2 id="about-title" className="anim-blur-reveal">What is<br />CODERED?</h2><p className="anim-blur-reveal" style={{ transitionDelay: '0.2s' }}><span className="shift-about-lead">Code Red ’26</span> is E-Cell BMSIT&amp;M’s national product development challenge in Bengaluru. Its 24-hour HackSprint turns ideas into working products with industry mentorship, prototyping infrastructure, and opportunities with hiring partners. Selected teams may qualify for VentureX, a separate event to pitch products, business models, and vision to investors—helping turn products into ventures<span className="shift-period">.</span></p></div><div className="shift-about-side anim-slide-down"><img className="shift-about-element" src="/codered2026/codered2026/vector%20files/elements/Asset%2017.svg" alt="" aria-hidden="true" /></div></div>
      <div className="shift-info-grid">
        <article className="anim-slide-down" style={{ transitionDelay: '0.1s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.2s' }}>Tracks</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.3s' }}><li>Four company tracks</li><li>Problem statements available</li></ul></article>
        <article className="anim-slide-down" style={{ transitionDelay: '0.2s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.3s' }}>Prizes</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.4s' }}><li>₹2,00,000 total prize pool</li><li>Recognition for standout teams</li></ul></article>
        <article className="anim-slide-down" style={{ transitionDelay: '0.3s' }}><span className="shift-card-plus" aria-hidden="true">+</span><h3 className="anim-slide-up" style={{ transitionDelay: '0.4s' }}>Details</h3><ul className="anim-slide-up" style={{ transitionDelay: '0.5s' }}><li>24-hour overnight sprint</li><li>28–29 December 2026</li><li>Teams of 3–4</li><li>Top 50 teams at BMSIT&amp;M</li></ul></article>
      </div>
    </section>}

    {page === 'home' && <section id="why-participate" className="shift-participate" aria-labelledby="participate-title">
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
    </section>}

    {show('tracks') && <TracksSection onNavigate={onNavigate} />}
    {show('sponsors') && <SponsorsSection />}
    {show('prizes') && <PrizesSection />}

    {show('schedule') && <section id="timeline" className="shift-timeline" aria-labelledby="timeline-title">
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
    </section>}
    {show('schedule') && <GallerySection followedByFaq={page === 'home'} />}
  </div>
}
