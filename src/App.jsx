import { useRef, useState, useEffect, useCallback } from 'react'
import './App.css'
import './reference-components.css'
import './font-fixes.css'
import './revolving-footer.css'

const base = '/codered2026/codered2026'
const art = (name) => `${base}/vector files/elements/${name}.svg`

const revolvingImagesList = [
  'Artboard 1', 'Artboard 1 copy', 'Artboard 1 copy 2', 'Artboard 1 copy 3',
  'Artboard 1 copy 4', 'Artboard 1 copy 5', 'Artboard 1 copy 6', 'Artboard 1 copy 7',
  'Artboard 1 copy 8', 'Artboard 9', 'Artboard 10', 'Artboard 11', 'Artboard 12'
];

// Define the structure of the spiral
const totalElements = 90; 
const turns = 4;
const minRadius = 180;
const maxRadius = 850;
const a = minRadius;
const b = maxRadius - minRadius;
const I_max = a * 1 + (b / 2) * 1 * 1;

const bgColors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];

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
  ['What is CODERED’ 26?', 'A hackathon for curious minds who want to turn ideas into working projects. Come to experiment, collaborate, and build something you’re proud of.'],
  ['Do I need to be an experienced coder?', 'Bring your curiosity. Developers, designers, and problem-solvers all have a place here. Detailed eligibility requirements will be shared when registration opens.'],
  ['Can I participate with a team?', 'Building together is part of the experience. Team sizes and the team formation process will be announced with the official participant guide.'],
  ['When and where is it happening?', 'The 2026 edition is on its way. Exact dates, venue, and the final schedule will be announced here.'],
  ['How do I register?', 'Registration is not open yet. Check the registration panel for the latest status and return here when applications go live.'],
]

