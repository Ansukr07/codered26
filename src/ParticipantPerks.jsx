import './participant-perks.css';

export default function ParticipantPerks({ onNavigate }) {
  const categories = [
    {
      numeral: '01',
      categoryTitle: 'AI & Development Resources',
      perks: [
        {
          id: 'aigi',
          title: 'AI Grants India',
          tag: 'AI Tools & Grants',
          description:
            'Explore AI-powered tools and resources to support your project development. Participants can access speech credits, open-source Laya, and OpenAI GPT-5 through AIGI’s special referral link.',
          benefits: [
            'Speech credits',
            'Access to open-source Laya',
            'Access to OpenAI GPT-5',
          ],
          note: 'Participants can access these resources through the official referral link.',
          actionLabel: 'Access AIGI Resources',
          actionUrl: 'https://aigrants.in/form?ref=bmsit',
        },
        {
          id: 'adaption',
          title: 'Adaption Labs',
          tag: 'Frontier AI & Models',
          description:
            'Train your own AI models and bring your ideas to life with Adaption Labs, a frontier AI lab founded by researchers who previously led research and inference at Cohere and worked at Google. Adaption enables teams to build custom AI models using their own data or a description of what they need, helping participants develop solutions tailored to their projects.',
          benefits: [
            '$1,250 in Adaption credits for every participant who signs up through the official referral link.',
            '$1,000 in Adaption credits and Builder-tier access for the team that makes the best use of Adaption.',
            'Adaption merchandise for the winning team.',
          ],
          actionLabel: 'Claim Your Adaption Credits',
          actionUrl: 'https://adaptionlabs.ai/app/auth/referral?ref=8b66d2720a0e828d616a3a29',
        },
        {
          id: 'agnes-ai',
          title: 'Agnes AI',
          tag: 'AI Models & Development Benefits',
          description:
            'Agnes AI is offering exclusive AI resources and premium development benefits to CODERED ’26 participants and top-performing teams.',
          benefits: [
            'Free AI model access for all participants through Agnes AI’s free-tier models.',
            '$10 in Agnes AI credits for every team member selected for Round 3.',
            'The five best projects that share their work on social media will receive a $20 Agnes Code subscription.',
          ],
        },
      ],
    },
    {
      numeral: '02',
      categoryTitle: 'Domains & Digital Tools',
      perks: [
        {
          id: 'xyz',
          title: '.XYZ — Domain Partner',
          tag: 'Web Domains',
          description:
            'Give your project its own online identity with a domain from .XYZ. The top 50 teams will receive domain registrations to help establish an online presence for their projects.',
          benefits: [
            'Domain registrations for the top 50 teams, excluding the UNISYS track.',
          ],
        },
      ],
    },
    {
      numeral: '03',
      categoryTitle: 'Premium & Professional Tools',
      perks: [
        {
          id: 'fueler',
          title: 'Fueler',
          tag: 'Portfolio & Proof of Work',
          description:
            'Turn your work into opportunities with Fueler, a proof-of-work and professional portfolio platform that helps individuals showcase their skills, projects, and achievements. Fueler is offering exclusive benefits to CODERED ’26 participants and winners.',
          benefits: [
            '$100 in Fueler Premium for the winning team.',
            '$800 in Fueler Digital Bundle for participants.',
          ],
          note: 'These resources will help participants showcase their work, build professional portfolios, and demonstrate their skills beyond conventional resumes.',
        },
      ],
    },
  ];

  return (
    <section id="participant-perks" className="tp-section tp-section--perks">
      <div className="tp-container perks-container">
        {onNavigate && (
          <div className="prizes-breadcrumb" style={{ marginBottom: '2.5rem' }}>
            <a
              className="td-back"
              href="/"
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onNavigate('home');
              }}
            >
              <span aria-hidden="true">←</span> Back to Home
            </a>
          </div>
        )}

        <header className="perks-head">
          <span className="perks-badge">CODERED ’26 • Exclusive Participant Perks</span>
          <h1 className="perks-title">Participant Perks</h1>
          <p className="perks-tagline">Build. Innovate. Unlock More.</p>
          <p className="perks-subtitle">
            CODERED ’26 brings together industry partners to empower participants with exclusive AI resources, development tools, and professional opportunities.
          </p>
          <p className="perks-sublead">
            From AI credits and custom model training to premium subscriptions and project domains, discover the benefits available to participating teams and take your ideas further.
          </p>
        </header>

        <div className="perks-sections-wrap">
          {categories.map((cat) => (
            <div className="perks-category-group" key={cat.numeral}>
              <div className="perks-category-header">
                <span className="perks-category-numeral">{cat.numeral}</span>
                <h2 className="perks-category-title">{cat.categoryTitle}</h2>
              </div>

              <div className="perks-cards-grid">
                {cat.perks.map((perk) => (
                  <article className="perk-card" key={perk.id}>
                    <header className="perk-card-header">
                      <div className="perk-card-title-wrap">
                        <span className="perk-card-tag">{perk.tag}</span>
                        <h3 className="perk-card-title">{perk.title}</h3>
                      </div>
                    </header>

                    <div className="perk-card-body">
                      <p className="perk-card-desc">{perk.description}</p>

                      <div className="perk-benefits-wrap">
                        <span className="perk-benefits-heading">Exclusive benefits:</span>
                        <ul className="perk-benefits-list">
                          {perk.benefits.map((b, idx) => (
                            <li key={idx} className="perk-benefit-item">
                              <span className="perk-bullet" aria-hidden="true">+</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {perk.note && (
                        <p className="perk-card-note">{perk.note}</p>
                      )}

                      {perk.actionUrl && (
                        <div className="perk-card-action">
                          <a
                            href={perk.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="perk-action-btn"
                          >
                            <span>{perk.actionLabel}</span>
                            <span className="perk-action-arrow" aria-hidden="true">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="perks-footer-callout">
          <div className="perks-callout-inner">
            <h2 className="perks-callout-title">Make the Most of CODERED ’26</h2>
            <p className="perks-callout-desc">
              Explore new technologies, experiment with AI, and build solutions to real-world challenges with the support of our industry partners.
              Make use of these exclusive benefits to take your ideas from concept to creation.
            </p>
            <p className="perks-disclaimer">
              Partner benefits are subject to the respective partners’ eligibility criteria, terms, and redemption guidelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
