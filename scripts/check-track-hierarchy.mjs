import assert from 'node:assert/strict'
import test from 'node:test'
import { tracks, trackRoutes, getTrackRoute } from '../src/trackData.js'
import { getParticipantBrief } from '../src/participantBriefs.js'
import msw3 from '../src/data/participant-ps3.json' with { type: 'json' }
import msw45 from '../src/data/participant-ps45.json' with { type: 'json' }
import thinkBriefs from '../src/data/participant-think-robotics.json' with { type: 'json' }
import agnesBriefs from '../src/data/participant-agnes-ai.json' with { type: 'json' }

const mainNames = ['Niveus Solutions', 'Simple Energy', 'Agnes AI', 'XP Robotics', 'Startup Track']
const companyNames = ['Think Robotics', 'MyStartupWave', 'Sahasranshu Technologies', 'Cassette Labs']
const companySlugs = ['think-robotics', 'mystartupwave', 'sahasranshu-technologies', 'cassette-labs']
const expectedParticipantCopy = new Map([
  ['Agnes AI', agnesBriefs],
  ['Think Robotics', thinkBriefs],
  ['MyStartupWave', [...msw3, ...msw45]],
])

const startup = () => tracks.find(track => track.title === 'Startup Track')
const leaves = () => tracks.flatMap(track => track.subtracks?.length ? track.subtracks : [track])

test('exactly five main tracks contain the requested startup hierarchy', () => {
  assert.deepEqual(tracks.map(track => track.title), mainNames)
  assert.deepEqual(startup().subtracks.map(track => track.title), companyNames)
  assert.deepEqual(startup().subtracks.map(track => track.slug), companySlugs)
  assert.equal(startup().problemStatements.length, 0, 'Startup Track lists companies, not invented PS')
  assert.equal(startup().subtracks.reduce((sum, track) => sum + track.problemStatements.length, 0), 3)
})

test('main track numbers, links and resolved pages agree', () => {
  for (const [index, track] of tracks.entries()) {
    const slug = `track-${index + 1}`
    const page = `tracks/${slug}`
    assert.equal(track.slug, slug)
    assert.equal(track.numeral, String(index + 1).padStart(2, '0'))
    assert.equal(track.page, page)
    assert.equal(track.path, `/${page}`)
    assert.equal(track.problemsPage, `${page}/problems`)
    assert.equal(track.problemsPath, `/${page}/problems`)
    assert.equal(getTrackRoute(track.page)?.track, track)
    assert.equal(getTrackRoute(track.problemsPage)?.track, track)
  }
})

test('each startup company stays beneath Startup Track with a resolvable return path', () => {
  for (const [index, company] of startup().subtracks.entries()) {
    const page = `tracks/track-5/${companySlugs[index]}`
    assert.equal(company.numeral, String(index + 1).padStart(2, '0'))
    assert.equal(company.page, page)
    assert.equal(company.path, `/${page}`)
    assert.equal(company.problemsPage, `${page}/problems`)
    assert.equal(company.problemsPath, `/${page}/problems`)
    assert.equal(company.startupParent.slug, startup().slug)
    assert.equal(company.startupParent.title, startup().title)
    assert.equal(company.startupParent.page, startup().page)
    assert.equal(company.startupParent.problemsPage, startup().problemsPage)
    assert.equal(getTrackRoute(company.page)?.track, company)
    assert.equal(getTrackRoute(company.problemsPage)?.track, company)
    assert.equal(getTrackRoute(company.startupParent.problemsPage)?.track, startup())
  }
})

test('unprovided company briefs remain TBA without fabricated problem statements', () => {
  const pendingNames = ['Niveus Solutions', 'Simple Energy', 'XP Robotics', 'Sahasranshu Technologies', 'Cassette Labs']
  for (const name of pendingNames) {
    const company = leaves().find(track => track.title === name)
    assert(company, `${name}: company exists`)
    assert.equal(company.hasPendingBriefs, true, `${name}: pending state`)
    assert.equal(company.isMock, false, `${name}: real company name`)
    assert.deepEqual(company.problemStatements, [], `${name}: unknown PS count is not fabricated`)
    assert.equal(trackRoutes.some(route => route.kind === 'brief' && route.track === company), false)
  }
})

test('all four supplied briefs retain the correct company, route and participant content', () => {
  let briefCount = 0
  for (const owner of leaves()) {
    const expected = expectedParticipantCopy.get(owner.title) || []
    assert.equal(owner.problemStatements.length, expected.length, `${owner.title}: supplied brief count`)
    for (const brief of owner.problemStatements) {
      const number = Number(brief.problemNumber)
      const page = `${owner.problemsPage}/ps-${number}`
      assert.equal(brief.page, page)
      assert.equal(brief.path, `/${page}`)
      assert.equal(brief.parentTrackPage, owner.page)
      assert.equal(brief.parentTrackTitle, owner.title)
      assert.equal(brief.officialBrief.company, owner.title)
      assert.equal(brief.isMock, false)
      assert.equal(Boolean(brief.isPending), false)
      assert.equal(getTrackRoute(page)?.track, owner)
      assert.equal(getTrackRoute(page)?.brief, brief)
      const copy = getParticipantBrief(number, brief.briefOwner || brief.slug)
      const original = expected.find(item => item.number === number)
      assert(copy, `${page}: participant copy resolves using its company owner`)
      assert(original, `${page}: supplied source brief exists`)
      assert.equal(copy.problem, original.problem, `${page}: company introduction is preserved`)
      assert.deepEqual(copy.required, original.required, `${page}: participant requirements are preserved`)
      briefCount++
    }
  }
  assert.equal(briefCount, 4)
})

test('route paths and page identifiers are unique and all primary routes resolve', () => {
  assert.equal(new Set(trackRoutes.map(route => route.path)).size, trackRoutes.length, 'Duplicate URL')
  assert.equal(new Set(trackRoutes.map(route => route.page)).size, trackRoutes.length, 'Duplicate page identifier')
  for (const route of trackRoutes) {
    assert.equal(route.path, `/${route.page}`)
    assert.equal(getTrackRoute(route.page), route)
    if (route.kind === 'brief') assert(route.track.problemStatements.includes(route.brief))
  }
  assert.equal(getTrackRoute('tracks/nonexistent-company/problems'), undefined)
})
