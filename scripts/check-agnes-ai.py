"""Check Agnes AI's open challenge, participant requirements and original source."""
import hashlib
import html as html_lib
import json
from pathlib import Path
import re
import runpy
import subprocess

from pypdf import PdfReader


# Include Think Robotics and all five MyStartupWave regressions.
existing = runpy.run_path('scripts/check-think-robotics.py')
ParticipantPage, norm = existing['ParticipantPage'], existing['norm']

briefs = json.loads(Path('src/data/participant-agnes-ai.json').read_text(encoding='utf-8-sig'))
sources = json.loads(Path('src/data/agnes-ai.json').read_text(encoding='utf-8-sig'))
assert len(briefs) == len(sources) == 1, 'Agnes AI supplies one open challenge, not four fixed PS'
brief, source = briefs[0], sources[0]
assert brief['number'] == source['number'] == 1
assert source['company'] == 'Agnes AI'
assert (source.get('fullTitle') or source['title']) == 'AI for Science and Physical AI'

page_path = Path('dist/tracks/track-2/problems/ps-1/index.html')
html = page_path.read_text(encoding='utf-8')
page = ParticipantPage()
page.feed(html)
assert page.h1s == 1
expected_ids = ['problem', 'directions', 'focus', 'deliverables', 'judging', 'resources', 'terms', 'next']
assert [item for item in page.ids if item in expected_ids] == expected_ids, 'Missing or misplaced participant section'
assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
assert not page.downloads
assert 'AI for Science and Physical AI' in html, 'Official challenge title missing'
assert 'Agnes AI PS 01' not in html, 'Open challenge is incorrectly labelled a fixed PS in metadata'
for field in ['problem', 'workflow']:
    assert page.fields[field] == norm(brief[field]), f'Missing participant {field}'

groups = ['directions', 'required', 'optional', 'deliverables', 'success', 'constraints', 'scope', 'resources']
expected_items = {
    **{f'{group}-{i}': item for group in groups for i, item in enumerate(brief[group])},
    'context-0': {'title': 'Who it helps', 'text': brief['audience']},
    'context-1': {'title': 'Your challenge', 'text': brief['outcome']},
}
assert set(page.items) == set(expected_items), 'Missing or extra participant cards'
for key, item in expected_items.items():
    assert page.items[key] == {field: norm(item[field]) for field in ['title', 'text']}, f'Incomplete card: {key}'

rendered_text = norm(' '.join(page.text))


def content(*selected):
    return norm(' '.join(
        item['title'] + ' ' + item['text']
        for group in selected for item in brief[group]
    ))


requirement_failures = []


def require(pattern, description, *selected):
    candidate = content(*selected) if selected else rendered_text
    if not re.search(pattern, candidate, re.I | re.S):
        requirement_failures.append(f'Missing source requirement: {description}')
    if not re.search(pattern, rendered_text, re.I | re.S):
        requirement_failures.append(f'Requirement not rendered: {description}')


# Independent source facts: the directions are illustrative choices, not deliverable counts.
assert [item['title'] for item in brief['directions']] == [
    'Chip Design & Verification', 'Operator Optimization',
    'Protein Synthesis Research Support', 'Disaster Response & Rescue Planning',
], 'Suggested directions changed or were treated as separate challenges'
require(r'(?:starting points|suggested directions|examples).*not fixed problem statements', 'Open challenge choice')
require(r'(?:another|other) relevant problem', 'Other relevant problems allowed')
require(r'one (?:focused|specific|defined).*problem|choose (?:one|a) (?:focused|specific|defined).*task', 'Bounded problem selection')
require(r'candidate.*(?:implementation|testbench).*simulation|(?:design|testbench).*verification tools', 'Chip design checked with tools', 'directions')
require(r'(?:runtime|performance).*same hardware.*inputs.*numerical correctness|numerical correctness.*same hardware.*inputs', 'Operator baseline conditions', 'directions')
require(r'(?:published evidence|permitted sequence data).*traceable|traceable.*(?:published evidence|permitted sequence data)', 'Protein research evidence', 'directions')
require(r'(?:Wet.lab|biological validation).*outside|(?:Wet.lab|biological validation).*not required', 'Protein prototype boundary', 'directions')
require(r'(?:public|synthetic).*incident.*(?:scenario constraints|human review)', 'Supervised disaster planning', 'directions')

