"""Import complete partner briefs, preserving every non-furniture source character."""
import argparse
import hashlib
import json
import re
import shutil
import unicodedata
from pathlib import Path

from pypdf import PdfReader
import pymupdf


BRIEFS = [
    ('CODERED26_PS1_Reverse_Engineer_Anything.pdf', 'Reverse Engineer Anything [REA]', 'GenAI-assisted deconstruction and reinvention of real-world applications'),
    ('CODERED26_PS2_The_Perfect_Fit.pdf', 'The Perfect Fit', 'Instant ATS scoring, one-page resume optimisation and auto-generated portfolios'),
    ('CODERED26_PS3_Catalog_Genius.pdf', 'Catalog Genius', 'AI-Powered Product Generation & Authenticity Detection'),
    ('CODERED26_PS4_HyperSpeed_Quick_Commerce.pdf', 'HyperSpeed Quick Commerce', 'Disruptive logistics and ordering systems for minutes-level delivery at scale'),
    ('CODERED26_PS5_One_Token_Video.pdf', 'One-Token Video', 'Compute-efficient, high-quality AI video generation and editing'),
]
SECTION = re.compile(r'^(\d{1,2})\.\s+(.+)$')
BULLET = re.compile(r'^([\uf0b7\u2022\u25cf])\s*(.*)$')


def normalized(text):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', text))


def join_wrapped(left, right):
    if re.search(r'[A-Za-z]-$', left) and re.match(r'[A-Za-z]', right):
        return left + right
    return f'{left} {right}'.strip()


def hint_key(line):
    return normalized(BULLET.sub(r'\2', line.strip()))


def typography_hints(source):
    hints = {}
    for page in pymupdf.open(source):
        for block in page.get_text('dict', sort=True)['blocks']:
            if not block.get('lines'):
                continue
            first_line = ''.join(span['text'] for span in block['lines'][0]['spans']).strip()
            prefix = ''
            regular_started = False
            for line in block['lines']:
                for span in line['spans']:
                    text = span['text']
                    if not text.strip() or BULLET.fullmatch(text.strip()):
                        continue
                    if span['flags'] & 16:
                        prefix = join_wrapped(prefix, text.strip())
                    else:
                        regular_started = True
                        break
                if regular_started:
                    break
            label = prefix if prefix.endswith((':', '?')) else ''
            # A plain first block near the top is usually a continuation from the prior page.
            hints[hint_key(first_line)] = {'boundary': bool(label) or block['bbox'][1] >= 80, 'label': label}
    return hints


def source_label(line, hint):
    label = hint.get('label', '')
    if not label:
        return '', line
    match = re.match(r'^' + r'\s+'.join(re.escape(word) for word in label.split()), line)
    return (line[:match.end()].strip(), line[match.end():].strip()) if match else ('', line)


def parse_blocks(lines, hints):
    blocks = []
    current = None

    def flush():
        nonlocal current
        if current:
            if current['kind'] == 'subheading' and current['text']:
                current['kind'] = 'field'
            blocks.append(current)
        current = None

    for original in lines:
        line = original.strip()
        if not line:
            flush()
            continue
        bullet = BULLET.match(line)
        if bullet:
            flush()
            marker, line = bullet.groups()
            label, text = source_label(line, hints.get(hint_key(line), {}))
            current = {'kind': 'bullet', 'marker': marker, 'label': label, 'text': text}
            continue
        hint = hints.get(hint_key(line), {})
        label, text = source_label(line, hint)
        if label:
            flush()
            current = {'kind': 'field' if text else 'subheading', 'label': label, 'text': text}
            continue
        if hint.get('boundary'):
            flush()
        if current is None:
            current = {'kind': 'paragraph', 'label': '', 'text': line}
        else:
            current['text'] = join_wrapped(current['text'], line)
    flush()
    rendered = '\n'.join(f"{block.get('marker', '')}{block['label']}{block['text']}" for block in blocks)
    assert normalized(rendered) == normalized('\n'.join(lines)), 'Block parsing lost or changed source content'
    return blocks


