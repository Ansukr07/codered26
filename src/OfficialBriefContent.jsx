import { getParticipantBrief } from './participantBriefs.js'
import './official-brief.css'

// oxlint-disable-next-line react/only-export-components -- Shared navigation metadata for the brief rail.
export const officialBriefSections = [
  ['problem', 'The problem'],
  ['focus', 'What to build'],
  ['deliverables', 'Demo & deliverables'],
  ['judging', 'Success criteria'],
  ['resources', 'Scope & constraints'],
  ['terms', 'Resources & help'],
  ['next', 'Register'],
]

function SectionHeading({ label, children }) {
  return <div className="td-section-heading td-source-group-heading">
    <p className="td-kicker"><span className="td-dash" aria-hidden="true" /><span>{label}</span></p>
    <div className="td-section-mask"><h2>{children}</h2></div>
  </div>
}

function Text({ children }) {
  return children.split(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi).map((part, index) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part)
      ? <a className="td-source-email" href={`mailto:${part}`} key={index}>{part}</a>
      : part)
}

function Cards({ items, kind, className, numbered = false, list = false }) {
  const Container = list ? 'ol' : 'div'
  const Item = list ? 'li' : 'div'
  return <Container className={`td-visual-grid ${className}`}>
    {items.map((item, index) => <Item className="td-visual-item td-visual-item--field" data-participant-item={`${kind}-${index}`} key={item.title}>
      {numbered && <span className="td-visual-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
      <div className="td-visual-copy">
        <strong className="td-source-label" data-participant-title>{item.href ? <a className="td-source-link" href={item.href} target="_blank" rel="noreferrer"><Text>{item.title}</Text></a> : <Text>{item.title}</Text>}</strong>
        <p data-participant-text><Text>{item.text}</Text></p>
      </div>
    </Item>)}
  </Container>
}

export default function OfficialBriefContent({ track }) {
  const source = track.officialBrief
  const brief = source && getParticipantBrief(source.number, track.briefOwner || track.slug)
  if (!brief) return null

  return <>
    <section id="problem" className="td-brief-section td-source-group" data-participant-brief={brief.number}>
      <div className="td-problem td-source-intro">
        <div className="td-number-card td-source-number-card">
          <span>{source.company} / {track.briefKind === 'open-challenge' ? 'Open challenge' : 'Challenge'}</span>
          <strong>{String(brief.number).padStart(2, '0')}</strong>
          <p>{source.title}</p>
        </div>
        <div className="td-source-intro-copy">
          <SectionHeading label="The problem">The challenge.</SectionHeading>
          <p className="td-source-objective" data-participant-problem><Text>{brief.problem}</Text></p>
        </div>
      </div>
      <div className="td-source-body td-participant-context">
        <Cards kind="context" className="td-participant-context-grid" items={[
          { title: 'Who it helps', text: brief.audience },
          { title: 'Your challenge', text: brief.outcome },
        ]} />
      </div>
    </section>

    {brief.directions?.length > 0 && <section id="directions" className="td-brief-section td-source-group">
      <SectionHeading label="Suggested directions">Choose a focused direction.</SectionHeading>
      <div className="td-source-body td-source-sections">
        <p className="td-body-copy td-directions-intro">{brief.directionsIntro || 'These are starting points, not fixed challenges. Choose one and narrow it to a specific user, task and measurable outcome, or propose another relevant scientific, engineering or physical-world problem.'}</p>
        <Cards items={brief.directions} kind="directions" className="td-capability-grid" numbered list />
      </div>
    </section>}

    <section id="focus" className="td-brief-section td-source-group">
      <SectionHeading label="Product capabilities">What to build.</SectionHeading>
      <div className="td-source-body td-source-sections">
        <div className="td-capability-lane td-capability-lane--required">
          <h3 className="td-source-subheading td-capability-label">Required features</h3>
          <Cards items={brief.required} kind="required" className="td-capability-grid" numbered list />
        </div>
        <div className="td-capability-lane td-capability-lane--optional">
          <h3 className="td-source-subheading td-capability-label">Optional ideas</h3>
          <Cards items={brief.optional} kind="optional" className="td-capability-grid" list />
        </div>
        <div className="td-interaction-strip">
          <h3 className="td-source-label">Typical workflow</h3>
          <p data-participant-workflow><Text>{brief.workflow}</Text></p>
        </div>
      </div>
    </section>

    <section id="deliverables" className="td-brief-section td-source-group">
      <SectionHeading label="Demo & deliverables">Show it working.</SectionHeading>
      <div className="td-source-body td-delivery-panel td-source-sections">
        <Cards items={brief.deliverables} kind="deliverables" className="td-deliverable-grid" numbered list />
      </div>
    </section>

    <section id="judging" className="td-brief-section td-source-group">
      <SectionHeading label="Success criteria">What success looks like.</SectionHeading>
      <div className="td-source-body td-source-sections">
        <Cards items={brief.success} kind="success" className="td-success-grid" numbered />
      </div>
    </section>

    <section id="resources" className="td-brief-section td-source-group">
      <SectionHeading label="Scope & constraints">Build within the brief.</SectionHeading>
      <div className="td-source-body td-source-sections">
        <Cards items={brief.scope} kind="scope" className="td-scope-grid" />
        <h3 className="td-source-subheading td-participant-subheading">Technical & safety requirements</h3>
        <Cards items={brief.constraints} kind="constraints" className="td-constraint-grid" />
      </div>
      {track.sourceClarifications?.map(note => <p className="td-source-clarification" key={note}><strong>Benchmark clarification:</strong> {note}</p>)}
    </section>

    <section id="terms" className="td-brief-section td-source-group">
      <SectionHeading label="Resources & help">Useful before you start.</SectionHeading>
      <div className="td-source-body td-source-sections">
        <Cards items={brief.resources} kind="resources" className="td-resource-list" numbered />
      </div>
    </section>
  </>
}
