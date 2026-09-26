import './editorial.css'

const rounds = [
  ['01', 'OPEN CALL', 'Round one: submit the idea', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. BRING YOUR TEAM, FRAME THE PROBLEM, AND SEND IN YOUR CONCEPT.'],
  ['02', 'THE BUILD', 'Round two: 24 hours live', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SELECTED TEAMS BUILD, TEST, AND REFINE ON THE CLOCK.'],
  ['03', 'FINAL DEMO', 'Present what you made', 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SHOW THE WORK, TELL THE STORY, AND CLOSE THE DAY TOGETHER.'],
]

export default function EditorialSections() {
  return <>
    <section className="shift-hero" aria-labelledby="hero-title">
      <div className="shift-hero-main">
        <div className="shift-hero-composition">
          <div className="shift-hero-first-line"><span aria-hidden="true">CODE</span><p>National Level<br/>24-Hour Hackathon.<br/><strong>Code Till You Drop.</strong></p></div>
          <h1 id="hero-title" className="shift-hero-display"><span className="sr-only">CODE </span>RED<sup>’26</sup></h1>
          <div className="shift-hero-links"><span>E-CELL × BMSIT&amp;M PRESENTS</span><a href="https://unstop.com/o/qjIA3CN?utm_medium=Share&amp;utm_source=ecell-bmsitm&amp;utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">REGISTER ↗</a><a href="https://drive.google.com/file/d/1CbiJmOo-E1F1OhH4Lvy6i8dYi9kEareX/view?usp=sharing" target="_blank" rel="noopener noreferrer">BROCHURE ↗</a></div>
        </div>
      </div>
      <aside className="shift-hero-rail">
        <div className="shift-rail-intro">From first thought<br/>to final demo.<br/>All in one day.</div>
        <div className="shift-rail-status"><h2>Event status</h2><ol><li><span>01. IDEAS</span><b>•</b></li><li><span>02. TEAMS</span><b>•</b></li><li><span>03. ROUND ONE</span><b>•</b></li><li><span>04. SHORTLIST</span><b>•</b></li><li><span>05. ROUND TWO</span><b>•</b></li><li><span>06. 24H BUILD</span><b>•</b></li><li><span>07. DEMOS</span><b>•</b></li><li><span>08. RESULTS</span><b>•</b></li></ol><div className="shift-binary" aria-hidden="true">00101101&nbsp; 00111010&nbsp; 00110101<br/>11010110&nbsp; 11010001&nbsp; 11100101<br/>01100000&nbsp; 01100010&nbsp; 01101010</div></div>
      </aside>
    </section>

    <section id="about" className="shift-about" aria-labelledby="about-title">
      <div className="shift-about-top"><div className="shift-about-copy"><h2 id="about-title">What is<br/>CODERED?</h2><p>CODERED 3.0 is a National Level 24-hour Hackathon where builders, designers, and makers come together to prototype bold ideas.</p></div><div className="shift-about-side"><span className="shift-about-plus" aria-hidden="true">+</span><p>Built in<br/>24 hours.</p></div></div>
      <div className="shift-info-grid">
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Tracks</h3><ul><li>Software</li><li>Hardware</li></ul></article>
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Prizes</h3><ul><li>Overall Winner: ₹60,000</li><li>Runner-up: ₹30,000</li><li>Category Winners</li></ul></article>
        <article><span className="shift-card-plus" aria-hidden="true">+</span><h3>Details</h3><ul><li>Duration: 24 hours</li><li>Team size: 3-4</li><li>Venue: BMS Institute Of Technology &amp; Management</li><li>Date: Dec 12-13, 2025</li></ul></article>
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
