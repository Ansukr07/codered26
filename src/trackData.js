import { problemStatementMocks } from './problemStatementMocks.js'
import { createMyStartupWaveTrack } from './myStartupWaveTrack.js'
import { createThinkRoboticsTrack } from './thinkRoboticsTrack.js'
import { createAgnesAITrack } from './agnesAITrack.js'

// Demonstration content only. Replace these records when official briefs arrive.
const mockTracks = [
  {
    title: 'Everyday AI',
    category: 'AI & automation',
    subtitle: 'Less busywork. More possibility.',
    summary: 'Turn complicated everyday tasks into clear, useful next steps with thoughtful AI tools that people can understand and control.',
    cardDescription: 'A mock brief exploring useful, accessible AI for everyday tasks.',
    problem: 'People spend time searching through scattered information, repeating routine tasks and trying to understand unfamiliar documents. For this sample challenge, imagine an assistant that helps someone complete one everyday task with less effort. Start with a specific user and situation, show where the information comes from, and let the user review important decisions. A small, reliable workflow is more useful than a chatbot that promises to do everything.',
    topics: [
      { label: 'Learning' },
      { label: 'Documents' },
      { label: 'Accessibility' },
      { label: 'Planning' },
      { label: 'Local languages' },
      { label: 'Trusted answers' },
    ],
    prompts: [
      { text: 'Help me understand this topic.', answers: ['Plain-language notes', 'Worked example', 'Practice questions'] },
      { text: 'What does this document say?', answers: ['Key points', 'Source references', 'Next steps'] },
      { text: 'Can you read this out to me?', answers: ['Listen aloud', 'Clear navigation', 'Adjust reading speed'] },
      { text: 'Help me plan my study session.', answers: ['Set a goal', 'Break down tasks', 'Review the plan'] },
      { text: 'Explain this in my language.', answers: ['Choose language', 'Keep the meaning', 'Review translation'] },
      { text: 'Where did this answer come from?', answers: ['View sources', 'Check uncertainty', 'Give feedback'] },
    ],
    focus: [
      { title: 'A real everyday need', text: 'Choose one audience and a task they already struggle with. Make the benefit easy to demonstrate.' },
      { title: 'Human control', text: 'Keep users involved in important choices and provide a clear way to correct or undo a result.' },
      { title: 'Accessible interaction', text: 'Explore readable interfaces, voice support or language options appropriate to your chosen users.' },
      { title: 'Transparent answers', text: 'Show evidence, acknowledge uncertainty and handle missing information without inventing an answer.' },
    ],
    ideas: [
      'A study companion that turns a student’s own notes into a short, source-linked revision plan.',
      'A document explainer that highlights key actions and points back to the original paragraph.',
      'A voice-first task planner with an editable checklist for people who find dense interfaces difficult.',
      'An assistant that helps a small community group find information across its own shared documents.',
    ],
  },
  {
    title: 'Connected Cities',
    category: 'Cities & connected systems',
    subtitle: 'Make the everyday city work better.',
    summary: 'Connect people, places and timely information to make shared urban spaces easier to navigate, maintain and improve.',
    cardDescription: 'A mock brief exploring practical technology for better shared spaces.',
    problem: 'A city works through thousands of small decisions: which route to take, where a service is available and who should respond when something breaks. Information is often scattered or out of date. For this sample challenge, choose a campus, neighbourhood or public-space scenario and design a system that makes one of these decisions easier. Use simulated or consented data, account for unreliable connectivity, and make the status of reports or sensor readings clear.',
    topics: [
      { label: 'Mobility' },
      { label: 'Public spaces' },
      { label: 'Water systems' },
      { label: 'Issue reports' },
      { label: 'Sensors' },
      { label: 'Local services' },
    ],
    prompts: [
      { text: 'Which route is easier to take?', answers: ['Compare routes', 'Access information', 'Last updated'] },
      { text: 'Is this shared space available?', answers: ['Current status', 'Available facilities', 'Report a change'] },
      { text: 'Where might water be leaking?', answers: ['Sensor reading', 'Location estimate', 'Review alert'] },
      { text: 'Has this issue been resolved?', answers: ['Report received', 'Assigned team', 'Latest update'] },
      { text: 'When was this sensor checked?', answers: ['Reading history', 'Device health', 'Maintenance note'] },
      { text: 'What services are near me?', answers: ['Nearby options', 'Opening information', 'Get directions'] },
    ],
    focus: [
      { title: 'Useful local information', text: 'Bring a small set of relevant services or observations together with visible update times.' },
      { title: 'Connected observations', text: 'Explore sensors or simulated data streams, including how readings are validated and missing data is shown.' },
      { title: 'A complete response loop', text: 'Follow a report from submission through acknowledgement, action and a clear resolution.' },
      { title: 'Resilient access', text: 'Design for small screens, limited connectivity and the different access needs of people using a shared space.' },
    ],
    ideas: [
      'A campus accessibility map that lets people report steps, blocked paths and changing entrance access.',
      'A maintenance board that groups duplicate reports and shows who is following up.',
      'A simulated water-monitoring dashboard that flags unusual readings without presenting them as confirmed leaks.',
      'A neighbourhood directory that helps residents find nearby facilities and suggest corrections.',
    ],
  },
  {
    title: 'Care for All',
    category: 'Wellbeing & inclusion',
    subtitle: 'Thoughtful technology. More accessible care.',
    summary: 'Help people organise everyday wellbeing needs and reach useful support through clear, inclusive digital experiences.',
    cardDescription: 'A mock brief exploring inclusive tools for wellbeing and care coordination.',
    problem: 'People and caregivers often juggle appointments, information and everyday support across different tools. Complicated interfaces can make that coordination harder. For this sample challenge, focus on an organisational or accessibility problem around wellbeing rather than diagnosis or treatment. Use fictional records for the demo, minimise the information collected and make sharing choices visible. Build something that helps a person prepare, keep track or connect with support while preserving their control.',
    topics: [
      { label: 'Appointments' },
      { label: 'Care coordination' },
      { label: 'Accessible tools' },
      { label: 'Daily routines' },
      { label: 'Support networks' },
      { label: 'Privacy' },
    ],
    prompts: [
      { text: 'What should I prepare for my visit?', answers: ['Personal checklist', 'Questions to ask', 'Visit details'] },
      { text: 'Who is helping with this task?', answers: ['Shared checklist', 'Assigned helper', 'Recent update'] },
      { text: 'Can I make this easier to read?', answers: ['Larger text', 'Plain language', 'Listen to content'] },
      { text: 'What is on my routine today?', answers: ['My checklist', 'Optional reminder', 'Mark complete'] },
      { text: 'How can I reach my support group?', answers: ['Saved contacts', 'Contact preferences', 'Share an update'] },
      { text: 'Who can see my information?', answers: ['Sharing settings', 'Access summary', 'Remove access'] },
    ],
    focus: [
      { title: 'Less coordination friction', text: 'Make appointments, preparation or shared responsibilities easier to understand and organise.' },
      { title: 'Inclusive by design', text: 'Consider readable type, understandable language and interaction patterns for a broad range of abilities.' },
      { title: 'Privacy and consent', text: 'Use only the information the task needs and make access, sharing and removal choices understandable.' },
      { title: 'Supportive boundaries', text: 'Keep the prototype focused on organisation and support, with clear limits on what it can do.' },
    ],
    ideas: [
      'An appointment preparation tool that turns a person’s own questions into an editable visit checklist.',
      'A family coordination board using fictional data to demonstrate task ownership and permission controls.',
      'An accessible daily-routine planner with optional reminders and a calm, readable interface.',
      'A community support directory with clear contact preferences and easy-to-correct information.',
    ],
  },
  {
    title: 'Simple Energy',
    category: 'Sustainability & resources',
    subtitle: 'Use less. Keep value in circulation.',
    summary: 'Help communities understand resource use, prevent avoidable waste and give everyday materials a useful next life.',
    cardDescription: 'A mock brief exploring waste reduction, reuse and resource awareness.',
    problem: 'Useful materials often become waste because people cannot see what is available, who needs it or what to do next. Resource use can be difficult to understand without a clear local picture. For this sample challenge, choose a campus or community workflow involving repair, reuse, sharing or resource awareness. Demonstrate a practical action, show where any estimate comes from, and distinguish measured information from assumptions. Keep the solution small enough to test with a believable local example.',
    topics: [
      { label: 'Reuse' },
      { label: 'Repair' },
      { label: 'Food sharing' },
      { label: 'Waste sorting' },
      { label: 'Resource use' },
      { label: 'Community action' },
    ],
    prompts: [
      { text: 'Could someone else use this item?', answers: ['Item condition', 'Local requests', 'Arrange a handover'] },
      { text: 'Can this be repaired instead?', answers: ['Describe the issue', 'Repair resources', 'Record the outcome'] },
      { text: 'How can surplus food be coordinated?', answers: ['Availability window', 'Pickup plan', 'Handling information'] },
      { text: 'Where does this material belong?', answers: ['Material category', 'Local guidance', 'Check the source'] },
      { text: 'What changed in our resource use?', answers: ['Compare readings', 'View assumptions', 'Explore next steps'] },
      { text: 'What can our group do together?', answers: ['Choose an activity', 'Coordinate tasks', 'Track participation'] },
    ],
    focus: [
      { title: 'Prevent avoidable waste', text: 'Find a specific point where clearer information or a better handover can keep materials useful.' },
      { title: 'Make reuse practical', text: 'Account for condition, availability, collection and what happens when a match falls through.' },
      { title: 'Explain the evidence', text: 'Label estimates and assumptions clearly so users can understand any resource or impact claim.' },
      { title: 'Enable community habits', text: 'Design a simple workflow that people can repeat and maintain after the first demonstration.' },
    ],
    ideas: [
      'A campus exchange for reusable event materials, with condition notes and a handover checklist.',
      'A repair log that helps a student club coordinate tools, volunteers and items awaiting attention.',
      'A fictional surplus-food coordination board with availability windows and handling notes.',
      'A resource-use dashboard that compares sample readings and clearly labels its assumptions.',
    ],
  },
];

