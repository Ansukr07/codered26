import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import './App.css'
import './reference-components.css'
import './font-fixes.css'
import './revolving-footer.css'
import Navbar from './Navbar.jsx'
import EditorialSections from './EditorialSections.jsx'
import './routes.css'
import RegisterButton from './components/RegisterButton'
import TeamPage from './TeamPage.jsx'
import { pages, updateSeo } from './seo.js'

const base = '/codered2026/codered2026'
const art = (name) => `${base}/vector files/elements/${name}.svg`

const revolvingImagesList = [
  'footer/footimg1.webp',
  'footer/footimg2.webp',
  'footer/footimg3.webp',
  'footer/footimg4.webp',
  'footer/footimg5.webp',
  'footer/footimg6.webp',
  'footer/footimg7.webp',
  'footer/footimg8.webp',
  'footer/footimg9.webp',
  'footer/footimg10.webp',
  'footer/footimg11.webp',
  'footer/footimg12.webp',
];
const getImage = (name) => `/images/${name}`;

// Define the structure of the spiral
const totalElements = 34;
const turns = 2.5;
const minRadius = 180;
const maxRadius = 850;
const a = minRadius;
const b = maxRadius - minRadius;
const I_max = a * 1 + (b / 2) * 1 * 1;

const pageNames = ['home', 'about', 'tracks', 'prizes', 'schedule', 'sponsors', 'faq', 'team'];

function pageFromLocation() {
  if (typeof window === 'undefined') return 'home';
  const legacyHashPage = window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : '';
  let page = legacyHashPage || window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home';
  if (legacyHashPage) {
    const cleanPath = page === 'home' ? '/' : `/${page}`;
    window.history.replaceState(null, '', `${cleanPath}${window.location.search}`);
  }
  return pageNames.includes(page) ? page : 'notFound';
}

const bgColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
// Stable decorative positions keep pre-rendered HTML and hydration identical.
let decorationSeed = 26;
const decorationRandom = () => {
  decorationSeed = (decorationSeed * 16807) % 2147483647;
  return (decorationSeed - 1) / 2147483646;
};

// Generate base identities for the elements
const baseElements = Array.from({ length: totalElements }).map((_, i) => {
  // Evenly distribute starting positions along the uniform arc length
  const initialP = i / (totalElements - 1);

  // Very light jitter to keep the spiral arms clear
  const angleJitter = (decorationRandom() * 0.1 - 0.05);
  const radiusJitter = (decorationRandom() * 10 - 5);

  const widthBase = decorationRandom() * 50 + 70; // 70-120px base size
  const phoneWidthBase = 50 + ((widthBase - 70) / 50) * 35; // Match the last committed 50-85px phone size

  // Square area cards
  const heightRatio = 1;

  const tiltJitter = decorationRandom() * 20 - 10; // ±10° random tilt

  const bg = bgColors[i % bgColors.length];
  const img = revolvingImagesList[i % revolvingImagesList.length];

  return { initialP, angleJitter, radiusJitter, widthBase, phoneWidthBase, heightRatio, tiltJitter, bg, img };
});

const questions = [
  ['Who is eligible to participate?', 'Students enrolled in accredited higher education institutions across India.'],
  ['What are the team size rules?', 'Teams must have 3 to 4 members. Cross-college and inter-departmental teams are welcome.'],
  ['Is there an entry fee?', 'Round 1 online submission is free. A later confirmation fee may apply to shortlisted teams; the amount has not been announced.'],
  ['How does Code Red ’26 work?', 'Submit a PPT online, pitch your idea online if shortlisted, and compete for a place among the top 50 teams at the 24-hour offline finale.'],
  ['When and where is the grand finale?', 'The 24-hour finale takes place on 3–4 December 2026 at BMS Institute of Technology & Management, Yelahanka, Bengaluru.'],
  ['Can we use a pre-existing project?', 'No. Code, hardware wiring, and system configurations must be completed from scratch during the official 24-hour sprint. Standard open-source libraries and public APIs are permitted.'],
  ['What should hardware teams bring?', 'Bring your core development kits, such as Raspberry Pi, ESP32, and sensors. The host provides workbenches, power extensions, and basic assembly stations.'],
  ['Is hospitality provided to finalists?', 'Yes. Registered finalists receive meals, midnight snacks, beverages, continuous facility access, and designated rest areas.'],
  ['What happens after the hackathon?', 'Promising projects may qualify for VentureX, a separate opportunity to pitch products and business models to investors.'],
]

