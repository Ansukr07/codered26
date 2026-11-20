import sources from './data/xp-robotics.json' with { type: 'json' }

const previews = [
  {
    summary: 'Build an autonomous robotic sorting system that uses a learned world model to pick up red, green and blue cubes and place each cube into the matching colored bin.',
    topics: ['World model', 'LeRobot arms', 'Sorting', 'Generalization', 'Ablation', 'Reproducibility'],
    prompts: [
      ['Can it sort by color?', ['Autonomous', 'Replanning', 'Wrong bin']],
      ['What does it predict?', ['Future state', 'Candidate actions', 'Collision risk']],
      ['How does it handle changes?', ['Layouts', 'Lighting', 'Base relocation']],
      ['Is the world model real?', ['Learned transitions', 'Action effect', 'Ablation']],
      ['What was logged?', ['Episodes', 'Predictions', 'Outcomes']],
      ['Where did it struggle?', ['Failures', 'Recovery', 'Limits']],
    ],
  },
  {
    summary: 'Build a pipeline that converts newly recorded human video demonstrations into training supervision for a humanoid sorting policy in Isaac Sim.',
    topics: ['Human video', 'Task extraction', 'Robot supervision', 'GR00T post training', 'Autonomous sorting', 'Ablation'],
    prompts: [
      ['How does it learn from video?', ['Extraction', 'Supervision', 'Provenance']],
      ['What is the pipeline?', ['Record', 'Retarget', 'Train']],
      ['Is the adaptation real?', ['Parameter updates', 'Before and after', 'Matched seeds']],
      ['Can the humanoid sort?', ['Three cubes', 'Three bins', 'No falls']],
      ['What about stability?', ['Standing', 'Balance', 'Non-fall']],
      ['What is reproducible?', ['Artifacts', 'Checkpoints', 'Analysis']],
    ],
  },
]

export function createXpRoboticsTrack(base) {
  const company = {
    ...base,
    title: 'XP Robotics',
    category: 'Physical AI / robotics & world models',
    subtitle: 'World model control and human video driven humanoid learning',
    summary: 'Build systems that learn from demonstrations: world model based robotic sorting with physical arms and human video driven humanoid skill adaptation in NVIDIA Isaac Sim.',
    cardDescription: 'Two physical AI challenges: world model based robotic sorting with LeRobot arms and human video to humanoid skill adaptation in NVIDIA Isaac Sim.',
    isMock: false,
    hasOfficialBriefs: true,
    heroMode: 'diagram',
  }
  return {
    ...company,
    problemStatements: sources.map((source, index) => {
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
        fullTitle: source.fullTitle,
        subtitle: source.subtitle,
        category: source.industry,
        summary: preview.summary,
        officialBrief: source,
        topics: preview.topics.map((label, i) => ({ id: `topic-${i}`, label })),
        prompts: preview.prompts.map(([text, answers], i) => ({ text, answers, topicId: `topic-${i}`, channel: i % 2 ? 'App' : 'Web' })),
      }
    }),
  }
}
