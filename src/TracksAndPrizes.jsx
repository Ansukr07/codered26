import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './tracks-prizes.css';

gsap.registerPlugin(ScrollTrigger);

/*
  22x4 grid.
  - Row 1: 22 blocks (full border row)
  - Row 2 & 3: 2 blocks left + 2 blocks right (split rows)
  - Row 4: 22 blocks (full border row)
*/
const TrackPixelGrid = () => (
  <div className="tp-card-grid-bg">
    {/* Row 1: full row */}
    <div className="tp-block-row tp-block-row--full">
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="tp-block" />
      ))}
    </div>
    {/* Row 2: split */}
    <div className="tp-block-row tp-block-row--split">
      <div className="tp-block" />
      <div className="tp-block" />
    </div>
    {/* Row 3: split */}
    <div className="tp-block-row tp-block-row--split">
      <div className="tp-block" />
      <div className="tp-block" />
    </div>
    {/* Row 4: full row */}
    <div className="tp-block-row tp-block-row--full">
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="tp-block" />
      ))}
    </div>
  </div>
);

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

export function TracksSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const e = containerRef.current;
    if (!e) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 701px)", () => {
      // 1. Fade-Up Reveal (Staggered Wave)
      const cards = gsap.utils.toArray('.track-card');
      gsap.fromTo(cards, 
        { y: 60, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, stagger: 0.15, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: e, start: "top 85%", once: true } }
      );

      // 2. Parallax Scrub on the Right Column (Even cards: 2 and 4)
      // Creating the uneven floating depth effect that catches up perfectly at the bottom
      // Re-adding the higher speed (75%) and the GSAP momentum (scrub: 1) for that buttery feel
      const rightCards = e.querySelectorAll('.track-card:nth-child(2n)');
      gsap.fromTo(rightCards,
        { yPercent: 75 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: e, start: "top bottom", end: "bottom center", scrub: 1 } }
      );
    });

  }, { scope: containerRef });

  const tracks = [
    {
      title: "Software Track",
      tag: "Core Track",
      desc: "Software Track: Build autonomous AI agents, web apps and tools that can act, transact, and coordinate. Focus on scalability, impact, and user experience.",
      ghostText: "01",
    },
    {
      title: "Hardware Track",
      tag: "Core Track",
      desc: "Hardware Track: Prototype physical devices, IoT solutions, and integrated hardware-software systems to bridge the digital and physical worlds.",
      ghostText: "02",
    },
    {
      title: "Open Innovation",
      tag: "Special Track",
      desc: "Open Innovation: No constraints. Pick any problem, any domain, and build a bold solution. Show us what happens when there are no limits.",
      ghostText: "03",
    },
    {
      title: "AI for Good",
      tag: "Special Track",
      desc: "AI for Good: Build AI-powered solutions that address real-world challenges — from healthcare and education to sustainability and accessibility.",
      ghostText: "04",
    },
  ];

  return (
    <section id="tracks" className="tp-section" ref={containerRef}>
      <div className="tp-container">
        <div className="tp-title-row">
          <h2 className="tp-h-large" style={{ fontFamily: "Valentine, Georgia, serif", fontWeight: 400, textTransform: "none" }}>Tracks</h2>
        </div>
        <div className="tracks-grid">
          {tracks.map((track, idx) => (
            <div key={idx} className={`track-card track-card-${idx + 1}`}>
              <span className="track-top-flag">{track.tag}</span>

              <div className="track-card-body">
                <div className="tp-card-top">
                  <TrackPixelGrid />
                  {/* Floating inner box */}
                  <div className="tp-inner-box">
                    <div className="tp-inner-icon">
                      <DotArrowSVG />
                    </div>
                    <div className="tp-inner-text">
                      <h3 className="tp-h-medium">{track.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="track-card-content">
                  <p className="tp-p-medium">
                    <strong>{track.desc.substring(0, track.desc.indexOf(':') + 1)}</strong>
                    {track.desc.substring(track.desc.indexOf(':') + 1)}
                  </p>
                  
                  {/* Huge striped background number a-la timeline */}
                  <span className="track-ghost-number">{track.ghostText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PRIZES ===================== */

const PrizePixelGrid = () => (
  <div className="prize-grid-bg">
    <div className="prize-block-row prize-block-row--full">
      {Array.from({ length: 12 }).map((_, i) => <div key={i} className="prize-block" />)}
    </div>
    <div className="prize-block-row prize-block-row--split">
      <div className="prize-block" />
      <div className="prize-block" />
    </div>
    <div className="prize-block-row prize-block-row--split">
      <div className="prize-block" />
      <div className="prize-block" />
    </div>
    <div className="prize-block-row prize-block-row--full">
      {Array.from({ length: 12 }).map((_, i) => <div key={i} className="prize-block" />)}
    </div>
  </div>
);

const SparkleSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={`sparkle-svg ${className}`}>
    <path fill="#ffffff" d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
  </svg>
);

export function PrizesSection() {
  const prizes = [
    {
      place: "1st place",
      amount: "₹30,000",
      tagColorClass: "prize-tag-yellow",
      images: [
        { src: "/images/prizes/prize-1-diamond.svg", class: "p1-diamond" },
        { src: "/images/prizes/prize-1-coin-bottom.svg", class: "p1-cb" },
        { src: "/images/prizes/prize-1-coin-top.svg", class: "p1-ct" },
        { src: "/images/prizes/prize-1-bills.svg", class: "p1-bills" },
      ],
      sparkles: [{ class: "s1" }, { class: "s2" }]
    },
    {
      place: "2nd place",
      amount: "₹20,000",
      tagColorClass: "prize-tag-blue",
      images: [
        { src: "/images/prizes/prize-2-left.svg", class: "p2-left" },
        { src: "/images/prizes/prize-2-bottom.svg", class: "p2-bottom" },
        { src: "/images/prizes/prize-2-top.svg", class: "p2-top" },
      ],
      sparkles: [{ class: "s3" }, { class: "s4" }]
    },
  ];

  return (
    <section id="prizes" className="tp-section tp-section--prizes">
      <div className="tp-container">
        <div className="tp-title-row" style={{ textAlign: "center" }}>
          <h2 className="tp-h-large" style={{ fontFamily: "Valentine, Georgia, serif", fontWeight: 400, textTransform: "none" }}>Prizes</h2>
        </div>

        {/* Massive Centered Prize Pool Banner (Single Solid Dark Color) */}
        <div className="prize-card prize-card-1" style={{ 
          maxWidth: '900px', 
          margin: '0 auto 2.5rem', 
          border: '1px solid #1e1b18' 
        }}>
          
          {/* ENTIRE BANNER (Dark background, Tag, Illustrations, and Amount) */}
          <div className="prize-card-top" style={{ 
            aspectRatio: 'auto', 
            minHeight: '320px',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem 2rem 4rem'
          }}>
            
            {/* Tag - locked to a fixed size so it matches the other cards perfectly without stretching or breaking the grid! */}
            <div className="prize-tag-container" style={{ width: '320px', aspectRatio: '12 / 4' }}>
              <PrizePixelGrid />
              <div className="prize-tag-inner">
                <div className="prize-tag-hash">#</div>
                <div className="prize-tag-text">TOTAL PRIZE POOL</div>
                <div className="prize-tag-bracket">{"}"}</div>
              </div>
            </div>
            
            {/* We position the sparkles manually so they are visible and don't hide behind the wide tag */}
            <div className="prize-illustration">
              <SparkleSVG className="s1" style={{ top: '25%', left: '30%', width: '45px' }} />
              <SparkleSVG className="s2" style={{ top: '65%', right: '20%', width: '60px' }} />
              <SparkleSVG className="s4" style={{ top: '20%', right: '35%', width: '30px' }} />
            </div>

            {/* Massive Center Text (Light text on dark background) */}
            <h4 className="prize-amount" style={{ 
              fontSize: 'clamp(4rem, 10vw, 7.5rem)', 
              margin: 0, 
              color: 'var(--p-text)',
              position: 'relative',
              zIndex: 10
            }}>
              ₹2,00,000<span style={{ color: 'var(--p-accent)' }}></span>
            </h4>
          </div>
          
        </div>

        <div className="prizes-title-row">
          <div className="prizes-title-text">
            <h3 className="tp-h-regular prizes-title-main">Prizes per track</h3>
            <h3 className="tp-h-regular tp-opacity-50">Applies to: All 4 tracks</h3>
          </div>
        </div>
        
        <div className="prize-outer-container">
        {prizes.map((prize, idx) => (
          <div key={idx} className={`prize-card prize-card-${idx + 1}`}>
            <div className="prize-card-top">
              {/* Top Left Floating Tag Area */}
              <div className="prize-tag-container">
                <PrizePixelGrid />
                <div className="prize-tag-inner">
                  <div className="prize-tag-hash">#</div>
                  <div className="prize-tag-text">{prize.place}</div>
                  <div className="prize-tag-bracket">{"}"}</div>
                </div>
              </div>
              
              {/* Center Illustrations */}
              <div className="prize-illustration">
                {prize.images.map((img, i) => (
                  <img key={i} src={img.src} alt="" className={`prize-layer ${img.class}`} />
                ))}
                {prize.sparkles.map((sp, i) => (
                  <SparkleSVG key={i} className={sp.class} />
                ))}
              </div>
            </div>

            <div className="prize-card-bottom">
              <h4 className="prize-amount">{prize.amount}</h4>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
