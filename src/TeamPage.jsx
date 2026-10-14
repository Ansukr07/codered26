import { useEffect, useRef } from 'react'
import teamData from './data/teamData.json'
import TeamPortrait from './TeamPortrait.jsx'
import './team-page.css'

const groups = [
  ['Co ordinators', 'Coordinators'],
  ['tech_domain', 'Tech Domain'],
  ['design_domain', 'Design Domain'],
  ['media_marketing', 'Marketing'],
  ['events_ops', 'Events & operations'],
  ['corporate_relations', 'Corporate relations'],
  ['content_team', 'Content'],
  ['farewell_chronicle', 'Media & relations'],
]

const portrait = (image) => `/team/${image.split('/').pop()}`

function SocialIcon({ href, label, children }) {
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>
    : <span className="team-social-pending" title={`${label} link coming soon`} aria-hidden="true">{children}</span>
}

function Member({ person, featured = false, index }) {
  return <article className={`team-member team-reveal${featured ? ' team-member--featured' : ''}`} style={{ '--team-delay': `${(index % 4) * 65}ms` }}>
    <TeamPortrait src={portrait(person.image)} name={person.name} eager={featured} />
    <div className="team-member-details">
      <h3>{person.name}</h3>
      <p>{person.position}</p>
      <div className="team-member-socials">
        <SocialIcon href={person.socials?.instagram} label={`${person.name} on Instagram`}><svg className="team-instagram-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></SocialIcon>
        <SocialIcon href={person.socials?.linkedin} label={`${person.name} on LinkedIn`}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z"/></svg></SocialIcon>
      </div>
    </div>
  </article>
}

export default function TeamPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = page.querySelectorAll('.team-reveal')
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: .08, rootMargin: '0px 0px -35px 0px' })
    page.classList.add('team-motion-ready')
    targets.forEach(target => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return <div ref={pageRef} className="team-page">
    <header className="team-title">
      <h1 id="team-page-title" className="team-reveal">MEET THE TEAM</h1>
    </header>

    <div className="team-directory">
      {groups.map(([key, title], groupIndex) => <section className="team-group" id={groupIndex === 0 ? 'coordinators' : key.replaceAll('_', '-')} key={key} aria-labelledby={`team-heading-${groupIndex}`}>
        <div className="team-group-heading team-reveal">
          <h2 id={`team-heading-${groupIndex}`}>{title}</h2>
        </div>
        <div className={`team-grid${groupIndex === 0 ? ' team-grid--featured' : ''}`}>
          {teamData[key].map((person, index) => <Member key={person.name} person={person} featured={groupIndex === 0} index={index} />)}
        </div>
      </section>)}
    </div>
  </div>
}