# Core capabilities, interaction and evaluation evidence.
require(r'(?:at least one|one or more).*Agnes AI model|Agnes AI.*(?:at least one|one or more).*model', 'Actual Agnes model use', 'required')
require(r'coding assistance alone.*(?:not|does not|insufficient)|only for coding assistance.*does not', 'Coding assistance is insufficient', 'required', 'scope')
require(r'traceable inputs and outputs|trace.*inputs.*outputs', 'Traceable inputs and outputs', 'required')
require(r'repeatable|reproducible', 'Repeatable evaluation', 'required')
require(r'revise.*approve.*reject|review.*(?:approve|reject)', 'User reviews and controls the output', 'required')
require(r'(?:same|identical).*inputs.*(?:evaluation|conditions)|baseline.*same.*conditions', 'Fair baseline comparison')
require(r'GitHub.*(?:review|accessible)', 'Reviewable source repository', 'deliverables')
require(r'README.*(?:where|how).*Agnes.*(?:models|model)', 'Documented Agnes feature/model mapping', 'deliverables')
require(r'set.?up.*reproducible.*(?:test|case).*baseline.*(?:limitations|failure)', 'Reproducible demo documentation', 'deliverables')
require(r'(?:invalid inputs|invalid input).*API failure|API failure.*(?:invalid inputs|invalid input)', 'Invalid input and API failure demonstration', 'deliverables', 'success')
require(r'final judging rules.*(?:confirmed|to be confirmed)|(?:evaluation|judging).*provisional', 'Provisional judging guidance', 'success')
require(r'(?:cost|time).*per (?:completed )?task.*(?:pilot|follow.up)|(?:pilot|follow.up).*(?:cost|time)', 'Cost and pilot feasibility', 'success', 'resources')
require(r'(?:limitations|failures).*not only.*best|not (?:just|only).*best.*(?:run|result)', 'Failures as well as successful runs', 'success', 'deliverables')

# API and data constraints must not be weakened by sponsored credits.
require(r'(?:RPM|requests per minute).*depend.*model, resolution and platform capacity', 'Dynamic API rate limits', 'constraints', 'resources')
require(r'(?:credits|balances).*do not.*(?:rate limits|capacity)|(?:credits|balances).*neither.*(?:rate|capacity)', 'Credits do not guarantee throughput', 'constraints', 'resources')
require(r'429', 'HTTP 429 handling', 'constraints')
require(r'503.*queue.full|queue.full.*503', 'Video capacity failures', 'constraints')
require(r'bounded retries.*backoff.*(?:failure state|failure)', 'Bounded retry and visible failure state', 'constraints')
require(r'Video.*optional.*(?:recording|prerecorded)|(?:recording|prerecorded).*actual run.*(?:video|generation)', 'Optional video with labelled actual-run fallback')
require(r'(?:server.side|protected local).*configuration|keys.*server.side', 'Protected API credentials', 'constraints')
require(r'(?:secrets|keys).*repositories.*demos|exclude secrets.*(?:repositories|demos)', 'No exposed secrets', 'constraints')
require(r'(?:public, synthetic|public or synthetic).*permitted|(?:public|synthetic).*licensed', 'Permitted datasets', 'constraints', 'resources')
require(r'(?:licenses|licences).*permission.*(?:personal|confidential)|permission.*(?:personal|confidential).*licen', 'Data permissions and licenses', 'constraints')
require(r'internet.*(?:own|teams).*comput', 'Internet and team environment', 'constraints', 'resources')
require(r'GPU.*robot.*laboratory.*(?:fabrication|chip).*private research API.*(?:included|provided|committed)', 'No promised specialist facilities', 'constraints', 'resources')
require(r'independent validation', 'Scientific validation', 'constraints')
require(r'supervised.*human approval.*consequential', 'Human approval before consequential actions', 'constraints')
require(r'real emergency dispatch.*hazardous autonomous operation.*not required', 'Prototype safety boundary', 'constraints')
require(r'wet.lab validation.*not required', 'No wet-lab requirement', 'scope')

