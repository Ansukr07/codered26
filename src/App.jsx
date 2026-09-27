import { useRef, useState, useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import './App.css'
import './reference-components.css'
import './font-fixes.css'
import './revolving-footer.css'
import Navbar from './Navbar.jsx'
import EditorialSections from './EditorialSections.jsx'
import CurrencySkyBackground from './CurrencySkyBackground.jsx'

const base = '/codered2026/codered2026'
const art = (name) => `${base}/vector files/elements/${name}.svg`

const revolvingImagesList = Array.from({ length: 12 }, (_, i) => `img${i}`);
const getWebp = (name) => `/images/${name}.webp`;

// Define the structure of the spiral
const totalElements = 72;
const turns = 4;
const minRadius = 180;
const maxRadius = 850;
const a = minRadius;
const b = maxRadius - minRadius;
const I_max = a * 1 + (b / 2) * 1 * 1;

const bgColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

// Generate base identities for the elements
const baseElements = Array.from({ length: totalElements }).map((_, i) => {
  // Evenly distribute starting positions along the uniform arc length
  const initialP = i / (totalElements - 1);

  // Very light jitter to keep the spiral arms clear
  const angleJitter = (Math.random() * 0.1 - 0.05);
  const radiusJitter = (Math.random() * 10 - 5);

  const widthBase = Math.random() * 35 + 50; // 50-85px base size

  // Mix of landscape and portrait
  const isPortrait = Math.random() > 0.6;
  const heightRatio = isPortrait ? 1.3 : 0.75;

  const tiltJitter = Math.random() * 20 - 10; // ±10° random tilt

  const bg = bgColors[i % bgColors.length];
  const img = revolvingImagesList[i % revolvingImagesList.length];

  return { initialP, angleJitter, radiusJitter, widthBase, heightRatio, tiltJitter, bg, img };
});

const questions = [
  ["What is CODERED'26?", 'A hackathon for curious minds who want to turn ideas into working projects. Come to experiment, collaborate, and build something you’re proud of.'],
  ['Do I need to be an experienced coder?', 'Bring your curiosity. Developers, designers, and problem-solvers all have a place here. Detailed eligibility requirements will be shared when registration opens.'],
  ['Can I participate with a team?', 'Building together is part of the experience. Team sizes and the team formation process will be announced with the official participant guide.'],
  ['When and where is it happening?', 'The 2026 edition is on its way. Exact dates, venue, and the final schedule will be announced here.'],
  ['How do I register?', 'Registration is not open yet. Check the registration panel for the latest status and return here when applications go live.'],
  ['Is there a fee to participate?', "CODERED'26 is completely free for all accepted participants. We believe in removing barriers to innovation."],
  ['What kind of projects can we build?', 'Software, hardware, design—anything goes. We encourage you to build outside your comfort zone and try something completely new.'],
  ['What if I don\'t have a team yet?', 'Don\'t worry! We will host a dedicated team-formation event at the start of the hackathon to help you find teammates with complementary skills.'],
]

function App() {
  const [openFaq, setOpenFaq] = useState(null)
  const dialog = useRef(null)
  const appRef = useRef(null)
  const register = () => dialog.current.showModal()
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
  }, []);

  return <ReactLenis root options={{ lerp: 0.07, smoothWheel: true, syncTouch: true }}>
    <div ref={appRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <EditorialSections />
        <section id="faqs" className="section faq" style={{ padding: 0 }}>
          <CurrencySkyBackground style={{ padding: '94px 6% 150px' }}>
            <div className="faq-grid"><div className="faq-intro"><h2 className="anim-slide-up" style={{ transitionDelay: '0.1s' }}>FAQs</h2></div><div className="faq-list">{questions.map(([q, answer], i) => <div className="anim-slide-up" style={{ transitionDelay: `${i * 0.15}s` }} key={q}><div className={`faq-item ${openFaq === i ? 'is-open' : ''}`}><h3><button aria-expanded={openFaq === i} aria-controls={`answer-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span className="faq-index">Q.{String(i + 1).padStart(3, '0')} <i>/</i></span><span className="faq-question">{q}</span><span className="faq-toggle">{openFaq === i ? '−' : '+'}</span></button></h3><div className="faq-answer" id={`answer-${i}`} hidden={openFaq !== i}><p>{answer}</p></div></div></div>)}</div></div>
          </CurrencySkyBackground>
        </section>
        <RevolvingFooter register={register} />
      </main>
      <footer>
        <div className="cosmos-footer-giant anim-slide-up">
          CODERED'26
        </div>
        <a href="#" className="footer-brand">CODERED'26</a>
        <span>A little chaos. A lot of possibility.</span>
        <a href="#">BACK TO TOP ↑</a>
        <div className="footer-bottom">
          <span>© 2026 CODERED. Built for what’s next.</span>
          <span>CODE. CREATE. REPEAT.</span>
        </div>
      </footer>
      <dialog ref={dialog} aria-labelledby="registration-title" className="registration-dialog" onClick={e => { if (e.target === dialog.current) dialog.current.close() }}><button className="dialog-close" onClick={() => dialog.current.close()} aria-label="Close registration details">×</button><img src={art('Artboard 1 copy')} alt="" /><span className="eyebrow">THE NEXT WAVE IS COMING</span><h2 id="registration-title">You’re early.<br /><span className="script red">We like that.</span></h2><p>Registration for CODERED’ 26 hasn’t opened yet. The application link, dates, and venue will be announced here.</p><p className="dialog-note">No sign-up is being collected yet. Bookmark this page and check back for the launch.</p><button className="button primary" onClick={() => dialog.current.close()}>Got it <span>↗</span></button></dialog>
    </div>
  </ReactLenis>
}

function RevolvingFooter({ register }) {
  const orbitRef = useRef(null)
  const itemsRef = useRef([])
  const progressRef = useRef(0)
  const containerAngleRef = useRef(0)
  const rafRef = useRef(null)

  // Speed control refs
  const speedBoostTimeRef = useRef(0)
  const currentSpeedRef = useRef(1)

  const sectionRef = useRef(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
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
    let smoothedDt = 0.016;

    const animate = (now) => {
      if (!isVisibleRef.current) {
        rafRef.current = null;
        return; // Completely stop the loop when off-screen
      }

      let rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (rawDt > 0.1) rawDt = 0.016;
      smoothedDt = smoothedDt * 0.9 + rawDt * 0.1;
      const dt = smoothedDt;

      let targetSpeed = 1;
      if (speedBoostTimeRef.current > 0) {
        speedBoostTimeRef.current -= dt;
        targetSpeed = 2.5;
      }

      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * dt * 2.5;

      containerAngleRef.current += dt * 0.5 * currentSpeedRef.current;
      const currentGlobalAngleRad = containerAngleRef.current * (Math.PI / 180);

      progressRef.current -= (dt / 90) * currentSpeedRef.current;
      if (progressRef.current < 0) progressRef.current += 1;

      itemsRef.current.forEach((node, i) => {
        if (!node) return;
        const el = baseElements[i];

        let p = (el.initialP + progressRef.current) % 1;
        if (p < 0) p += 1;

        const target_I = p * I_max;
        const mapped_p = (-a + Math.sqrt(a * a + 2 * b * target_I)) / b;

        const baseAngle = -(mapped_p * Math.PI * 2 * turns);
        const baseRadius = minRadius + mapped_p * (maxRadius - minRadius);

        const jitterAngle = baseAngle + el.angleJitter + currentGlobalAngleRad;
        const jitterRadius = baseRadius + el.radiusJitter;

        const x = Math.cos(jitterAngle) * jitterRadius;
        const y = Math.sin(jitterAngle) * jitterRadius;

        const sizeScale = 0.5 + 0.5 * mapped_p;
        const radialAngleDeg = ((jitterAngle % (2 * Math.PI)) * 180 / Math.PI);
        const tilt = radialAngleDeg + 90 + el.tiltJitter;

        let opacity = 1;
        if (mapped_p < 0.05) opacity = mapped_p / 0.05;
        else if (mapped_p > 0.95) opacity = (1 - mapped_p) / 0.05;

        node.style.opacity = opacity;
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${sizeScale}) rotate(${tilt}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    }
  }, [])

  return (
    <section className="revolving-cta" ref={sectionRef}>
      <div className="revolving-orbit-container">
        <div className="revolving-orbit" ref={orbitRef}>
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
                  willChange: 'transform, opacity',
                  left: 0,
                  top: 0
                }}
              >
                <img src={getWebp(el.img)} alt="" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              </div>
            )
          })}
        </div>
      </div>
      <div className="revolving-content">
        <button
          className="register-btn"
          onClick={register}
          onMouseEnter={() => { speedBoostTimeRef.current = 1.0 }}
        >
          Register Now
        </button>
      </div>
    </section>
  )
}

export default App