def import_brief(source, number, title, subtitle):
    reader = PdfReader(source)
    hints = typography_hints(source)
    clean = []
    furniture = []
    for page_number, page in enumerate(reader.pages, 1):
        lines = []
        for raw in page.extract_text(extraction_mode='layout').splitlines():
            line = raw.strip()
            if 'CODERED' in line and any(part in line for part in ['INDUSTRY PARTNERSHIPS', 'INDUSTRY CHALLENGE BRIEF', 'Problem Statement']):
                furniture.append({'page': page_number, 'text': line})
                continue
            lines.append((raw, page_number))
        while lines and not lines[0][0].strip():
            lines.pop(0)
        while lines and not lines[-1][0].strip():
            lines.pop()
        clean.extend(lines)
    all_text = '\n'.join(line for line, _ in clean)
    assert '\ufffd' not in all_text, 'Replacement character in PDF extraction'
    sections = []
    lead = []
    current = None
    for raw, page_number in clean:
        line = raw.strip()
        numbered = SECTION.match(line)
        special = {'Submission Checklist': 'submission-checklist', 'THE GUIDING PRINCIPLE': 'guiding-principle'}.get(line)
        if numbered or special:
            current = {
                'id': f'source-{numbered[1]}' if numbered else special,
                'number': int(numbered[1]) if numbered else None,
                'heading': numbered[2] if numbered else line,
                'sourceHeading': line,
                'pages': [page_number],
                'lines': [],
            }
            sections.append(current)
        elif current:
            current['lines'].append(raw)
            if line and page_number not in current['pages']:
                current['pages'].append(page_number)
        else:
            lead.append(raw)
    assert [section['number'] for section in sections if section['number']] == list(range(1, 15))
    assert [section['id'] for section in sections[-2:]] == ['submission-checklist', 'guiding-principle']
    assert normalized(title) in normalized('\n'.join(lead))
    assert normalized(subtitle) in normalized('\n'.join(lead))
    intro = join_wrapped('', ' '.join(line.strip() for line in lead if line.strip()))
    objective = intro.split('OBJECTIVE', 1)[1].strip()
    for section in sections:
        section['blocks'] = parse_blocks(section.pop('lines'), hints)
    section_text = '\n'.join(section['sourceHeading'] + '\n' + '\n'.join(f"{block.get('marker', '')}{block['label']}{block['text']}" for block in section['blocks']) for section in sections)
    represented = '\n'.join(lead) + '\n' + section_text
    assert normalized(represented) == normalized(all_text), 'Incomplete source coverage'

    def field(label):
        return next(block['text'] for block in sections[0]['blocks'] if block['label'].rstrip(':') == label)

    checklist = next(section for section in sections if section['id'] == 'submission-checklist')
    assert len([block for block in checklist['blocks'] if block['kind'] == 'bullet']) == 8
    return {
        'number': number, 'title': title, 'subtitle': subtitle,
        'challengeTitle': field('Challenge Title'), 'company': field('Company / Partner Name'),
        'industry': field('Industry / Track'), 'challengeType': field('Challenge Type'),
        'summary': field('Brief Summary'), 'objective': objective,
        'sections': sections,
        'source': {'filename': source.name, 'href': f'/briefs/mystartupwave/{source.name}', 'pages': len(reader.pages), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()},
        'coverage': {'numberedSections': 14, 'checklistItems': 8, 'sourceCharacters': len(normalized(all_text)), 'renderedCharacters': len(normalized(represented)), 'contentSha256': hashlib.sha256(normalized(all_text).encode()).hexdigest(), 'lossless': True, 'excludedPageFurniture': furniture},
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=Path('src/data/mystartupwave.json'))
    parser.add_argument('--pdf-dir', type=Path, default=Path('public/briefs/mystartupwave'))
    args = parser.parse_args()
    briefs = [import_brief(args.source_dir / filename, i, title, subtitle) for i, (filename, title, subtitle) in enumerate(BRIEFS, 1)]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.pdf_dir.mkdir(parents=True, exist_ok=True)
    for brief in briefs:
        source = args.source_dir / brief['source']['filename']
        destination = args.pdf_dir / source.name
        shutil.copy2(source, destination)
        assert hashlib.sha256(destination.read_bytes()).hexdigest() == brief['source']['sha256']
    args.output.write_text(json.dumps(briefs, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for brief in briefs:
        print(f"PS{brief['number']}: {brief['source']['pages']} pages, 14 sections + checklist + principle; {brief['coverage']['sourceCharacters']} characters preserved")


if __name__ == '__main__':
    main()