# Credit allocation is per person, not a shared team account, and applies to 12 finalists.
require(r'(?:Rounds? 1 and 2|Rounds? 1.*Rounds? 2).*free.*(?:availability|limits)', 'Early rounds use public free offering', 'resources')
require(r'12 finalist teams.*US\$10.*(?:registered member|member)', 'Finalist/member allowance', 'resources')
require(r'US\$30 across three members or US\$40 across four', 'Aggregate examples', 'resources')
require(r'(?:each|individual).*balance.*(?:own|individual).*account|balances.*separate.*accounts', 'Balances remain on individual accounts', 'resources')
require(r'(?:registered email|registered.*email).*credit|credit.*registered.*email', 'Registered email for allocation', 'resources')
require(r'(?:Passwords|passwords).*API keys.*(?:not required|never|required by neither)|(?:organiser|organizer).*does not.*(?:passwords|API keys)', 'Organiser does not require secrets', 'resources')
require(r'(?:do not expire|non.expiring|no expiry).*after.*event.*used|(?:remain|available).*after.*event.*(?:until used|do not expire)', 'No credit expiry', 'resources')
require(r'activation.*(?:coordinated|organiser|organizer)', 'Organiser controls activation timing', 'resources')
require(r'(?:Further|additional).*funding.*not (?:committed|guaranteed)', 'No promise of more funding', 'resources')
require(r'No proprietary scientific dataset is committed', 'No proprietary dataset promised', 'constraints', 'resources')
require(r'(?:sandbox|reserved inference capacity).*not.*(?:committed|provided)|no.*(?:sandbox|reserved inference capacity)', 'No reserved sandbox/capacity', 'constraints', 'resources')
require(r'Agnes Harness.*optional.*(?:public|private)|optional.*Agnes Harness.*private', 'Harness optional and no private access', 'resources')
require(r'(?:generic chat wrapper|concept deck|unsupported claims)', 'Out-of-scope claims', 'scope')
require(r'(?:Small datasets|toy circuits|CPU.scale|synthetic incidents).*simulat', 'Permitted small-scale simplifications', 'scope')
require(r'(?:prerecorded|recorded).*label|label.*(?:prerecorded|recorded)', 'Label simplified/prerecorded demonstrations', 'scope', 'constraints')
require(r'(?:researchers|partners).*not guaranteed', 'No guaranteed post-event opportunity', 'resources', 'success')
assert not requirement_failures, '\n'.join(requirement_failures)

for phrase in ['Care for All', 'Care demo', 'PEOPLE · ACCESS · COORDINATION',
               'Important participation rules', 'td-participant-terms', 'td-participant-help',
               'Submission Checklist', 'THE GUIDING PRINCIPLE', 'Download original PDF']:
    assert phrase not in html, f'Unwanted source/admin/mock content: {phrase}'
assert 'td-connections' in html and 'class="tds-scene' not in html, 'Old CareScene used for Agnes AI'
assert 'td-track-wheel' not in html, 'Removed challenge selector is present'
assert 'td-hero-foot' not in html, 'Removed scroll strip is present'
assert 'href="/tracks/track-2/problems"' in html, 'Parent track link is missing'
assert 'Other problem statements' not in html and 'PREVIOUS PS' not in html and 'NEXT PS' not in html

for route in ['dist/tracks/track-2/index.html', 'dist/tracks/track-2/problems/index.html']:
    listing = Path(route).read_text(encoding='utf-8')
    assert len(re.findall(r'<a\b[^>]*class="[^"]*\bps-card\b', listing)) == 1, f'{route}: expected one open challenge card'
    assert 'Agnes AI' in listing and '/tracks/track-2/problems/ps-1' in listing
    assert 'Open challenge' in listing and 'PS 01' not in listing
    assert 'Care for All' not in listing
