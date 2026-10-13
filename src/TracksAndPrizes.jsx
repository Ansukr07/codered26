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
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: e, start: "top bottom", end: "bottom bottom", scrub: 1 } }
      );
    });

    mm.add("(max-width: 700px)", () => {
      const trackGrid = e.querySelector('.tracks-grid');
      const innerContainer = e.querySelector('.tp-container');

      // Calculate how far to scroll to perfectly center the 4th (last) card
      const getScrollAmount = () => {
        const cards = trackGrid.querySelectorAll('.track-card');
        if (cards.length < 2) return 0;

        // The most foolproof way to get the exact width + gap of a single card
        // is to measure the distance between the start of card 1 and card 2.
        const shiftPerCard = cards[1].offsetLeft - cards[0].offsetLeft;

        // Since the 1st card starts perfectly centered, we shift the grid left 
        // by exactly (N-1) times the shift amount!
        return -((cards.length - 1) * shiftPerCard);
      };

      const tween = gsap.fromTo(trackGrid,
        { x: 0 },
        {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: e,
            start: "top top",
            end: () => `+=${trackGrid.scrollWidth}`,
            pin: innerContainer,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }
      );

      const onPreloaderComplete = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('preloaderComplete', onPreloaderComplete);

      return () => {
        window.removeEventListener('preloaderComplete', onPreloaderComplete);
        tween.kill();
      };
    });

  }, { scope: containerRef });

  const tracks = [
    {
      title: "Track 1",
      tag: "To be announced",
      desc: "Track 1: Company based problem statement to be announced.",
      ghostText: "01",
    },
    {
      title: "Track 2",
      tag: "To be announced",
      desc: "Track 2: Company based problem statement to be announced.",
      ghostText: "02",
    },
    {
      title: "Track 3",
      tag: "To be announced",
      desc: "Track 3: Company based problem statement to be announced.",
      ghostText: "03",
    },
    {
      title: "Track 4",
      tag: "To be announced",
      desc: "Track 4: Company based problem statement to be announced.",
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
                    <strong>{track.desc.substring(0, track.desc.indexOf(':') + 1).split(/([.,!?'-])/g).map((part, j) => part.match(/[.,!?'-]/) ? <span key={j} style={{ fontFamily: 'LilGrotesk, sans-serif' }}>{part}</span> : part)}</strong>
                    {track.desc.substring(track.desc.indexOf(':') + 1).split(/([.,!?'-])/g).map((part, j) => part.match(/[.,!?'-]/) ? <span key={j} style={{ fontFamily: 'LilGrotesk, sans-serif' }}>{part}</span> : part)}
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

const SparkleSVG = ({ className, style, asset = '/assets-for-prize/stars.svg' }) => (
  <img src={asset} alt="" aria-hidden="true" className={`prize-stars-asset ${className}`} style={style} />
);

const animatePrizeAsset = (event, isHovering) => {
  const image = event.currentTarget.querySelector('.prize-award-asset');
  if (!image || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const currentTransform = getComputedStyle(image).transform;
  image.getAnimations().forEach(animation => animation.cancel());

  if (isHovering) {
    image.animate(
      [
        { transform: currentTransform },
        { transform: 'translateY(2px)' },
        { transform: currentTransform },
      ],
      { duration: 2400, iterations: Infinity, easing: 'ease-in-out' }
    );
    return;
  }

  image.animate(
    [{ transform: currentTransform }, { transform: 'translateY(14px)' }],
    { duration: 850, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );
};

export function PrizesSection() {
  const prizes = [
    { place: '1st place', amount: '₹30,000', asset: '/assets-for-prize/1st.svg', sparkle: 's1' },
    { place: '2nd place', amount: '₹20,000', asset: '/assets-for-prize/2nd.svg', sparkle: 's3', starAsset: '/assets-for-prize/black%20star.svg' },
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
            minHeight: '250px',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem 2rem 3rem'
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
              <SparkleSVG className="s1 prize-pool-star prize-pool-star--left" />
              <SparkleSVG className="s2 prize-pool-star prize-pool-star--right" />
            </div>

            {/* Massive Center Text (Light text on dark background) */}
            <h4 className="prize-amount" style={{
              fontSize: 'clamp(2.5rem, 12vw, 7.5rem)',
              margin: 0,
              color: 'var(--p-text)',
              position: 'relative',
              zIndex: 10,
              whiteSpace: 'nowrap'
            }}>
              Rs.&nbsp;2,00,000<span style={{ color: 'var(--p-accent)' }}></span>
            </h4>
          </div>

        </div>

        <div className="prizes-title-row">
          <div className="prizes-title-text">
            <h3 className="tp-h-regular prizes-title-main">Prize distribution</h3>
            <h3 className="tp-h-regular tp-opacity-50">Applies to all the tracks</h3>
          </div>
        </div>
        <div className="prize-outer-container">
          {prizes.map((prize, index) => (
            <article
              className={`prize-card prize-card-${index + 1}`}
              key={prize.place}
              onMouseEnter={event => animatePrizeAsset(event, true)}
              onMouseLeave={event => animatePrizeAsset(event, false)}
            >
              <div className="prize-card-top">
                <div className="prize-tag-container">
                  <PrizePixelGrid />
                  <div className="prize-tag-inner">
                    <div className="prize-tag-hash">#</div>
                    <div className="prize-tag-text">{prize.place}</div>
                    <div className="prize-tag-bracket">{"}"}</div>
                  </div>
                </div>
                <div className="prize-illustration">
                  <img className="prize-award-asset" src={prize.asset} alt={`${prize.place} prize illustration`} />
                  <SparkleSVG className={prize.sparkle} asset={prize.starAsset} />
                  <SparkleSVG className="s2" asset={prize.starAsset} />
                  <SparkleSVG className="s4" asset={prize.starAsset} />
                  <SparkleSVG className="s5" asset={prize.starAsset} />
                </div>
              </div>
              <div className="prize-card-bottom">
                <h4 className="prize-amount">{prize.amount}</h4>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