const companyTracks = mockTracks.map((track, index) => {
  const base = {
  ...track,
  topics: track.topics.map((topic, topicIndex) => ({ ...topic, id: `topic-${topicIndex}` })),
  prompts: track.prompts.map((prompt, promptIndex) => ({
    ...prompt,
    topicId: `topic-${promptIndex}`,
    channel: ['Web', 'Voice', 'SMS', 'App', 'Chat', 'Web'][promptIndex],
  })),
  slug: `track-${index + 1}`,
  page: `tracks/track-${index + 1}`,
  path: `/tracks/track-${index + 1}`,
  problemsPage: `tracks/track-${index + 1}/problems`,
  problemsPath: `/tracks/track-${index + 1}/problems`,
  numeral: String(index + 1).padStart(2, '0'),
  isMock: true,
  resources: [
    { name: 'Participation FAQ', note: 'Read the current event answers about eligibility, teams and participation.', href: '/faq' },
    { name: 'Event schedule', note: 'See the event’s published rounds and important dates.', href: '/schedule' },
    { name: 'All tracks', note: 'Return to the track overview and explore the other sample briefs.', href: '/tracks' },
  ],
  }
  if (index === 0) return createMyStartupWaveTrack(base)
  if (index === 1) return createThinkRoboticsTrack(base)
  if (index === 2) return createAgnesAITrack(base)
  if (index === 3) {
    const pendingTrack = {
      ...base,
      category: 'Problem statements TBA',
      subtitle: 'TBA',
      summary: 'Problem statement details will be announced soon.',
      cardDescription: 'Problem statements TBA.',
      problem: 'TBA',
      hasPendingBriefs: true,
    }
    return { ...pendingTrack, problemStatements: Array.from({ length: 4 }, (_, problemIndex) => ({
      ...pendingTrack,
      id: `ps-${problemIndex + 1}`,
      page: `${base.problemsPage}/ps-${problemIndex + 1}`,
      path: `${base.problemsPath}/ps-${problemIndex + 1}`,
      parentTrackPage: base.page,
      parentTrackTitle: base.title,
      problemNumber: String(problemIndex + 1).padStart(2, '0'),
      title: 'TBA',
      summary: 'Problem statement details will be announced soon.',
      isPending: true,
    })) }
  }
  return { ...base, problemStatements: (problemStatementMocks[index] || []).map(([title, summary, problem], problemIndex) => ({
    ...base,
    id: `ps-${problemIndex + 1}`,
    page: `${base.problemsPage}/ps-${problemIndex + 1}`,
    path: `${base.problemsPath}/ps-${problemIndex + 1}`,
    parentTrackPage: base.page,
    parentTrackTitle: base.title,
    problemNumber: String(problemIndex + 1).padStart(2, '0'),
    title, summary, problem,
    subtitle: summary,
    focus: [
      { title: 'Core experience', text: summary },
      { title: 'Reliable information', text: 'Use fictional or consented sample data. Show the source, update time and any missing information clearly.' },
      { title: 'Accessible interaction', text: 'Make the main workflow readable, easy to navigate and usable on a small screen.' },
      { title: 'A complete demonstration', text: 'Show the workflow from the first action to a useful outcome, including a way to review or correct mistakes.' },
    ],
    ideas: [
      `A working prototype for ${title.toLowerCase()} that demonstrates one complete journey with sample data.`,
      'An accessible mobile experience that lets a user review and correct the information they submit.',
      'A simple status or history view that explains what happened and what the user can do next.',
    ],
  })) }
});

// Display order can change without breaking published company and brief URLs.
const trackOrder = ['Simple Energy', 'Agnes AI', 'MyStartupWave', 'Think Robotics'];
export const tracks = trackOrder.map((title, index) => {
  const track = companyTracks.find(item => item.title === title);
  const numeral = String(index + 1).padStart(2, '0');
  return {
    ...track,
    numeral,
    problemStatements: track.problemStatements.map(brief => ({ ...brief, numeral })),
  };
});

export const getTrackByPage = (page) => tracks.find((track) => track.page === page);

export const trackRoutes = tracks.flatMap(track => [
  { page: track.page, path: track.path, kind: 'overview', track, brief: track },
  { page: track.problemsPage, path: track.problemsPath, kind: 'problems', track },
  ...track.problemStatements.map(brief => ({ page: brief.page, path: brief.path, kind: 'brief', track, brief })),
]);
export const getTrackRoute = page => trackRoutes.find(route => route.page === page);