function App() {
 const [menuOpen,setMenuOpen]=useState(false)
 const [openFaq,setOpenFaq]=useState(0)
 const dialog=useRef(null)
 const register=()=>dialog.current.showModal()
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="header"><div className="nav-shell"><a className="brand" href="#" aria-label="CODERED 26 home"><span className="brand-symbol">c<span>r</span></span><span className="brand-name">CODERED<span className="brand-year">’26</span></span></a><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'−':'+'}<span className="sr-only"> menu</span></button><nav id="navigation" className={menuOpen?'nav open':'nav'} aria-label="Main navigation">{[['FEATURES','about'],['THE REPO','experience'],['SHOWCASE','timeline'],['PRICING','timeline'],['FAQ','faqs'],['BLOG','faqs']].map(([label,id])=><a key={label} className={label==='FAQ'?'nav-active':''} href={`#${id}`} onClick={()=>setMenuOpen(false)}>{label}</a>)}</nav><button className="nav-register" onClick={register}>REGISTER</button><div className="nav-marquee" aria-hidden="true"><span>NOW AVAILABLE WITH ASTRO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOW AVAILABLE WITH ASTRO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOW AVAILABLE WITH ASTRO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div></div></header>
  <main id="main">
   <section className="hero" aria-labelledby="hero-title"><div className="hero-top"><span><i className="status-dot"/> THE NEXT WAVE OF BUILDERS</span><span>EDITION 2026 <b>✳</b></span></div><div className="hero-title-wrap"><h1 id="hero-title">CODERED<span className="year">’ 26</span></h1><span className="script hero-script">Make a little chaos.</span></div><img className="hero-art flower" src={art('Artboard 1')} alt=""/><img className="hero-art ribbon" src={art('Artboard 1 copy')} alt=""/><img className="hero-art bubbles" src={art('Artboard 1 copy 2')} alt=""/><div className="hero-content"><span className="eyebrow">IDEAS DON’T BUILD THEMSELVES.</span><h2>Less what if.<br/>More <span className="serif-italic">what’s next.</span></h2><p>A collision of code, creativity, and caffeine.<br/>Bring your wildest idea. Let’s make it real.</p><div className="hero-actions"><button className="button primary" onClick={register}>I’m in. Let’s build <span>↗</span></button><a className="text-link" href="#about">Explore the hackathon <span>↓</span></a></div></div><div className="hero-bottom"><span>FOR THE CURIOUS. THE RESTLESS. THE BUILDERS.</span><a href="#about">SCROLL TO DISCOVER <span>↓</span></a></div></section>
   <div className="ticker" aria-label="Think bold. Build together. Break the ordinary."><div>{Array.from({length:4},(_,i)=><span key={i} aria-hidden="true">THINK BOLD <b>✳</b> BUILD TOGETHER <b>✳</b> BREAK THE ORDINARY <b>✳</b> </span>)}</div></div>
   <section id="about" className="section about"><div className="section-label"><span>01 / THE IDEA</span><span>NOT YOUR AVERAGE HACKATHON ↙</span></div><div className="about-grid"><h2>Good ideas start<br/>with <span className="script red">a spark.</span><br/>Great ones start<br/>with <span className="outline">you.</span></h2><div className="about-copy"><img src={art('Artboard 1 copy 3')} alt=""/><p className="large-copy">A space for big swings.<br/>And unexpected possibilities.</p><p>CODERED’ 26 brings curious minds together to push past the obvious. Mix perspectives, challenge an idea, and turn a blank canvas into something that matters.</p><p>You bring the imagination.<br/>We’ll meet you at the starting line.</p><a href="#experience" className="text-link">Find your reason to build <span>↗</span></a></div></div></section>
   <section id="experience" className="section experience"><div className="section-label"><span>02 / THE EXPERIENCE</span><span>COME FOR THE CODE. STAY FOR THE PEOPLE.</span></div><div className="section-heading"><h2>Built for your<br/><span className="script">next big thing.</span></h2><p>Get out of your comfort zone.<br/>Get into your element.</p></div><div className="experience-grid">{[['01','Find your people.','Different skills. Shared curiosity. Meet the people who make your next idea better.','Artboard 1','red-card'],['02','Make the leap.','Take that “someday” project and give it a first commit. Experiment, learn, and keep moving.','Artboard 1 copy','blue-card'],['03','Own your moment.','Put your work out there. Tell its story. Leave with something that didn’t exist before.','Artboard 1 copy 2','gold-card']].map(([num,title,text,asset,color])=><article className={`experience-card ${color}`} key={num}><div className="card-top"><span>{num} /</span><span>↗</span></div><img src={art(asset)} alt="" loading="lazy"/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
   <section id="timeline" className="section timeline"><div className="section-label"><span>03 / THE JOURNEY</span><span>ONE IDEA. ENDLESS POSSIBILITIES.</span></div><div className="timeline-grid"><div><h2>From <span className="script">hello</span><br/>to launch.</h2><p>The journey is taking shape.<br/>Official dates and timings coming soon.</p><span className="pill"><i className="status-dot"/> 2026 EDITION · STAY TUNED</span></div><ol className="steps">{[['01','Answer the call','Registrations open','Bring your curiosity. Find your team. Take the first step.'],['02','Enter build mode','Hackathon kicks off','Explore your idea, connect the dots, and bring it to life.'],['03','Show what’s next','Demos & closing','Share your creation and celebrate everything you’ve built.']].map(([n,title,label,text])=><li key={n}><span className="step-number">{n}</span><div><span className="eyebrow">{label}</span><h3>{title}</h3><p>{text}</p></div><span className="step-arrow">↗</span></li>)}</ol></div></section>
   <section id="faqs" className="section faq"><div className="faq-noise" aria-hidden="true">CODERED BUILD CREATE QUESTION EXPLORE HACK LEARN SHIP CODERED BUILD CREATE QUESTION EXPLORE HACK LEARN SHIP</div><div className="faq-grid"><div className="faq-intro"><span className="faq-kicker">QUESTIONS / ANSWERS</span><h2>Before<br/>you <span className="script red">build.</span></h2><button className="faq-cta" onClick={register}><span>GET</span><span>ACCESS</span></button></div><div className="faq-list">{questions.map(([q,answer],i)=><div className={`faq-item ${openFaq===i?'is-open':''}`} key={q}><h3><button aria-expanded={openFaq===i} aria-controls={`answer-${i}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span className="faq-index">Q.{String(i+1).padStart(3,'0')} <i>/</i></span><span className="faq-question">{q}</span><span className="faq-toggle">{openFaq===i?'−':'+'}</span></button></h3><div className="faq-answer" id={`answer-${i}`} hidden={openFaq!==i}><p>{answer}</p></div></div>)}</div></div></section>
   <RevolvingFooter register={register} />
  </main>
  <footer>
    <div className="cosmos-footer-giant">
      CODERED 4.0
    </div>
    <a href="#" className="footer-brand">CODERED’ 26</a>
    <span>A little chaos. A lot of possibility.</span>
    <a href="#">BACK TO TOP ↑</a>
    <div className="footer-bottom">
      <span>© 2026 CODERED. Built for what’s next.</span>
      <span>CODE. CREATE. REPEAT.</span>
    </div>
  </footer>
  <dialog ref={dialog} aria-labelledby="registration-title" className="registration-dialog" onClick={e=>{if(e.target===dialog.current)dialog.current.close()}}><button className="dialog-close" onClick={()=>dialog.current.close()} aria-label="Close registration details">×</button><img src={art('Artboard 1 copy')} alt=""/><span className="eyebrow">THE NEXT WAVE IS COMING</span><h2 id="registration-title">You’re early.<br/><span className="script red">We like that.</span></h2><p>Registration for CODERED’ 26 hasn’t opened yet. The application link, dates, and venue will be announced here.</p><p className="dialog-note">No sign-up is being collected yet. Bookmark this page and check back for the launch.</p><button className="button primary" onClick={()=>dialog.current.close()}>Got it <span>↗</span></button></dialog>
 </>
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

  useEffect(() => {
    let lastTime = performance.now()

    const animate = (now) => {
      const dt = (now - lastTime) / 1000 // seconds
      lastTime = now
      
      // Determine target speed multiplier
      let targetSpeed = 1; // Normal speed
      if (speedBoostTimeRef.current > 0) {
        speedBoostTimeRef.current -= dt;
        targetSpeed = 4; // 4x speed burst! (reduced from 8x)
      }
      
      // Smoothly interpolate current speed towards target speed
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * dt * 5;
      
      // Rotate the entire container slowly (0.5 degree per second base)
      containerAngleRef.current += dt * 0.5 * currentSpeedRef.current;
      if (orbitRef.current) {
        orbitRef.current.style.transform = `rotate(${containerAngleRef.current}deg)`
      }

      // Flow speed: slowed down to 90 seconds for a dreamy, relaxed base feel
      progressRef.current -= (dt / 90) * currentSpeedRef.current;
      
      // Loop seamlessly
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
        
        const jitterAngle = baseAngle + el.angleJitter;
        const jitterRadius = baseRadius + el.radiusJitter;
        
        const x = Math.cos(jitterAngle) * jitterRadius;
        const y = Math.sin(jitterAngle) * jitterRadius;
        
        const sizeScale = 0.5 + 0.5 * mapped_p;
        const width = el.widthBase * sizeScale;
        const height = width * el.heightRatio;
        
        const radialAngleDeg = ((jitterAngle % (2 * Math.PI)) * 180 / Math.PI);
        const tilt = radialAngleDeg + 90 + el.tiltJitter;

        let opacity = 1;
        if (mapped_p < 0.05) opacity = mapped_p / 0.05;
        else if (mapped_p > 0.95) opacity = (1 - mapped_p) / 0.05;

        node.style.width = width + 'px';
        node.style.height = height + 'px';
        node.style.left = x + 'px';
        node.style.top = y + 'px';
        node.style.opacity = opacity;
        node.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <section className="revolving-cta">
      <div className="revolving-orbit-container">
        <div className="revolving-orbit" ref={orbitRef}>
          {baseElements.map((el, i) => (
            <div
              key={i}
              ref={node => itemsRef.current[i] = node}
              className="revolving-item"
              style={{
                backgroundColor: el.bg,
                willChange: 'left, top, transform, width, height, opacity',
              }}
            >
              <img src={art(el.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </div>
          ))}
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
