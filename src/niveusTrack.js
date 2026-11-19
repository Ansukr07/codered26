import sources from './data/niveus.json' with { type: 'json' }

const demos = {
  1: {
    topics: ['Legacy code', 'Business rules', 'Source traceability', 'Executable tests', 'Output parity', 'Human review'],
    prompts: [
      ['What does this legacy module do?', ['Source lines', 'Business rules', 'Review notes']],
      ['Does the translation preserve behaviour?', ['Same inputs', 'Output comparison', 'Failed cases']],
      ['Which tests capture the original behaviour?', ['Characterization tests', 'Coverage', 'Pass rate']],
      ['Can we move this stored procedure?', ['Sample database', 'Query results', 'Parity check']],
      ['What changed after this repair?', ['Test failure', 'Revised output', 'Run history']],
      ['Can I reproduce this result?', ['Baseline', 'Evaluation script', 'Time and cost']],
    ],
    summary: 'Use Gemini to understand, translate or test a legacy module, with source-line traceability and executable checks against a baseline.',
  },
  2: {
    topics: ['Incident alerts', 'Logs & traces', 'Root cause', 'Recent changes', 'Human approval', 'Fault scenarios'],
    prompts: [
      ['Which service caused this incident?', ['Faulty service', 'Telemetry evidence', 'Confidence']],
      ['Which alerts share the same cause?', ['Related signals', 'Incident group', 'Noise reduction']],
      ['Did a recent change trigger the fault?', ['Deployment', 'Configuration', 'Timeline']],
      ['What does the evidence actually support?', ['Log lines', 'Metric windows', 'Trace spans']],
      ['Should this proposed action run?', ['Human approval', 'Dry run', 'Read-only default']],
      ['How does this compare with the baseline?', ['Known faults', 'Diagnosis time', 'Missed scenarios']],
    ],
    summary: 'Use Gemini to investigate reproducible microservices incidents, cite the telemetry behind each diagnosis and keep people in control of system changes.',
  },
}

export function createNiveusTrack(base) {
  const company = {
    ...base,
    category: 'Gemini AI & Google Cloud',
    subtitle: 'Verified modernization and evidence-backed incident investigation',
    summary: 'Explore two NTT DATA Google Cloud Business Unit challenges: verified modernization of legacy code and evidence-backed investigation of cloud-native incidents.',
    cardDescription: 'Two Gemini-powered challenges: modernize legacy code with executable verification, or investigate cloud-native incidents with cited evidence and human oversight.',
    isMock: false,
    hasOfficialBriefs: true,
    heroMode: 'diagram',
    heroExploreTarget: 'directions',
    heroExploreLabel: 'Explore directions',
    hasSuggestedDirections: true,
  }
  return {
    ...company,
    problemStatements: sources.map(source => {
      const demo = demos[source.number]
      return {
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
        summary: demo.summary,
        autoCardHeading: true,
        officialBrief: source,
        topics: demo.topics.map((label, index) => ({ id: `topic-${index}`, label })),
        prompts: demo.prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: 'Web' })),
      }
    }),
  }
}
