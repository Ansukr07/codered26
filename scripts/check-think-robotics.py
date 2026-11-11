"""Verify Think Robotics' participant brief, routes, and complete source archive."""
import hashlib
import html as html_lib
import json
from pathlib import Path
import re
import runpy
import subprocess

from pypdf import PdfReader


# Reuse the HTML checks and run all five MyStartupWave regressions as well.
existing = runpy.run_path('scripts/check-partner-briefs.py')
ParticipantPage, norm = existing['ParticipantPage'], existing['norm']

briefs = json.loads(Path('src/data/participant-think-robotics.json').read_text(encoding='utf-8-sig'))
sources = json.loads(Path('src/data/think-robotics.json').read_text(encoding='utf-8-sig'))
assert len(briefs) == len(sources) == 1, 'Think Robotics has one PS, not four workflows or six separate challenges'
brief, source = briefs[0], sources[0]
assert brief['number'] == source['number'] == 1
assert source['company'] == 'Think Robotics'
assert source['fullTitle'] == 'Customer Knowledge Graph for Hybrid B2B Commerce'
assert all(domain in brief['problem'] for domain in ['robotics', 'industrial automation', 'electronic components', 'drones', '3D printing']), 'Partner domain context missing'

path = Path('dist/tracks/track-2/problems/ps-1/index.html')
html = path.read_text(encoding='utf-8')
page = ParticipantPage()
page.feed(html)
assert page.h1s == 1
expected_ids = ['problem', 'focus', 'deliverables', 'judging', 'resources', 'terms', 'next']
assert [item for item in page.ids if item in expected_ids] == expected_ids
assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
assert not page.downloads
assert source['fullTitle'] in html and 'Think Robotics PS 01' in html, 'Full title and partner missing from metadata'
for field in ['problem', 'workflow']:
    assert page.fields[field] == norm(brief[field]), f'Missing participant {field}'
groups = ['required', 'optional', 'deliverables', 'success', 'constraints', 'scope', 'resources']
expected_items = {
    **{f'{group}-{i}': item for group in groups for i, item in enumerate(brief[group])},
    'context-0': {'title': 'Who it helps', 'text': brief['audience']},
    'context-1': {'title': 'Your challenge', 'text': brief['outcome']},
}
assert set(page.items) == set(expected_items), 'Missing or extra participant cards'
for key, item in expected_items.items():
    assert page.items[key] == {field: norm(item[field]) for field in ['title', 'text']}, f'Incomplete card: {key}'
assert [len(brief[group]) for group in ['required', 'optional', 'deliverables', 'success']] == [9, 6, 3, 6]

def content(group):
    return norm(' '.join(item['title'] + ' ' + item['text'] for item in brief[group]))


