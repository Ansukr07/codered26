import sourceBriefs from './data/mystartupwave.json' with { type: 'json' }

// Short navigation/hero copy only. Every original requirement is retained in officialBrief.
const previews = [
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
]

export function createMyStartupWaveTrack(base) {
  const company = {
    ...base,
    title: 'MyStartupWave',
    category: 'Industry partner challenges',
    subtitle: 'Problem statements from MyStartupWave',
    summary: 'Explore MyStartupWave’s challenges in e-commerce, digital trust, logistics and quick commerce.',
    cardDescription: `${sourceBriefs.length} industry problem statements covering e-commerce, generative AI, logistics and quick commerce.`,
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
