import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import source from '../src/data/unisys.json' with { type: 'json' }
import copy from '../src/data/participant-unisys.json' with { type: 'json' }
import { tracks, getTrackRoute } from '../src/trackData.js'
import { getParticipantBrief } from '../src/participantBriefs.js'
import { getOfficialBriefSections } from '../src/officialBriefSections.js'

const owner = tracks.find(track => track.title === 'Unisys')
const numbers = Array.from({ length: 10 }, (_, index) => index + 1)
const originals = numbers.map(number => number + 2)
const groups = ['required', 'optional', 'deliverables', 'success', 'constraints', 'scope', 'resources']
const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[char])
const content = (number, group) => copy[number - 1][group].map(item => `${item.title} ${item.text}`).join(' ')
const htmlPages = await Promise.all(numbers.map(number => readFile(`dist/tracks/track-5/problems/ps-${number}/index.html`, 'utf8')))

test('only original PS3–12 are added, renumbered PS01–10 under Unisys', () => {
  assert.equal(tracks.length, 6)
  assert.deepEqual(source.map(brief => brief.number), numbers)
  assert.deepEqual(source.map(brief => brief.sourceNumber), originals)
  assert.deepEqual(copy.map(brief => brief.number), numbers)
  assert.deepEqual(copy.map(brief => brief.sourceNumber), originals)
  assert.deepEqual(owner.problemStatements.map(brief => Number(brief.problemNumber)), numbers)
  assert.equal(Boolean(owner.hasPendingBriefs), false)
  for (const brief of owner.problemStatements) {
    const number = Number(brief.problemNumber)
    assert.equal(brief.sourceNumber, number + 2)
    assert.equal(brief.path, `/tracks/track-5/problems/ps-${number}`)
    assert.equal(getTrackRoute(brief.page).brief, brief)
    assert.equal(getParticipantBrief(number, 'unisys').problem, copy[number - 1].problem)
    assert.equal(brief.isMock, false)
  }
})

test('the source archive is preserved and each selected paragraph range belongs to its original PS', async () => {
  const bytes = await readFile(`public${source[0].source.href}`)
  const hash = createHash('sha256').update(bytes).digest('hex')
  assert.equal(createHash('sha256').update(await readFile(`dist${source[0].source.href}`)).digest('hex'), hash)
  for (const brief of source) {
    assert.equal(brief.source.sha256, hash)
    assert(brief.paragraphs[0].text.startsWith(`Problem Statement ${brief.sourceNumber}: `))
    assert.equal(brief.paragraphs.filter(paragraph => /^Problem Statement \d+:/.test(paragraph.text)).length, 1)
    assert(brief.paragraphs.every((paragraph, index, array) => index === 0 || paragraph.index > array[index - 1].index))
  }
})

test('every participant item and actual sidebar target renders without empty or invented sections', () => {
  for (const [index, brief] of copy.entries()) {
    const html = htmlPages[index]
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
    assert(html.includes(escape(source[index].fullTitle)), `PS${brief.number}: full source title`)
    for (const field of ['problem', 'audience', 'outcome', 'workflow']) assert(html.includes(escape(brief[field])), `PS${brief.number}: ${field}`)
    for (const group of groups) for (const item of brief[group]) {
      assert(html.includes(escape(item.title)), `PS${brief.number}: ${item.title}`)
      assert(html.includes(escape(item.text)), `PS${brief.number}: ${group} content`)
    }
    const sections = getOfficialBriefSections(owner.problemStatements[index])
    for (const [id] of sections) {
      assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `PS${brief.number}: ${id}`)
      assert(html.includes(`href="#${id}"`), `PS${brief.number}: sidebar ${id}`)
    }
    for (const [group, id] of [['deliverables', 'deliverables'], ['success', 'judging'], ['resources', 'terms']]) {
      if (!brief[group].length) assert(!html.includes(`id="${id}"`), `PS${brief.number}: empty ${group}`)
    }
    if (!brief.optional.length) assert(!html.includes('>Optional ideas<'), `PS${brief.number}: empty optional lane`)
    if (!brief.constraints.length) assert(!html.includes('>Technical &amp; safety requirements<'), `PS${brief.number}: empty constraint lane`)
    assert(!html.includes('AI-Driven Legacy Application Modernization'))
    assert(!html.includes('AI-Powered Coding Assistant for Legacy Programming Languages'))
    assert(!html.includes('download='))
  }
})

