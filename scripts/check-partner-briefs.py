"""Check participant pages, critical brief requirements, and unchanged source archives."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unicodedata


def norm(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', text)).strip()


class ParticipantPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.item = None
        self.item_depth = None
        self.items = {}
        self.captures = []
        self.text = []
        self.fields = {}
        self.ids = []
        self.downloads = []
        self.h1s = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag not in ['meta', 'link', 'img', 'input', 'br', 'hr', 'source', 'wbr', 'area', 'base', 'embed', 'param', 'track', 'col']:
            self.depth += 1
        self.h1s += tag == 'h1'
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if 'download' in attrs:
            self.downloads.append(attrs.get('href'))
        if 'data-participant-item' in attrs:
            self.item = attrs['data-participant-item']
            self.item_depth = self.depth
            assert self.item not in self.items, f'Duplicate item: {self.item}'
            self.items[self.item] = {}
        for attribute, name in [('data-participant-title', 'title'), ('data-participant-text', 'text'), ('data-participant-problem', 'problem'), ('data-participant-workflow', 'workflow')]:
            if attribute in attrs:
                self.captures.append({'depth': self.depth, 'item': self.item, 'name': name, 'text': []})

    def handle_endtag(self, tag):
        for capture in list(self.captures):
            if capture['depth'] != self.depth:
                continue
            value = norm(''.join(capture['text']))
            if capture['item']:
                self.items[capture['item']][capture['name']] = value
            else:
                self.fields[capture['name']] = value
            self.captures.remove(capture)
        if self.item_depth == self.depth:
            self.item = self.item_depth = None
        self.depth -= 1

    def handle_data(self, text):
        self.text.append(text)
        for capture in self.captures:
            capture['text'].append(text)


source_briefs = json.loads(Path('src/data/mystartupwave.json').read_text(encoding='utf-8-sig'))
participants = sorted([item for path in ['participant-ps12.json', 'participant-ps3.json', 'participant-ps45.json'] for item in json.loads((Path('src/data') / path).read_text(encoding='utf-8-sig'))], key=lambda item: item['number'])
assert [brief['number'] for brief in participants] == [1, 2, 3, 4, 5]

# Independent facts from the partner sources: numbers, conditions and option boundaries.
critical = {
    1: [
        ('required', r'at least two original improvements'),
        ('required', r'observed, documented or AI-inferred'),
        ('required', r'ER diagram'),
        ('deliverables', r'at least three core user journeys'),
        ('deliverables', r'AI/prompt usage log'),
        ('optional', r'at least five real users'),
        ('success', r'at least 70%'),
        ('success', r'at least 80%'),
        ('success', r'at least two metrics'),
        ('success', r'Lighthouse.*90.*example'),
        ('constraints', r'under 2\.5 seconds'),
        ('constraints', r'hashed passwords or a trusted identity provider'),
        ('scope', r'You may focus.*3–5.*user journeys.*mock.*not central.*disclose'),
    ],
    2: [
        ('required', r'0–100.*at least eight'),
        ('required', r'PDF and DOCX'),
        ('required', r'one page'),
        ('constraints', r'OCR or reject.*clear message'),
        ('constraints', r'within ±1'),
        ('constraints', r'explicit consent before training'),
        ('constraints', r'Publishing must be opt-in.*public contact'),
        ('constraints', r'HTTPS.*data deletion'),
        ('deliverables', r'at least three resumes.*two-column, graphics-heavy'),
        ('success', r'at least 25 points'),
        ('success', r'under 5 minutes'),
        ('success', r'at least 90%.*under 10 seconds'),
        ('success', r'100%.*exactly one page.*both your own parser and at least one external parser'),
        ('success', r'adoption plan.*at least one institutional'),
        ('resources', r'hidden set of resumes and job descriptions'),
        ('scope', r'English-language.*sufficient.*approximation'),
    ],
    3: [
        ('required', r'at least two target platforms'),
        ('required', r'pixel analysis; metadata alone is insufficient'),
        ('required', r'EXIF and C2PA.*where present'),
        ('required', r'both Shopify and WooCommerce'),
        ('optional', r'C2PA.*optional.*disclosure.*required'),
        ('deliverables', r'at least three complete listings.*different product categories'),
        ('deliverables', r'either a Shopify.*or a WooCommerce.*support both'),
        ('success', r'under 5 minutes.*at least 80%'),
        ('success', r'under 60 seconds.*under 5 seconds'),
        ('success', r'at least 85%.*balanced hidden.*10-percentage-point.*JPEG-compressed, resized or cropped'),
        ('constraints', r'mobile browsers'),
        ('constraints', r'inconclusive band.*future image-generation'),
        ('constraints', r'uploaded images and data only for the requested task'),
        ('scope', r'You may focus on 2–3 product categories.*test stores'),
    ],
    4: [
        ('required', r'at least one of five directions'),
        ('required', r'at least 3 dark stores, 30\+ riders and thousands of orders'),
        ('required', r'baseline.*same simulator.*identical scenarios'),
        ('optional', r'customer-facing prototype'),
        ('deliverables', r'same simulated day.*at least one demand surge and one disruption'),
        ('success', r'at least 15%.*OR at least 20%.*without increasing cost per order'),
        ('success', r'under 2 seconds.*500\+.*below 2 minutes'),
        ('success', r'workload and break limits'),
        ('constraints', r'fixed random seeds'),
        ('scope', r'200–500 SKUs'),
    ],
    5: [
        ('required', r'10–15 seconds.*720p or higher and 24 fps.*both text-to-video and image-to-video'),
        ('required', r'trimming, sequencing, text overlays, transitions and an audio track'),
        ('required', r'GPU-seconds or tokens.*generation time and estimated cost'),
        ('optional', r'storyboard or animatic'),
        ('optional', r'C2PA.*optional.*AI-generated.*mandatory'),
        ('deliverables', r'at least two distinct clips.*one single-shot edit'),
        ('deliverables', r'identical prompts.*compute.*time.*quality.*human ratings'),
        ('success', r'at least a 5×.*no more than a 10%.*comparable human-rated quality'),
        ('success', r'15-second.*at least one revision.*under 10 minutes.*10-second 720p.*under 3 minutes.*T4/A10'),
        ('success', r'≤ 25%.*cost-per-clip and pricing model'),
        ('constraints', r'less than 25%'),
        ('constraints', r'only for the user’s own job'),
        ('constraints', r'free tiers or modest credits.*cost per output second'),
        ('scope', r'10–30 seconds.*10–20 prompts'),
    ],
}

expected_ids = ['problem', 'focus', 'deliverables', 'judging', 'resources', 'terms', 'next']
# Participation terms remain in the source data; their website box was removed.
groups = ['required', 'optional', 'deliverables', 'success', 'constraints', 'scope', 'resources']
for brief, original in zip(participants, source_briefs):
    number = brief['number']
    path = Path(f'dist/tracks/track-1/problems/ps-{number}/index.html')
    html = path.read_text(encoding='utf-8')
    page = ParticipantPage()
    page.feed(html)
    rendered_text = norm(' '.join(page.text))
    assert page.h1s == 1, f'{path}: expected one H1'
    assert [id for id in page.ids if id in expected_ids] == expected_ids, f'{path}: participant sections or order missing'
    assert not page.downloads, f'{path}: PDF download control restored'
    assert 'Choose a problem statement.' in html and 'data-kind="problem"' in html
    for phrase in ['Submission Checklist', 'Brief completeness', 'THE GUIDING PRINCIPLE', 'Business and Adoption Context', 'Industry Engagement', 'Partner information &amp; industry context']:
        assert phrase not in html, f'{path}: partner template text remains: {phrase}'
    for field in ['problem', 'workflow']:
        assert page.fields[field] == norm(brief[field]), f'{path}: missing participant {field}'
    expected_items = {
        **{f'{group}-{i}': item for group in groups for i, item in enumerate(brief[group])},
        'context-0': {'title': 'Who it helps', 'text': brief['audience']},
        'context-1': {'title': 'Your challenge', 'text': brief['outcome']},
    }
    assert set(page.items) == set(expected_items), f'{path}: missing/extra participant cards'
    for key, item in expected_items.items():
        assert page.items[key] == {field: norm(item[field]) for field in ['title', 'text']}, f'{path}: incomplete card: {key}'
    for group, pattern in critical[number]:
        content = norm(' '.join(item['title'] + ' ' + item['text'] for item in brief[group]))
        assert re.search(pattern, content, re.I | re.S), f'PS{number}: critical {group} requirement: {pattern}'
        assert re.search(pattern, rendered_text, re.I | re.S), f'{path}: critical requirement not rendered: {pattern}'
    assert 'ownership' in norm(' '.join(item['text'] for item in brief['terms'])).lower()
    assert 'Important participation rules' not in html and 'td-participant-terms' not in html, f'{path}: removed participation rules box is present'
    assert 'td-participant-help' not in html and 'Questions &amp; clarifications' not in html and 'Mentoring &amp; feedback' not in html, f'{path}: removed help panel is present'
    if number == 5:
        assert 'Benchmark clarification:' in html and 'Both source wordings are preserved' in html
    pdf = Path('dist') / original['source']['href'].lstrip('/')
    assert hashlib.sha256(pdf.read_bytes()).hexdigest() == original['source']['sha256'], f'{path}: original PDF archive changed'
    assert original['coverage']['lossless'] and original['coverage']['sourceCharacters'] == original['coverage']['renderedCharacters']
    original_words = len(' '.join(b['label'] + ' ' + b['text'] for s in original['sections'] for b in s['blocks']).split())
    participant_words = len((' '.join([brief['problem'], brief['audience'], brief['outcome'], brief['workflow']] + [item['title'] + ' ' + item['text'] for group in groups for item in brief[group]])).split())
    assert participant_words < original_words * .7, f'{path}: copy still resembles the full document'
    print(f'PS{number}: {len(page.items)} participant cards; {participant_words} words vs {original_words} source words; critical requirements and source archive verified')
print('PASS: all five participant briefs retain critical requirements without reproducing partner templates.')
