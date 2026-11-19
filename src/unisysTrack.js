import sources from './data/unisys.json' with { type: 'json' }

const previews = [
  {
    category: 'Knowledge graphs & enterprise applications',
    subtitle: 'Explore complex relationships without writing graph queries.',
    summary: 'Build an AI-assisted Neo4j visualization platform with natural-language exploration, multiple abstraction levels and upstream/downstream impact analysis.',
    topics: ['Neo4j', 'Natural language', 'Graph navigation', 'Abstraction levels', 'AI insights', 'Change impact'],
    questions: ['Which programs depend on this COBOL module?', 'Which rules relate to this database table?', 'What changes if I modify this field?', 'Can I drill down to this variable?', 'Which relationships should I expand?', 'What does this dependency mean?'],
  },
  {
    category: 'Code visualization & software engineering',
    subtitle: 'Turn source code into an interactive application map.',
    summary: 'Automatically visualize architecture, dependencies and execution workflows, with source-linked navigation, AI-assisted questions and extensible language support.',
    topics: ['Architecture', 'Call graphs', 'Data flow', 'Source navigation', 'AI exploration', 'Export'],
    questions: ['Show the customer-transaction workflow.', 'Which modules depend on this function?', 'How does data reach the database?', 'Where is this diagram component in the code?', 'What does this COBOL program depend on?', 'Can I export this view for review?'],
  },
  {
    category: 'Quantum readiness & supply-chain security',
    subtitle: 'Find the weak links in a supplier network.',
    summary: 'Assess and rank supplier quantum-readiness using incomplete information, confidence for every assessment and a clear view of downstream risks.',
    topics: ['Partner readiness', 'Record lifetime', 'Risk ranking', 'Confidence', 'Network view', 'Upgrade priorities'],
    questions: ['Which partners still use vulnerable cryptography?', 'How long must these records stay trustworthy?', 'Which suppliers should upgrade first?', 'How much evidence supports this assessment?', 'Who depends on this lagging supplier?', 'Who is affected when we upgrade?'],
  },
  {
    title: 'GrammaForge',
    category: 'Synthetic data & proprietary-language models',
    subtitle: 'Grammar-guided synthetic data for proprietary languages.',
    summary: 'Turn a grammar, semantic rules and 5–20 seed programs into diverse instruction–response training pairs with full grammar coverage and reference-parser verification.',
    topics: ['Formal grammar', 'Seed programs', 'Semantic rules', 'Parser checks', 'Coverage', 'Data diversity'],
    questions: ['Which grammar constructs are covered?', 'How do these examples match the seed programs?', 'Does this response follow the semantic rules?', 'Does the reference parser accept this program?', 'Which production alternatives need more examples?', 'Are these generated pairs near-duplicates?'],
  },
  {
    title: 'BenchForge',
    category: 'Code-model evaluation & language engineering',
    subtitle: 'A contamination-resistant benchmark for proprietary-language code models.',
    summary: 'Generate a reproducible instruction-to-code benchmark with full grammar coverage, verified reference solutions, varied difficulty and automatic model-output scoring.',
    topics: ['Grammar coverage', 'Task generation', 'Verified answers', 'Difficulty', 'Scoring harness', 'Reproducibility'],
    questions: ['Does this benchmark cover every construct?', 'Is this instruction unambiguous?', 'Has the reference solution been verified?', 'Does the task combine several constructs?', 'How does this model output score?', 'Can I regenerate the benchmark with one command?'],
  },
  {
    category: 'Quantum computing & cryptography',
    subtitle: 'Factor small composites and demonstrate a scaled-down RSA break.',
    summary: 'Implement Shor’s Algorithm to recover the factors of small composite numbers and demonstrate the recovered secret in a scaled-down RSA system.',
    topics: ['Small composites', 'Quantum gates', 'QFT', 'Shor’s Algorithm', 'RSA factors', 'Simulator'],
    questions: ['Which small composite are we factoring?', 'How is the quantum circuit constructed?', 'Where does the Fourier transform fit?', 'What factors did the algorithm recover?', 'How do the factors reveal the RSA secret?', 'Can the example run in a local simulator?'],
  },
  {
    category: 'Quantum machine learning & fraud detection',
    subtitle: 'Detect transaction anomalies with a hybrid quantum-classical approach.',
    summary: 'Combine classical feature reduction with a selected quantum method to detect fraud in imbalanced transaction data, and report comparative performance and circuit diagnostics.',
    topics: ['Transaction data', 'Feature reduction', 'Quantum method', 'Fraud anomalies', 'Circuit diagnostics', 'Performance'],
    questions: ['Which transaction patterns look unusual?', 'How are the feature dimensions reduced?', 'Which quantum method is being used?', 'How does the model handle rare fraud cases?', 'What do the circuit diagnostics show?', 'How does the hybrid approach compare?'],
  },
  {
    category: 'AI & adaptive engineering training',
    subtitle: 'Build the right learning path for the time available.',
    summary: 'Organize scattered training materials into a self-paced plan with prerequisites, exercises, duration estimates, time constraints, assessments and spaced repetition.',
    topics: ['Learning materials', 'Concept structure', 'Prerequisites', 'Time constraints', 'Prioritization', 'Spaced repetition'],
    questions: ['Which concepts appear across these documents?', 'Where is the training material duplicated?', 'What should I learn before this topic?', 'Can the plan fit my available learning time?', 'Which topics are production-critical?', 'When should I review this concept again?'],
  },
  {
    category: 'Sustainability & intelligent campus operations',
    subtitle: 'Predict wastage and turn campus data into practical action.',
    summary: 'Combine occupancy, schedules, equipment use, weather and electricity data to forecast and optimize campus energy use without harming student or faculty experience.',
    topics: ['Occupancy', 'Timetables', 'Equipment use', 'Weather', 'Energy forecasts', 'Recommendations'],
    questions: ['Which rooms are using energy after scheduled use?', 'How does the timetable affect demand?', 'Where is equipment being underused?', 'How will the weather change consumption?', 'What does next week’s energy forecast show?', 'Which changes save energy without disrupting campus?'],
  },
  {
    title: 'MindMom AI',
    category: 'Maternal mental health & multimodal screening',
    subtitle: 'Early detection of postpartum depression using multimodal AI screening.',
    summary: 'Build private, continuous screening with questionnaire and text or voice signals, explainable risk trends, mother/clinician dashboards and safe clinical escalation.',
    topics: ['Questionnaires', 'Text or voice', 'Optional wearables', 'Risk trends', 'Clinical review', 'Privacy & consent'],
    questions: ['How do questionnaire and check-in signals combine?', 'What does this text or voice check-in contribute?', 'Are optional wearable signals available?', 'Why did the screening risk trend change?', 'What information reaches the reviewing clinician?', 'How are consent and sensitive information handled?'],
  },
]

