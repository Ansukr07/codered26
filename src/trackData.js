import { createMyStartupWaveTrack } from './myStartupWaveTrack.js'
import { createThinkRoboticsTrack } from './thinkRoboticsTrack.js'
import { createAgnesAITrack } from './agnesAITrack.js'

function createTrackBase({ title, slug, page, numeral, ...details }) {
  return {
    title,
    slug,
    page,
    path: `/${page}`,
    problemsPage: `${page}/problems`,
    problemsPath: `/${page}/problems`,
    numeral,
    isMock: false,
    problemStatements: [],
    resources: [],
    ...details,
  }
}

function pendingTrack(base) {
  return {
    ...base,
    category: 'Problem statements TBA',
    subtitle: 'Problem statements to be announced',
    summary: 'Problem statement details will be announced soon.',
    cardDescription: 'Problem statements will be announced soon.',
    hasPendingBriefs: true,
  }
}

const niveus = pendingTrack(createTrackBase({
  title: 'Niveus Solutions', slug: 'track-1', page: 'tracks/track-1', numeral: '01',
}))
const simpleEnergy = pendingTrack(createTrackBase({
  title: 'Simple Energy', slug: 'track-2', page: 'tracks/track-2', numeral: '02',
}))
const agnesAI = createAgnesAITrack(createTrackBase({
  title: 'Agnes AI', slug: 'track-3', page: 'tracks/track-3', numeral: '03', briefOwner: 'agnes-ai',
}))
const startup = createTrackBase({
  title: 'Startup Track', slug: 'track-4', page: 'tracks/track-4', numeral: '04',
  category: 'Startup company challenges',
  subtitle: 'Explore the startup company tracks',
  summary: 'Choose a startup company to explore its problem statements.',
  cardDescription: 'Explore Think Robotics, MyStartupWave, Sahasranshu Technologies and Cassette Labs.',
})

// Keep a small parent identity on each company, without a circular route tree.
const startupParent = {
  title: startup.title, slug: startup.slug, numeral: startup.numeral,
  page: startup.page, path: startup.path,
  problemsPage: startup.problemsPage, problemsPath: startup.problemsPath,
}
startup.subtracks = [
  ['Think Robotics', 'think-robotics', createThinkRoboticsTrack],
  ['MyStartupWave', 'mystartupwave', createMyStartupWaveTrack],
  ['Sahasranshu Technologies', 'sahasranshu-technologies', pendingTrack],
  ['Cassette Labs', 'cassette-labs', pendingTrack],
].map(([title, slug, createTrack], index) => createTrack(createTrackBase({
  title, slug, page: `${startup.page}/${slug}`,
  numeral: String(index + 1).padStart(2, '0'),
  startupParent,
  briefOwner: slug,
})))

export const tracks = [niveus, simpleEnergy, agnesAI, startup]
export const allTracks = tracks.flatMap(track => [track, ...(track.subtracks || [])])
export const getTrackByPage = page => allTracks.find(track => track.page === page)

export const trackRoutes = allTracks.flatMap(track => [
  { page: track.page, path: track.path, kind: 'overview', track, brief: track },
  { page: track.problemsPage, path: track.problemsPath, kind: 'problems', track },
  ...track.problemStatements.map(brief => ({ page: brief.page, path: brief.path, kind: 'brief', track, brief })),
])
export const getTrackRoute = page => trackRoutes.find(route => route.page === page)
