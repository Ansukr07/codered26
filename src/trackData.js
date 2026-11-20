import { createMyStartupWaveTrack } from './myStartupWaveTrack.js'
import { createThinkRoboticsTrack } from './thinkRoboticsTrack.js'
import { createAgnesAITrack } from './agnesAITrack.js'
import { createCassetteLabsTrack } from './cassetteLabsTrack.js'
import { createSahasranshuTrack } from './sahasranshuTrack.js'
import { createNiveusTrack } from './niveusTrack.js'
import { createUnisysTrack } from './unisysTrack.js'
import { createXpRoboticsTrack } from './xpRoboticsTrack.js'
import { createGalentTrack } from './galentTrack.js'

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
    category: 'Challenges TBA',
    subtitle: 'Challenges to be announced',
    summary: 'Challenge details will be announced soon.',
    cardDescription: 'Challenges will be announced soon.',
    hasPendingBriefs: true,
  }
}

const niveus = createNiveusTrack(createTrackBase({
  title: 'Niveus Solutions', slug: 'track-1', page: 'tracks/track-1', numeral: '01', briefOwner: 'niveus',
}))
const simpleEnergy = pendingTrack(createTrackBase({
  title: 'Simple Energy', slug: 'track-2', page: 'tracks/track-2', numeral: '02',
}))
const agnesAI = createAgnesAITrack(createTrackBase({
  title: 'Agnes AI', slug: 'track-3', page: 'tracks/track-3', numeral: '03', briefOwner: 'agnes-ai',
}))
const xpRobotics = createXpRoboticsTrack(createTrackBase({
  title: 'XP Robotics', slug: 'track-4', page: 'tracks/track-4', numeral: '04', briefOwner: 'xp-robotics',
}))
const unisys = createUnisysTrack({
  ...createTrackBase({ title: 'Unisys', slug: 'track-5', page: 'tracks/track-5', numeral: '05', briefOwner: 'unisys' }),
  selectionNotice: 'Participants who choose this problem statement will be required to sign a non-disclosure agreement (NDA). Unisys will own all intellectual property rights to the project, and participants may not pursue or continue the project after the event.',
})
const startup = createTrackBase({
  title: 'Startup Track', slug: 'track-6', page: 'tracks/track-6', numeral: '06',
  category: 'Startup company challenges',
  subtitle: 'Explore the startup company tracks',
  summary: 'Choose a startup company to explore its challenges.',
  cardDescription: 'Explore Think Robotics, MyStartupWave, Sahasranshu Technologies, Cassette Labs and Galent.',
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
  ['Sahasranshu Technologies', 'sahasranshu-technologies', createSahasranshuTrack],
  ['Cassette Labs', 'cassette-labs', createCassetteLabsTrack],
  ['Galent', 'galent', createGalentTrack],
].map(([title, slug, createTrack], index) => createTrack(createTrackBase({
  title, slug, page: `${startup.page}/${slug}`,
  numeral: String(index + 1).padStart(2, '0'),
  startupParent,
  briefOwner: slug,
})))

export const tracks = [niveus, simpleEnergy, agnesAI, xpRobotics, unisys, startup]
export const allTracks = tracks.flatMap(track => [track, ...(track.subtracks || [])])
export const getTrackByPage = page => allTracks.find(track => track.page === page)

export const trackRoutes = allTracks.flatMap(track => [
  { page: track.page, path: track.path, kind: 'overview', track, brief: track },
  { page: track.problemsPage, path: track.problemsPath, kind: 'problems', track },
  ...track.problemStatements.map(brief => ({ page: brief.page, path: brief.path, kind: 'brief', track, brief })),
])
export const getTrackRoute = page => trackRoutes.find(route => route.page === page)