# Independent source requirements: preserve conditions, optional choices and stage differences.
critical = [
    ('required', r'accounts, people, locations, products, orders, sessions and external records.*new data types.*all four.*same graph'),
    ('required', r'company name, GSTIN, email domain or phone.*one-page, phone-readable.*purchases.*browsing.*projects.*pitch'),
    ('required', r'PIN code, city, district, industry or product category.*value and recency'),
    ('required', r'similar companies.*never ordered.*evidence'),
    ('required', r'customer.s own history.*similar customers.*external signals.*imports, tenders or hiring'),
    ('required', r'personal business emails.*multiple shipping addresses and shared IPs.*confidence for every merge'),
    ('required', r'Every fact.*supporting sources.*when each was last seen.*defensible confidence or weight'),
    ('required', r'Independent agreement.*strengthen confidence.*disagreement and single weak sources.*uncertainty'),
    ('required', r'incrementally.*orders, sessions and external records.*without rebuilding'),
    ('required', r'Missing or unreachable sources.*lower confidence rather than break'),
    ('required', r'what was observed.*when it was observed.*stale records'),
    ('required', r'non-technical.*phone without training.*Natural language.*optional.*form or search'),
    ('constraints', r'partner supplies no internal.*Generate realistic.*inconsistent names.*Gmail.*shipping PINs.*shared office IPs.*GSTINs.*absent'),
    ('constraints', r'contact names, emails, phone numbers, IP addresses and device identifiers.*personal data.*Collect only.*stated purpose.*found and deleted on request'),
    ('constraints', r'deployable on private servers or a private cloud.*open-source.*preferred.*hosted service.*optional and swappable'),
    ('constraints', r'cannot depend on sending customer data to a third party'),
    ('constraints', r'scraping and third-party APIs or exports.*terms of use.*demonstration only.*Do not profile individuals'),
    ('scope', r'CRM or order system.*public-storefront product recommendations.*general-purpose company database.*personal social-media'),
    ('scope', r'Graph databases, relational models, vector search, rules, classical ML and language models.*alone or together.*no particular database or LLM'),
    ('resources', r'order ID, date, SKUs, HSN codes, quantities, value, invoice GSTIN.*billing and shipping addresses with PIN codes'),
    ('resources', r'account or anonymous ID, pages, categories, searches, cart events, timestamps and time on site'),
    ('resources', r'typed company name, contact name, email and its domain, phone and GST number.*IP address, device type, user agent and mobile/desktop'),
    ('resources', r'GST registration.*MCA.*Udyam.*customs/DGFT.*GeM/CPPP/state tenders.*patent'),
    ('resources', r'India Post PIN data/OpenStreetMap.*CBIC HSN.*third-party APIs'),
    ('resources', r'examples, not mandatory integrations.*Better sources.*LLMs and RLMs.*corroboration'),
    ('deliverables', r'Online round 1: PPT and video.*graph model.*sources.*corroboration.*one workflow.*synthetic data'),
    ('deliverables', r'Online round 2.*company name or PIN code.*live answer.*sources and confidence'),
    ('deliverables', r'On-campus sprint.*all four workflows.*conflicting dataset.*got wrong.*recognises.*labelled messy.*match rate.*false-merge rate'),
    ('success', r'labelled messy set.*false-merge rate alongside the match rate'),
    ('success', r'Every external fact.*sources and defensible confidence.*Conflicting sources.*visible'),
    ('success', r'roughly the order shown.*no numeric accuracy or latency pass mark'),
    ('optional', r'one phone screen'),
    ('optional', r'Pvt Ltd versus Private Limited.*transliterated.*abbreviations'),
    ('optional', r'PIN-to-district.*wrong digit'),
    ('optional', r'unknown.*too thin.*instead of guessing'),
]
rendered_text = norm(' '.join(page.text))
for group, pattern in critical:
    assert re.search(pattern, content(group), re.I | re.S), f'Missing source requirement in {group}: {pattern}'
    assert re.search(pattern, rendered_text, re.I | re.S), f'Requirement not rendered: {pattern}'
assert [item['title'] for item in brief['success']] == [
    'Resolution quality', 'Corroboration and provenance', 'Sales usefulness',
    'Query experience', 'Data handling', 'Path to production',
], 'Evaluation priorities changed'
assert [key for key in page.items if key.startswith('success-')] == [f'success-{i}' for i in range(6)]
assert not re.search(r'(?:at least|minimum of|under|at most|[≥≤])\s*\d+(?:\.\d+)?\s*(?:%|seconds|minutes|milliseconds|customers|companies|accounts|records)', rendered_text, re.I), 'Invented numeric benchmark or dataset minimum'

for phrase in ['MyStartupWave', 'Reverse Engineer Anything', 'Connected Cities', 'SHARED SPACES',
               'Important participation rules', 'td-participant-terms', 'td-participant-help',
               'Submission Checklist', 'THE GUIDING PRINCIPLE', 'Download original PDF', 'What comes next']:
    assert phrase not in html, f'Unwanted source/admin/mock content: {phrase}'
