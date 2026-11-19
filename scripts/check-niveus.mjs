import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import sources from '../src/data/niveus.json' with { type: 'json' }
import copy from '../src/data/participant-niveus.json' with { type: 'json' }
import { tracks, getTrackRoute } from '../src/trackData.js'
import { getParticipantBrief } from '../src/participantBriefs.js'

const owner = tracks.find(track => track.title === 'Niveus Solutions')
const groups = ['directions', 'required', 'optional', 'deliverables', 'success', 'scope', 'constraints', 'resources']
const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[char])
const textOf = (brief, group) => brief[group].map(item => `${item.title} ${item.text}`).join(' ')
const pages = await Promise.all(copy.map(brief => readFile(`dist/tracks/track-1/problems/ps-${brief.number}/index.html`, 'utf8')))

test('Niveus exposes two real PS without changing the six-track structure', () => {
  assert.equal(tracks.length, 6)
  assert.equal(owner.hasOfficialBriefs, true)
  assert.equal(Boolean(owner.hasPendingBriefs), false)
  assert.deepEqual(owner.problemStatements.map(brief => brief.problemNumber), ['01', '02'])
  for (const [index, brief] of owner.problemStatements.entries()) {
    assert.equal(brief.title, sources[index].title)
    assert.equal(brief.briefOwner, 'niveus')
    assert.equal(brief.isMock, false)
    assert.equal(getTrackRoute(brief.page).brief, brief)
    assert.equal(getParticipantBrief(index + 1, 'niveus').problem, copy[index].problem)
  }
})

test('both original DOCX files and their complete extracted text are archived unchanged', async () => {
  for (const [index, source] of sources.entries()) {
    const bytes = await readFile(`public${source.source.href}`)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.source.sha256)
    assert.equal(createHash('sha256').update(await readFile(`dist${source.source.href}`)).digest('hex'), source.source.sha256)
    const body = source.parts.find(part => part.part === 'word/document.xml')
    assert.equal(body.paragraphs.filter(text => text.trim()).length, [114, 116][index])
    assert.equal(body.tables, 2)
    assert(source.parts.some(part => part.part === 'word/header1.xml'))
    assert(source.parts.some(part => part.part === 'word/footer1.xml'))
  }
})

test('participant pages render every curated requirement, direction, resource and sidebar section', () => {
  for (const [index, brief] of copy.entries()) {
    const html = pages[index]
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
    for (const id of ['problem', 'directions', 'focus', 'deliverables', 'judging', 'resources', 'terms', 'next']) {
      assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `PS${brief.number}: ${id}`)
      if (id !== 'next') assert(html.includes(`href="#${id}"`), `PS${brief.number}: sidebar ${id}`)
    }
    for (const field of ['problem', 'audience', 'outcome', 'workflow', 'directionsIntro']) assert(html.includes(escape(brief[field])), `PS${brief.number}: ${field}`)
    for (const group of groups) for (const item of brief[group]) {
      assert(html.includes(escape(item.title)), `PS${brief.number}: ${group} title`)
      assert(html.includes(escape(item.text)), `PS${brief.number}: ${item.title}`)
      if (item.href) assert(html.includes(`href="${item.href}"`), item.href)
    }
    assert(html.includes('href="#directions"'))
    for (const omitted of ['Submission Checklist', 'THE GUIDING PRINCIPLE', 'email@nttdata.com', '[Name]', '3–4 December', 'Important participation rules']) assert(!html.includes(omitted), `PS${brief.number}: ${omitted}`)
    assert(!html.includes('download='), 'Removed source download control must stay absent')
  }
})

test('Gemini, verification, source evidence, fair evaluation and human control remain explicit', () => {
  for (const brief of copy) {
    assert.match(textOf(brief, 'required'), /at least one Google Gemini model/)
    assert.match(textOf(brief, 'required'), /coding assistant.*does not (count|qualify)/)
    assert.match(textOf(brief, 'required'), /same.*(module|faults).*evaluation conditions/)
    assert.match(textOf(brief, 'deliverables'), /which model powers each feature/)
    assert.match(textOf(brief, 'constraints'), /HTTP 429.*bounded retries, backoff/)
    assert.match(textOf(brief, 'constraints'), /nothing confidential/)
    assert.match(textOf(brief, 'scope'), /ownership remains with participants|Participants retain project ownership/)
    assert.match(textOf(brief, 'success'), /organiser must confirm final judging rules/)
    assert.match(textOf(brief, 'constraints') + textOf(brief, 'resources'), /Finalist credits.*unconfirmed/)
  }
  assert.match(textOf(copy[0], 'required'), /at least one real legacy module/)
  assert.match(textOf(copy[0], 'required'), /source lines.*repeatable evaluation script/)
  assert.match(textOf(copy[0], 'required'), /Compilation alone does not establish behavioural equivalence/)
  assert.match(textOf(copy[0], 'deliverables'), /every run, including failures/)
  assert.match(textOf(copy[1], 'required'), /microservices application with reproducible injected faults/)
  assert.match(textOf(copy[1], 'required'), /explicit approval before any system change/)
  assert.match(textOf(copy[1], 'constraints'), /least-privilege, read-only/)
  assert.match(textOf(copy[1], 'constraints'), /Report context sizes/)
  assert.match(textOf(copy[1], 'success'), /at least 10 injected faults across at least 3 fault types; this is illustrative, not a mandatory minimum/)
  assert.deepEqual(copy.map(brief => brief.directions.length), [5, 5])
  assert.deepEqual(copy.map(brief => brief.resources.length), [5, 7])
})
