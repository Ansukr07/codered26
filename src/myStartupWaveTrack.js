import sourceBriefs from './data/mystartupwave.json' with { type: 'json' }

// Short navigation/hero copy only. Every original requirement is retained in officialBrief.
const previews = [
  {
    summary: 'Analyse an existing application with generative AI, then build and benchmark a meaningfully improved version.',
    topics: ['Teardown', 'Architecture', 'User journeys', 'Improvements', 'Benchmarks', 'Traceability'],
    prompts: ['How does this application work?', 'What is the inferred architecture?', 'Which user journeys matter most?', 'What can we improve?', 'How does the upgrade compare?', 'What evidence supports this inference?'],
    answers: [['Feature map', 'User flows', 'Evidence'], ['Data model', 'API map', 'Assumptions'], ['Core tasks', 'End-to-end flow', 'Pain points'], ['Original features', 'Design decisions', 'Working build'], ['Time per task', 'Performance', 'Accessibility'], ['Observed', 'Documented', 'AI-inferred']],
  },
  {
    summary: 'Score and improve a resume for a target job, export a one-page version and generate a matching portfolio website.',
    topics: ['ATS scoring', 'Resume layout', 'Suggestions', 'Portfolio', 'Privacy', 'Exports'],
    prompts: ['How well does this resume match?', 'Can this fit on one page?', 'Which changes should I review?', 'Can I build a portfolio from this?', 'What information will be public?', 'Can I export my updated resume?'],
    answers: [['Job description', 'Score breakdown', 'Skills coverage'], ['Prioritise content', 'ATS-safe layout', 'One page'], ['Review rewrite', 'Edit suggestion', 'Keep original'], ['Resume data', 'Responsive site', 'Shareable URL'], ['Opt-in publishing', 'Contact settings', 'Delete data'], ['PDF', 'DOCX', 'Re-parse check']],
  },
  {
    summary: 'Generate e-commerce product images and listings, and assess image authenticity in one platform.',
    topics: ['Images', 'Listings', 'Authenticity', 'Provenance', 'Exports', 'Evaluation'],
    prompts: ['Can I generate a product image?', 'What should the listing include?', 'Is this image authentic or generated?', 'What provenance information is available?', 'Can I export this catalog?', 'How reliable is this detector?'],
    answers: [['Product photo', 'Text description', 'Image variants'], ['Title', 'Description', 'Specifications'], ['Confidence', 'Indicators', 'Inconclusive result'], ['Metadata', 'Source record', 'AI labels'], ['Shopify', 'WooCommerce', 'Catalog data'], ['Balanced test set', 'Transformations', 'Performance']],
  },
  {
    summary: 'Improve quick-commerce operations through a reproducible simulation and measurable gains over a baseline.',
    topics: ['Forecasting', 'Batching', 'Dispatch', 'Picking', 'Ordering', 'Simulation'],
    prompts: ['Where are orders slowing down?', 'Which orders can be batched?', 'How should riders be assigned?', 'Can we improve the picking workflow?', 'What happens when demand changes?', 'How does this compare with the baseline?'],
    answers: [['Demand', 'Inventory', 'Bottlenecks'], ['Order groups', 'Delivery windows', 'Trade-offs'], ['Rider status', 'Routes', 'ETAs'], ['Picking sequence', 'Store layout', 'Preparation time'], ['Peak demand', 'Service levels', 'Stock availability'], ['Delivery time', 'On-time rate', 'Cost per order']],
  },
  {
    summary: 'Build an AI video generation and editing platform, measuring output quality against compute, token use and cost.',
    clarifications: ['The original brief uses “less than 25%” of full-regeneration cost for a single-shot edit in section 7, and “≤ 25%” in section 10. Both source wordings are preserved here. Confirm the exact boundary with the challenge contact.'],
    topics: ['Generation', 'Editing', 'Cost meter', 'Quality', 'Safety', 'Provenance'],
    prompts: ['Can I generate a short video?', 'Can I change only this shot?', 'How much did this operation cost?', 'How does the quality compare?', 'Is this prompt safe to process?', 'How is AI-generated content labelled?'],
    answers: [['Prompt', 'Generation settings', 'Video clip'], ['Reuse work', 'Edit one shot', 'Updated timeline'], ['Compute', 'Tokens', 'Cost report'], ['Baseline', 'Temporal consistency', 'Quality metrics'], ['Prompt filtering', 'Output checks', 'User feedback'], ['AI label', 'Source assets', 'Usage record']],
  },
]

export function createMyStartupWaveTrack(base) {
  const company = {
    ...base,
    title: 'MyStartupWave',
    category: 'Industry partner challenges',
    subtitle: 'Problem statements from MyStartupWave',
    summary: 'Explore MyStartupWave’s challenges in product reinvention, career tools, e-commerce, quick commerce and AI video.',
    cardDescription: `${sourceBriefs.length} industry problem statements covering generative AI, career technology, commerce and logistics.`,
    isMock: false,
    hasOfficialBriefs: true,
    heroMode: 'diagram',
  }
  return {
    ...company,
    problemStatements: sourceBriefs.map((source, index) => {
      const preview = previews[index]
      return {
        ...company,
        id: `ps-${source.number}`,
        page: `${base.problemsPage}/ps-${source.number}`,
        path: `${base.problemsPath}/ps-${source.number}`,
        parentTrackPage: base.page,
        parentTrackTitle: company.title,
        problemNumber: String(source.number).padStart(2, '0'),
        title: source.title,
        subtitle: source.subtitle,
        category: source.industry,
        summary: preview.summary,
        officialBrief: source,
        sourceClarifications: preview.clarifications || [],
        topics: preview.topics.map((label, i) => ({ id: `topic-${i}`, label })),
        prompts: preview.prompts.map((text, i) => ({ text, topicId: `topic-${i}`, channel: ['Web', 'App', 'Chat', 'Web', 'App', 'Web'][i], answers: preview.answers[i] })),
      }
    }),
  }
}