function App({ initialPage }) {
  return <ReactLenis root options={{ lerp: 0.07, smoothWheel: true, syncTouch: true }}>
    <PageContent initialPage={initialPage} />
  </ReactLenis>
}

function PageContent({ initialPage }) {
  const lenis = useLenis()
  const [currentPage, setCurrentPage] = useState(() => initialPage || pageFromLocation());
  const [openFaq, setOpenFaq] = useState(null)
  const dialog = useRef(null)
  const appRef = useRef(null)
  const register = () => window.dispatchEvent(new CustomEvent('site-notice', { detail: 'Registration is coming soon. Please check back soon.' }))

  const navigatePage = (page) => {
    const nextPath = page === 'home' ? '/' : `/${page}`;
    const changePage = () => {
      if (window.location.pathname !== nextPath || window.location.hash) {
        window.history.pushState(null, '', nextPath);
      }
      setCurrentPage(page);
      setOpenFaq(null);
      lenis?.scrollTo(0, { immediate: true });
    };

    if (page === currentPage) {
      changePage();
    } else if (window.playPagePreloader) {
      window.playPagePreloader(changePage);
    } else {
      changePage();
    }
  };

  useLayoutEffect(() => {
    const hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (hashTarget) {
      lenis?.scrollTo(hashTarget, { immediate: true });
    } else {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [currentPage, lenis]);

  useEffect(() => {
    const syncPage = () => {
      const page = pageFromLocation();
      if (page === currentPage) {
        const hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1));
        if (hashTarget) lenis?.scrollTo(hashTarget);
        else lenis?.scrollTo(0, { immediate: true });
        return;
      }
      const changePage = () => {
        setCurrentPage(page);
        setOpenFaq(null);
      };
      if (window.playPagePreloader) window.playPagePreloader(changePage);
      else changePage();
    };
    window.addEventListener('popstate', syncPage);
    return () => {
      window.removeEventListener('popstate', syncPage);
    };
  }, [currentPage, lenis]);

  useEffect(() => {
    updateSeo(currentPage);
  }, [currentPage]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (appRef.current) {
      appRef.current.querySelectorAll('.anim-slide-up').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [currentPage]);

  return <>
    <div ref={appRef} className={`app-page app-page--${currentPage}`}>
            <Navbar activePage={currentPage} onNavigate={navigatePage} />
      <main id="main">
        {currentPage !== 'home' && currentPage !== 'team' && <h1 className="sr-only">{pages[currentPage].title}</h1>}
        {currentPage === 'notFound' && <section style={{ padding: '10rem 6%' }}><h2>Page not found</h2><p>The page you requested is unavailable.</p><a href="/">Explore Code Red 2026</a></section>}
        {currentPage === 'team' ? <TeamPage /> : <EditorialSections key={currentPage} page={currentPage} />}
        {['home', 'faq'].includes(currentPage) && <section id="faqs" className="section faq" style={{ padding: '94px 6% 150px' }}>
            <noscript><dl>{questions.map(([question, answer]) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}</dl></noscript>
            <div className="faq-grid">
              <div className="faq-intro">
                <h2 className="anim-slide-up" style={{ transitionDelay: '0.1s' }}>Frequently Asked Questions</h2>
              </div>
              <div className="faq-list">
                {questions.map(([q, answer], i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div className="anim-slide-up" style={{ transitionDelay: `${i * 0.15}s` }} key={q}>
                      <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                        <h3>
                          <button aria-expanded={isOpen} aria-controls={`answer-${i}`} onClick={() => setOpenFaq(isOpen ? null : i)}>
                            <span className="faq-index">Q<span style={{ fontFamily: 'Valentine, serif' }}>.</span>{String(i + 1).padStart(3, '0')} <i>/</i></span>
                            <span className="faq-question">{q}</span>
                            <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                          </button>
                        </h3>
                        <div className={`faq-answer${isOpen ? ' is-open' : ''}`} id={`answer-${i}`} aria-hidden={!isOpen} inert={!isOpen}>
                          <div className="faq-answer-inner">
                            <p>{answer.split(/([.,!?'-])/g).map((part, j) => part.match(/[.,!?'-]/) ? <span key={j} style={{ fontFamily: 'LilGrotesk, sans-serif' }}>{part}</span> : part)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </section>
        }
        <RevolvingFooter register={register} />
      </main>
      <footer>
        <div className="footer-top-row" style={{ display: "flex", width: "100%", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div className="footer-links" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>
          <span style={{ fontFamily: "LilGrotesk, sans-serif", fontSize: "16px", fontWeight: 600, color: "#fff", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>Quick Links</span>
          <a href="/about" className="footer-link">About Code Red 2026</a>
          <a href="https://www.immersivetourz.com/bmsitm/index.html" target="_blank" rel="noopener noreferrer" className="footer-link">Campus Map</a>
          <a href="#code-of-conduct" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new CustomEvent('site-notice', { detail: 'Coming soon!' })); }} className="footer-link">Code of Conduct</a>
          <a href="#privacy-policy" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new CustomEvent('site-notice', { detail: 'Coming soon!' })); }} className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-contact" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>
          <span style={{ fontFamily: "LilGrotesk, sans-serif", fontSize: "16px", fontWeight: 600, color: "#fff", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>Contact Us</span>
          <a href="tel:+919141194259" className="footer-link">Vaibhav B - 9141194259</a>
          <a href="tel:+917975959500" className="footer-link">Gagan - 7975959500</a>
          <a href="tel:+919606295562" className="footer-link">Deepthi Jain - 9606295562</a>
        </div>
        <a className="footer-address" href="https://maps.app.goo.gl/osHYqqHTrCKcRak88" target="_blank" rel="noopener noreferrer" aria-label="Open BMS Institute of Technology & Management in Google Maps" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--muted)', fontWeight: 500, textAlign: 'right' }}>
          <span style={{ fontFamily: "LilGrotesk, sans-serif", fontSize: "16px", fontWeight: 600, color: "#fff", display: "block", marginBottom: "6px", letterSpacing: "1px", lineHeight: 1.4 }}>BMS Institute of Technology<br/>& Management</span>
          <span style={{ lineHeight: 1.6, fontSize: "12px" }}>Doddaballapur Main Road, Avalahalli, Yelahanka,<br/>Bengaluru, Karnataka 560064</span>
        </a>
        </div>
        <div className="footer-bottom">
          <div className="social-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="https://www.instagram.com/ecell.bmsit?igsh=dW56aGtuY3pnNTBl" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://discord.gg/FTSdVUku6Y" target="_blank" rel="noopener noreferrer" aria-label="Discord" style={{ color: 'var(--muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/ecellbmsit/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="mailto:ecell@bmsit.in" aria-label="Email" style={{ color: 'var(--muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>
        <div className="cosmos-footer-giant" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {Array.from("CODERED'26").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      </footer>
      <dialog ref={dialog} aria-labelledby="registration-title" className="registration-dialog" onClick={e => { if (e.target === dialog.current) dialog.current.close() }}><button className="dialog-close" onClick={() => dialog.current.close()} aria-label="Close registration details">×</button><img src={art('Artboard 1 copy')} alt="" /><span className="eyebrow">CODE RED ’26</span><h2 id="registration-title">Build in 24 hours.<br /><span className="script red">Go beyond.</span></h2><p>Registration opens on 22 October and closes on 7 November. Submit your idea as a PPT for Round 1.</p><p className="dialog-note">The 24-hour grand finale is on 3–4 December 2026 at BMSIT&amp;M.</p><button className="button primary" onClick={() => dialog.current.close()}>Got it <span>↗</span></button></dialog>
    </div>
  </>
}

function RevolvingFooter({ register }) {
  const itemsRef = useRef([])
  const progressRef = useRef(0)
  const containerAngleRef = useRef(0)
  const rafRef = useRef(null)

  // Speed control refs
  const spinEnergyRef = useRef(1.0)
    const isHoveringRegisterRef = useRef(false)
  const currentSpeedRef = useRef(1)

  const sectionRef = useRef(null)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    let halfWidth = 0;
    let halfHeight = 0;
    let isPhone = false;
    const measure = () => {
      halfWidth = sectionRef.current.clientWidth / 2;
      halfHeight = sectionRef.current.clientHeight / 2;
      isPhone = window.matchMedia('(max-width: 700px)').matches;
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(sectionRef.current);

    // Pause animation entirely when scrolled off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafRef.current) {
          lastTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const lastTimeRef = { current: performance.now() };
    const animate = (now) => {
      if (!isVisibleRef.current) {
        rafRef.current = null;
        return; // Completely stop the loop when off-screen
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      // Decay spin energy slowly when not hovering
      if (!isHoveringRegisterRef.current) {
        spinEnergyRef.current = Math.max(1.0, spinEnergyRef.current - dt * 1.5);
      }

      let targetSpeed = spinEnergyRef.current;

      // Smooth transition
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * dt * 2.0;

      containerAngleRef.current += dt * 0.4 * currentSpeedRef.current;
      const currentGlobalAngleRad = containerAngleRef.current * (Math.PI / 180);

      progressRef.current -= (dt / (isPhone ? 65 : 90)) * currentSpeedRef.current;
      if (progressRef.current < 0) progressRef.current += 1;

      const activeCount = isPhone ? 24 : totalElements;

      itemsRef.current.forEach((node, i) => {
        if (!node) return;

        if (isPhone && i >= activeCount) {
          if (node.style.visibility !== 'hidden') {
            node.style.visibility = 'hidden';
            node.style.willChange = 'auto';
          }
          return;
        }

        const el = baseElements[i];
        const initialP = isPhone ? i / (activeCount - 1) : el.initialP;
        let p = (initialP + progressRef.current) % 1;
        if (p < 0) p += 1;

        const target_I = p * I_max;
        const mapped_p = (-a + Math.sqrt(a * a + 2 * b * target_I)) / b;

        const activeTurns = isPhone ? 1.5 : turns;
        const baseAngle = -(mapped_p * Math.PI * 2 * activeTurns);
        
        // On phone, give the spiral a wider sweep and bigger cards
        const maxPhoneRadius = 240;
        const minPhoneRadius = 80;
        const baseRadius = isPhone 
            ? minPhoneRadius + mapped_p * (maxPhoneRadius - minPhoneRadius) 
            : minRadius + mapped_p * (maxRadius - minRadius);

        const jitterAngle = baseAngle + el.angleJitter + currentGlobalAngleRad;
        const jitterRadius = baseRadius + el.radiusJitter;

        const x = Math.cos(jitterAngle) * jitterRadius;
        const y = Math.sin(jitterAngle) * jitterRadius;

        const sizeScale = isPhone
          ? (el.phoneWidthBase / el.widthBase) * (0.30 + 0.30 * mapped_p)
          : 0.62 + 0.62 * mapped_p;
        const radialAngleDeg = ((jitterAngle % (2 * Math.PI)) * 180 / Math.PI);
        const tilt = radialAngleDeg + 90 + el.tiltJitter;

        let opacity = 1;
        if (mapped_p < 0.05) opacity = mapped_p / 0.05;
        else if (mapped_p > 0.95) opacity = (1 - mapped_p) / 0.05;

        // Cards outside the clipped section need no transform or paint work.
        const margin = isPhone ? el.phoneWidthBase * 1.6 : el.widthBase * 1.4;
        const visible = Math.abs(x) < halfWidth + margin && Math.abs(y) < halfHeight + margin;
        if (!visible) {
          if (node.style.visibility !== 'hidden') {
            node.style.visibility = 'hidden';
            node.style.willChange = 'auto';
          }
          return;
        }
        if (node.style.visibility === 'hidden') {
          node.style.visibility = 'visible';
          node.style.willChange = 'transform';
        }
        if (node.style.opacity !== String(opacity)) node.style.opacity = opacity;
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${sizeScale}) rotate(${tilt}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      resizeObserver.disconnect();
    }
  }, [])

  return (
    <>
      <div className="revolving-transition" aria-hidden="true" />
      <section className="revolving-cta" ref={sectionRef}>
        <div className="revolving-orbit-container">
          <div className="revolving-orbit">
            {baseElements.map((el, i) => {
              const baseWidth = el.widthBase;
              const baseHeight = el.widthBase * el.heightRatio;

              return (
                <div
                  key={i}
                  ref={node => itemsRef.current[i] = node}
                  className="revolving-item"
                  style={{
                    width: baseWidth + 'px',
                    height: baseHeight + 'px',
                    backgroundColor: el.bg,
                    left: 0,
                    top: 0
                  }}
                >
                  <img src={getImage(el.img)} alt="" width="256" height="256" loading="lazy" fetchPriority="low" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                </div>
              )
            })}
          </div>
        </div>
        <div className="revolving-content">
          <RegisterButton
            size="large"
            onClick={register}
            onMouseEnter={() => { isHoveringRegisterRef.current = true; spinEnergyRef.current = Math.min(10.0, spinEnergyRef.current + 2.5); }}
            onMouseLeave={() => { isHoveringRegisterRef.current = false; }}
          />
        </div>
      </section>
    </>
  )
}

export default App










