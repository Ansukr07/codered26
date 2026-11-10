import sources from './data/think-robotics.json' with { type: 'json' }

const topics = ['Account identity', 'Account briefs', 'Territory queries', 'Lead discovery', 'Next needs', 'Evidence']
const prompts = [
  ['Who is this customer?', ['Company match', 'Merge confidence', 'Supporting sources']],
  ['What should I know before this visit?', ['Purchases', 'Browsing', 'Project signals']],
  ['Which accounts should I call next?', ['PIN range', 'Value & recency', 'Visit context']],
  ['Who looks like our best customers?', ['Public records', 'Customer similarity', 'Lead evidence']],
  ['What might this customer need next?', ['Order history', 'Similar accounts', 'External signals']],
  ['How fresh is this evidence?', ['Last seen', 'Conflicting evidence', 'Confidence weights']],
]

export function createThinkRoboticsTrack(base) {
  const company = {
    ...base,
    title: 'Think Robotics',
    category: 'Knowledge graphs & B2B sales',
    subtitle: 'Connected customer intelligence for B2B commerce',
    summary: 'Connect customer records and public evidence into a trustworthy knowledge graph that helps B2B sales teams prepare, prioritise and discover opportunities.',
    cardDescription: 'Build a customer knowledge graph that powers four B2B sales workflows from connected, evidence-backed customer data.',
    isMock: false,
    hasOfficialBriefs: true,
    heroMode: 'diagram',
  }
  return {
    ...company,
    problemStatements: sources.map(source => ({
      ...company,
      id: `ps-${source.number}`,
      page: `${base.problemsPage}/ps-${source.number}`,
      path: `${base.problemsPath}/ps-${source.number}`,
      parentTrackPage: base.page,
      parentTrackTitle: company.title,
      problemNumber: String(source.number).padStart(2, '0'),
      title: source.title,
      fullTitle: source.fullTitle,
      subtitle: source.subtitle,
      category: source.industry,
      summary: 'Resolve fragmented customer records into one trusted graph for account briefs, territory queries, lead discovery and next-need signals.',
      officialBrief: source,
      topics: topics.map((label, index) => ({ id: `topic-${index}`, label })),
      prompts: prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: index % 2 ? 'App' : 'Web' })),
    })),
  }
}