test('important project requirements and alternatives remain explicit', () => {
  assert.match(content(1, 'required'), /Neo4j.*dynamically retrieve/)
  assert.match(content(1, 'required'), /programs, functions, variables/)
  assert.match(content(1, 'required'), /upstream and downstream/)
  assert.match(content(2, 'required'), /Selecting source code should highlight/)
  assert.match(content(2, 'required'), /Java, Python, COBOL and FORTRAN.*one programming language/)
  assert.match(content(2, 'required'), /SVG, PNG or interactive HTML/)
  assert.match(content(3, 'required'), /limited and incomplete/)
  assert.match(content(3, 'required'), /confidence for every assessment/i)
  assert.match(content(4, 'required'), /5–20 programs/)
  assert.match(content(4, 'required'), /production rule, alternative and semantic feature/)
  assert.match(content(4, 'required'), /provided reference parser/)
  assert.match(content(4, 'required'), /avoid near-duplicates/)
  assert.match(content(5, 'required'), /statistically meaningful score per construct/)
  assert.match(content(5, 'required'), /executable tests or validator-based property checks/)
  assert.match(content(5, 'deliverables'), /one command/)
  assert.match(content(6, 'resources'), /Qiskit or Google Cirq/)
  assert.match(content(6, 'resources'), /Qiskit Aer.*or IBM Quantum/)
  assert.match(content(7, 'required'), /QSVM, HQNN, QAE or QAOA.*not a requirement to implement all four/)
  assert.match(content(7, 'scope'), /does not set a mandatory dataset size/)
  assert.match(content(8, 'required'), /PDFs, Word documents, presentations, OneNote pages, videos, transcripts and sample programs/)
  assert.match(content(8, 'required'), /3 weeks.*3 hours.*not a fixed schedule/)
  assert.match(content(8, 'required'), /assessments and spaced repetition/)
  assert.deepEqual(copy[7].deliverables, [])
  assert.deepEqual(copy[7].success, [])
  assert.match(content(9, 'optional'), /digital twin.*optional/i)
  assert.match(copy[8].problem, /2\.5 hours.*12%.*not mandatory targets/)
  assert.match(content(9, 'scope'), /plain LLM wrapper will not score highly/)
  assert.match(content(10, 'required'), /text or voice.*Wearable signals are optional/)
  assert.match(content(10, 'required'), /never replace clinical diagnosis/)
  assert.match(content(10, 'deliverables'), /sensitivity, specificity and false-negative analysis/)
  assert.match(content(10, 'deliverables'), /emergency flow for self-harm indicators/)
  assert.match(content(10, 'deliverables'), /HIPAA, GDPR and India’s DPDP/)
  assert.match(content(10, 'resources'), /FHIR\/HL7/)
})

test('source judging weights are preserved and the missing ten percent is disclosed', () => {
  const weights = number => copy[number - 1].success.map(item => Number(item.title.match(/(\d+)%/)?.[1]))
  assert.deepEqual(weights(1), [25, 25, 20, 15, 15])
  assert.deepEqual(weights(2), [30, 25, 20, 15, 10])
  assert.deepEqual(weights(9), [15, 20, 25, 20, 10, 10])
  assert.deepEqual(weights(10), [20, 20, 20, 15, 15])
  assert.match(copy[9].evaluationNote, /90%.*10% is not specified/)
  assert(htmlPages[9].includes(escape(copy[9].evaluationNote)))
})

test('the Unisys index and main Tracks card link to the new ten-PS selection', async () => {
  const index = await readFile('dist/tracks/track-5/problems/index.html', 'utf8')
  for (const number of numbers) assert(index.includes(`href="/tracks/track-5/problems/ps-${number}"`))
  assert(index.includes('<strong>10</strong>'))
  assert(!index.includes('ps-empty'))
  assert(!index.includes('Challenges TBA'))
  const tracksPage = await readFile('dist/tracks/index.html', 'utf8')
  assert(tracksPage.includes('Ten challenges in enterprise software'))
})