assert 'td-connections' in html and 'class="tds-scene' not in html, 'Old city scene used for knowledge graph'
wheel = re.search(r'<nav[^>]*class="td-track-wheel"[^>]*>(.*?)</nav>', html, re.S)
assert wheel and 'aria-label="Current problem statement"' in html
assert re.findall(r'<a\b[^>]*href="([^"]+)"', wheel[1]) == ['/tracks/track-2/problems/ps-1']
assert wheel[1].count('aria-current="page"') == 1
assert 'Other problem statements' not in html and 'PREVIOUS PS' not in html and 'NEXT PS' not in html

for route in ['dist/tracks/track-2/index.html', 'dist/tracks/track-2/problems/index.html']:
    listing = Path(route).read_text(encoding='utf-8')
    assert len(re.findall(r'<a\b[^>]*class="[^"]*\bps-card\b', listing)) == 1, f'{route}: expected one PS card'
    assert 'Think Robotics' in listing and '/tracks/track-2/problems/ps-1' in listing
    assert 'Connected Cities' not in listing
main = html_lib.unescape(Path('dist/tracks/index.html').read_text(encoding='utf-8'))
assert '>Track 4</span>' in main, 'Main track flag should show only the track number'
assert '>Track 4 ·' not in main
for old_number in [2, 3, 4]:
    assert not Path(f'dist/tracks/track-2/problems/ps-{old_number}').exists(), 'Old mock route remains in build'

route_check = subprocess.run(['node', '--input-type=module', '-e', "import {tracks,trackRoutes} from './src/trackData.js'; import {getParticipantBrief} from './src/participantBriefs.js'; const t=tracks.find(track=>track.slug==='track-2'); console.log(JSON.stringify({count:t.problemStatements.length,title:t.title,numeral:t.numeral,briefNumerals:t.problemStatements.map(brief=>brief.numeral),official:t.hasOfficialBriefs,mock:t.isMock,mode:t.heroMode,order:tracks.map(track=>[track.title,track.slug,track.numeral]),paths:trackRoutes.filter(r=>r.track.slug==='track-2'&&r.kind==='brief').map(r=>r.path),one:getParticipantBrief(1,'track-1').required[0].title,two:getParticipantBrief(1,'track-2').required[0].title}));"], check=True, capture_output=True, text=True)
routes = json.loads(route_check.stdout)
assert routes == {
    'count': 1, 'title': 'Think Robotics', 'numeral': '04', 'briefNumerals': ['04'],
    'official': True, 'mock': False, 'mode': 'diagram',
    'order': [
        ['Simple Energy', 'track-4', '01'],
        ['Agnes AI', 'track-3', '02'],
        ['MyStartupWave', 'track-1', '03'],
        ['Think Robotics', 'track-2', '04'],
    ],
    'paths': ['/tracks/track-2/problems/ps-1'],
    'one': 'AI-assisted teardown', 'two': 'One connected, extensible model',
}, 'Track order, identity, route or participant lookup regression'

assert source['source']['pages'] == len(source['pages']) == 7
assert [page['page'] for page in source['pages']] == list(range(1, 8))
public_pdf = Path('public') / source['source']['href'].lstrip('/')
dist_pdf = Path('dist') / source['source']['href'].lstrip('/')
expected_sha = '5c6d1a9b6ebae146a63631cad66ed56ccd7b0abf3fdf9719aaf74d965ae61727'
assert source['source']['sha256'] == expected_sha
for pdf in [public_pdf, dist_pdf]:
    assert hashlib.sha256(pdf.read_bytes()).hexdigest() == expected_sha, f'{pdf}: source PDF changed'
reader = PdfReader(public_pdf)
assert len(reader.pages) == 7
for original_page, archive in zip(reader.pages, source['pages']):
    assert norm(original_page.extract_text(extraction_mode='layout')) == norm(archive['text']), f'Archive page {archive["page"]} incomplete'

print(f'Think Robotics: {len(page.items)} participant cards, 4 workflows, 3 evaluation stages, 6 ordered criteria, one correct PS route and all 7 original PDF pages verified.')
print('PASS: Think Robotics content, source archive, display order, singular listing and track-scoped PS lookup are correct.')
