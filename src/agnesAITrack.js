import sources from './data/agnes-ai.json' with { type: 'json' }

const topics = ['Chip design', 'Operator tuning', 'Protein research', 'Rescue planning', 'Traceable evidence', 'Repeatable tests']
const prompts = [
  ['Does this small design pass its tests?', ['Design requirements', 'Testbench', 'Verification result']],
  ['Can this operator run faster at equal accuracy?', ['Same hardware', 'Numerical correctness', 'Runtime comparison']],
  ['What evidence supports this protein question?', ['Permitted data', 'Traceable sources', 'Accuracy checks']],
  ['How does this rescue plan compare in simulation?', ['Scenario constraints', 'Simulated route', 'Human review']],
  ['Which inputs support this result?', ['Input provenance', 'Generated suggestion', 'Independent checks']],
  ['Can I reproduce this result against the baseline?', ['Documented test case', 'Baseline result', 'Measured improvement']],
]

export function createAgnesAITrack(base) {
  const company = {
    ...base,
    title: 'Agnes AI',
    category: 'Science, engineering & physical AI',
    subtitle: 'AI for Science and Physical AI',
    summary: 'Choose a focused scientific, engineering or physical-world challenge. Explore four suggested directions or propose your own, then build and validate a product powered by Agnes AI.',
    cardDescription: 'One open challenge: build a focused science, engineering or physical-world product with Agnes AI and demonstrate measurable value against a baseline.',
    isMock: false,
    hasOfficialBriefs: true,
    briefKind: 'open-challenge',
    heroMode: 'diagram',
    heroExploreTarget: 'directions',
    heroExploreLabel: 'Explore directions',
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
      summary: 'Build a working Agnes-powered product for one defined user and task, with traceable outputs and a reproducible comparison against a baseline.',
      officialBrief: source,
      topics: topics.map((label, index) => ({ id: `topic-${index}`, label })),
      prompts: prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: index % 2 ? 'App' : 'Web' })),
    })),
  }
}