main = html_lib.unescape(Path('dist/tracks/index.html').read_text(encoding='utf-8'))
assert '>Track 2</span>' in main, 'Main track flag should show only the track number'
for old_number in [2, 3, 4]:
    assert not Path(f'dist/tracks/track-2/problems/ps-{old_number}').exists(), 'Old mock route remains in build'

route_check = subprocess.run(['node', '--input-type=module', '-e', "import {tracks,trackRoutes} from './src/trackData.js'; import {getParticipantBrief} from './src/participantBriefs.js'; const t=tracks.find(track=>track.slug==='track-2'); console.log(JSON.stringify({count:t.problemStatements.length,title:t.title,numeral:t.numeral,briefNumerals:t.problemStatements.map(brief=>brief.numeral),official:t.hasOfficialBriefs,mock:t.isMock,mode:t.heroMode,kind:t.problemStatements[0].briefKind,paths:trackRoutes.filter(r=>r.track.slug==='track-2'&&r.kind==='brief').map(r=>r.path),one:getParticipantBrief(1,'track-3').required[0].title,two:getParticipantBrief(1,'track-4').required[0].title,three:getParticipantBrief(1,'track-2').required.length,topics:t.problemStatements[0].topics.length,prompts:t.problemStatements[0].prompts.length}));"], check=True, capture_output=True, text=True)
routes = json.loads(route_check.stdout)
assert routes == {
    'count': 1, 'title': 'Agnes AI', 'numeral': '02', 'briefNumerals': ['02'],
    'official': True, 'mock': False,
    'mode': 'diagram', 'kind': 'open-challenge', 'paths': ['/tracks/track-2/problems/ps-1'],
    'one': 'AI-assisted teardown', 'two': 'One connected, extensible model',
    'three': len(brief['required']), 'topics': 6, 'prompts': 6,
}, 'Track identity, route, diagram or scoped participant lookup regression'

assert source['source']['pages'] == len(source['pages']) == 4
assert [archive['page'] for archive in source['pages']] == list(range(1, 5))
public_pdf = Path('public') / source['source']['href'].lstrip('/')
dist_pdf = Path('dist') / source['source']['href'].lstrip('/')
expected_sha = '1318c6644864c9c1d5af7dc4e3fef11b6fee4d805fc4c223cf633eb0cbba407c'
assert source['source']['sha256'] == expected_sha
for pdf in [public_pdf, dist_pdf]:
    assert hashlib.sha256(pdf.read_bytes()).hexdigest() == expected_sha, f'{pdf}: source PDF changed'
reader = PdfReader(public_pdf)
assert len(reader.pages) == 4
for original_page, archive in zip(reader.pages, source['pages']):
    assert norm(original_page.extract_text(extraction_mode='layout')) == norm(archive['text']), f'Archive page {archive["page"]} incomplete'

source_urls = {
    annotation.get_object().get('/A', {}).get('/URI')
    for original_page in reader.pages for annotation in original_page.get('/Annots', [])
}
expected_urls = {
    'https://wiki.agnes-ai.com/en/docs/tokenplan',
    'https://wiki.agnes-ai.com/en/docs/faqs',
    'https://wiki.agnes-ai.com/en/docs/pricing',
    'https://github.com/AgnesAI-Labs/agnes-harness',
    'https://platform.agnes-ai.com/',
}
assert source_urls == expected_urls, 'PDF resource links changed'
rendered_urls = {html_lib.unescape(url) for url in re.findall(r'<a\b[^>]*href="([^"]+)"', html)}
assert source_urls <= rendered_urls, 'Source resource references are missing or not clickable'

print(f'Agnes AI: {len(page.items)} participant cards, one open challenge, four suggested directions, matching track-2 URL and all four original PDF pages verified.')
print('PASS: Open-choice wording, Agnes use, evaluation, safety, API reliability, individual finalist credits and resource links are correct.')
