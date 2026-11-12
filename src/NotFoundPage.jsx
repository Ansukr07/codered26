import { useEffect, useRef } from 'react';
import './not-found.css';

export default function NotFoundPage({ onNavigate }) {
  const glitchRef = useRef(null);

  // Animate the "404" glitch text occasionally
  useEffect(() => {
    const el = glitchRef.current;
    if (!el) return;
    let timeout;
    const flicker = () => {
      el.classList.add('is-glitching');
      timeout = setTimeout(() => {
        el.classList.remove('is-glitching');
        timeout = setTimeout(flicker, 2800 + Math.random() * 3000);
      }, 500);
    };
    timeout = setTimeout(flicker, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="not-found">
      {/* Decorative grid lines */}
      <div className="nf-grid" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="nf-grid-line" />
        ))}
      </div>

      <div className="nf-inner">
        {/* Big glitch number */}
        <div className="nf-code-wrap" aria-hidden="true">
          <span className="nf-code" ref={glitchRef} data-text="404">
            404
          </span>
        </div>

        {/* Headline */}
        <h1 className="nf-heading">
          Lost in the{' '}
          <span className="red">void.</span>
        </h1>

        <p className="nf-sub">
          This page doesn&apos;t exist — yet. Maybe it&apos;s coming soon,<br />
          or maybe you took a wrong turn. Either way, let&apos;s get you back.
        </p>

        {/* CTA */}
        <div className="nf-actions">
          <button
            className="button primary nf-btn"
            onClick={() => onNavigate('home')}
          >
            Back to Home <span>↗</span>
          </button>
        </div>
      </div>

      {/* Decorative corner label */}
      <div className="nf-corner-label" aria-hidden="true">
        <span>ERR / 404</span>
        <span>BMSIT&amp;M · E-CELL</span>
      </div>
    </section>
  );
}