export function createUnisysTrack(base) {
  const company = {
    ...base,
    category: 'Enterprise software, quantum computing & AI',
    subtitle: 'Industry challenges',
    summary: 'Explore ten Unisys challenges in enterprise software, quantum computing, AI, sustainability and digital health.',
    cardDescription: 'Choose from 10 problem statements in AI-powered software, quantum computing, smart campuses and digital health.',
    isMock: false,
    hasOfficialBriefs: true,
    heroMode: 'diagram',
  }
  return {
    ...company,
    problemStatements: sources.map(source => {
      const preview = previews[source.number - 1]
      return {
        ...company,
        id: `ps-${source.number}`,
        page: `${base.problemsPage}/ps-${source.number}`,
        path: `${base.problemsPath}/ps-${source.number}`,
        parentTrackPage: base.page,
        parentTrackTitle: company.title,
        problemNumber: String(source.number).padStart(2, '0'),
        sourceNumber: source.sourceNumber,
        title: preview.title || source.title,
        fullTitle: source.fullTitle,
        subtitle: preview.subtitle,
        category: preview.category,
        summary: preview.summary,
        autoCardHeading: true,
        officialBrief: source,
        topics: preview.topics.map((label, index) => ({ id: `topic-${index}`, label })),
        prompts: preview.questions.map((text, index) => ({ text, answers: [preview.topics[index], preview.topics[(index + 1) % 6]], topicId: `topic-${index}`, channel: 'Web' })),
      }
    }),
  }
}
