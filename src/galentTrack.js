import sources from './data/galent.json' with { type: 'json' }

const topics = ['RAG pipeline', 'Multi-turn context', 'Semantic caching', 'Model selection', 'Cost breakdown', 'Accuracy KPI']
const prompts = [
  ['How much does a query cost?', ['LLM inference', 'Embeddings', 'Vector store']],
  ['Can it handle follow-ups?', ['Multi-turn', 'Context storing', 'Clarification']],
  ['Where do the savings come from?', ['Caching', 'Cheaper models', 'Fewer tokens']],
  ['Is the answer right?', ['Retrieval', 'Reranking', 'Accuracy']],
  ['What does the cost cover?', ['Ingestion', 'Infrastructure', 'Breakdown']],
  ['Will it scale?', ['Adoption', 'Query volume', 'Efficiency']],
]

export function createGalentTrack(base) {
  const company = {
    ...base,
    title: 'Galent',
    category: 'AI-native digital engineering',
    subtitle: 'Cost-efficient AI-powered HR assistance',
    summary: 'Build a cost-efficient, scalable AI-powered HR Assistant: RAG over assumed HR policies with multi-turn conversation, measured per-stage costs and a transparent cost breakdown.',
    cardDescription: 'Build a cost-efficient RAG-powered HR assistant with multi-turn conversation, measured per-stage costs and a transparent end-to-end cost breakdown.',
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
      summary: 'Build a cost-efficient RAG-based HR assistant that handles multi-step conversations at a minimal targeted cost, with measurable savings and a transparent end-to-end cost breakdown.',
      officialBrief: source,
      topics: topics.map((label, index) => ({ id: `topic-${index}`, label })),
      prompts: prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: index % 2 ? 'App' : 'Web' })),
    })),
  }
}
