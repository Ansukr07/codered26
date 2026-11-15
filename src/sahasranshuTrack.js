import sources from './data/sahasranshu.json' with { type: 'json' }

const topics = ['LiDAR tracking', 'Sensor fusion', 'Orbital prediction', 'Anomaly detection', 'Autonomous surveillance', 'Command platform']
const prompts = [
  ['What objects are in orbit?', ['LiDAR ranging', 'Sensor fusion', 'Catalogues']],
  ['Where will it be next?', ['Trajectory', 'Close approach', 'Uncertainty']],
  ['Any unusual movement?', ['Anomalies', 'Deviations', 'Proximity']],
  ['What needs watching?', ['Scheduling', 'Priority', 'Association']],
  ['Is there a collision risk?', ['Risk score', 'Alerts', 'Explanation']],
  ['Show me the big picture', ['Situational awareness', 'Visual analytics', 'Decision support']],
]

export function createSahasranshuTrack(base) {
  const company = {
    ...base,
    title: 'Sahasranshu Technologies',
    category: 'Space tech & AI-ML',
    subtitle: 'AI/ML-powered Space Domain Awareness for Low Earth Orbit',
    summary: 'Build an indigenous Space Domain Awareness platform that detects, tracks and predicts orbital objects using LiDAR, radar, optical sensors and AI/ML.',
    cardDescription: 'Build an AI/ML-powered Space Domain Awareness platform with LiDAR-based tracking, sensor fusion and predictive orbital intelligence.',
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
      summary: 'Build an AI/ML-powered Space Domain Awareness platform that tracks orbital objects with LiDAR and predicts collision risks with quantified uncertainty.',
      officialBrief: source,
      topics: topics.map((label, index) => ({ id: `topic-${index}`, label })),
      prompts: prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: index % 2 ? 'App' : 'Web' })),
    })),
  }
}
