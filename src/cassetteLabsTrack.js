import sources from './data/cassette-labs.json' with { type: 'json' }

const topics = ['Call handling', 'Patient identification', 'Appointments', 'Reminders', 'Follow-up', 'Escalation']
const prompts = [
  ['Can you take my call?', ['Intent', 'Interruptions', 'Urgency check']],
  ['Are you registered with us?', ['Verification', 'New patients', 'Duplicates']],
  ['What appointment slots are open?', ['Doctor', 'Department', 'Waitlist']],
  ['What should I bring for my visit?', ['Documents', 'Preparation', 'Directions']],
  ['Where is my report?', ['Queue status', 'Bill status', 'Follow-up']],
  ['Is this an emergency?', ['Red flags', 'Triage nurse', 'Handoff']],
]

export function createCassetteLabsTrack(base) {
  const company = {
    ...base,
    title: 'Cassette Labs',
    category: 'Voice AI & hospital operations',
    subtitle: 'Voice-first AI receptionist for hospital patient journeys',
    summary: 'Give hospitals a voice-first AI receptionist that answers calls, orchestrates the end-to-end patient journey and escalates safely to hospital staff.',
    cardDescription: 'Build a voice-first AI hospital receptionist that manages patient journeys end-to-end and knows when to hand off to hospital staff.',
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
      summary: 'Build a voice-first AI hospital receptionist that handles calls, orchestrates appointments and escalates safely to hospital staff.',
      officialBrief: source,
      topics: topics.map((label, index) => ({ id: `topic-${index}`, label })),
      prompts: prompts.map(([text, answers], index) => ({ text, answers, topicId: `topic-${index}`, channel: index % 2 ? 'App' : 'Web' })),
    })),
  }
}
