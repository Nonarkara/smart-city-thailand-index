#!/usr/bin/env python3
"""Generate NST Checklist for Smart Cities PDF — SCITI 2026 case-study series."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, PageBreak,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

# ── Colour palette ────────────────────────────────────────────────────────────
AMBER      = HexColor('#f59e0b')
AMBER_DARK = HexColor('#92400e')
AMBER_PALE = HexColor('#fef3c7')
INK        = HexColor('#0a0a0a')
INK2       = HexColor('#4b4b4b')
INK3       = HexColor('#9b9b9b')
RULE       = HexColor('#e5e5e5')

W, H       = A4  # 595.28 × 841.89 pt
LMARGIN    = 25 * mm
RMARGIN    = 25 * mm
DOC_WIDTH  = W - LMARGIN - RMARGIN  # ≈ 453 pt

# ── Style factory ─────────────────────────────────────────────────────────────
def S(name, **kw):
    base = kw.pop('parent', None)
    defaults = dict(
        fontName='Helvetica', fontSize=9, leading=13,
        textColor=INK2, spaceAfter=0, spaceBefore=0, alignment=TA_LEFT,
    )
    if base:
        defaults.update(base.__dict__)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

DISPLAY  = S('display', fontName='Helvetica-Bold', fontSize=28, leading=33, textColor=INK, spaceAfter=4)
H1       = S('h1',      fontName='Helvetica-Bold', fontSize=16, leading=20, textColor=INK, spaceAfter=4)
EYEBROW  = S('eyebrow', fontName='Courier-Bold',   fontSize=8,  leading=10, textColor=AMBER, spaceAfter=3, charSpace=1.4)
BODY     = S('body',    fontSize=9,  leading=14, textColor=INK2, spaceAfter=5)
BOLD     = S('bold',    fontName='Helvetica-Bold', fontSize=9, leading=14, textColor=INK, spaceAfter=5)
ITALIC   = S('italic',  fontName='Helvetica-Oblique', fontSize=9, leading=14, textColor=INK2, spaceAfter=5)
OUTCOME  = S('outcome', fontName='Helvetica-Bold', fontSize=8.5, leading=13, textColor=AMBER_DARK, spaceAfter=0, leftIndent=8, rightIndent=8)
CHECK    = S('check',   fontSize=9, leading=13, textColor=INK, spaceAfter=3, leftIndent=14, firstLineIndent=-14)
STAT_N   = S('stat_n',  fontName='Courier-Bold',   fontSize=20, leading=24, textColor=AMBER, spaceAfter=1)
STAT_L   = S('stat_l',  fontName='Helvetica',      fontSize=7.5, leading=11, textColor=INK3, spaceAfter=0)
CAPTION  = S('caption', fontName='Courier',         fontSize=7,  leading=10, textColor=INK3, spaceAfter=2)
MINI     = S('mini',    fontName='Courier-Bold',    fontSize=7,  leading=10, textColor=INK3, spaceAfter=2, charSpace=1.0)
TAGLINE  = S('tagline', fontSize=11, leading=16, textColor=INK2, spaceAfter=0)
SUBHEAD  = S('subhead', fontName='Courier-Bold', fontSize=7.5, leading=10, textColor=INK3, spaceAfter=2, charSpace=1.0)

# ── Helpers ───────────────────────────────────────────────────────────────────
def amber_rule():
    return HRFlowable(width='100%', thickness=2, color=AMBER, spaceAfter=10, spaceBefore=3)

def hairline(before=4, after=8):
    return HRFlowable(width='100%', thickness=0.5, color=RULE, spaceAfter=after, spaceBefore=before)

def check(text):
    return Paragraph(f'[ ]  {text}', CHECK)

def outcome(text):
    data = [[Paragraph(f'NST OUTCOME — {text}', OUTCOME)]]
    t = Table(data, colWidths=[DOC_WIDTH])
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (-1, -1), AMBER_PALE),
        ('LEFTPADDING',  (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING',   (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 6),
        ('LINEBELOW',    (0, 0), (-1, -1), 1.5, AMBER),
    ]))
    return t

def stat_table(stats):
    """stats = [(num_str, label_str), ...]"""
    n = len(stats)
    col_w = (DOC_WIDTH - (n - 1) * 1) / n
    row = [[
        [Paragraph(num, STAT_N), Paragraph(lbl, STAT_L)]
        for num, lbl in stats
    ]]
    t = Table(row, colWidths=[col_w] * n)
    t.setStyle(TableStyle([
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
        ('TOPPADDING',    (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LINEABOVE',     (0, 0), (-1, -1), 0.5, RULE),
        ('LINEBELOW',     (0, 0), (-1, -1), 0.5, RULE),
        ('LINEBEFORE',    (1, 0), (-1, -1), 0.5, RULE),
    ]))
    return t

# ── Content ───────────────────────────────────────────────────────────────────
SECTIONS = [
    {
        'num':   '01',
        'title': 'BUILD THE CITIZEN CHANNEL FIRST',
        'intro': (
            'If citizens cannot reach city hall easily, nothing else in this checklist works. '
            'The channel is the infrastructure layer everything else runs on.'
        ),
        'expl': (
            'NST chose LINE OA because Thai citizens already use it daily. '
            'The city did not ask people to download a new app — it met them where they were. '
            'The result was 70% population adoption without any marketing budget. '
            'The critical design choice: two-way communication from day one. '
            'Broadcast-only channels build audiences. Two-way channels build trust.'
        ),
        'checks': [
            'Identify the one channel your citizens already use daily (LINE, Facebook, SMS, app)',
            'Establish a verified government presence in that channel within 30 days',
            'Enable two-way messaging — citizens can send reports, not just receive announcements',
            'Post at least three times per week to signal the channel is live and monitored',
            'Make the channel accessible to low-digital-literacy users (voice notes, simple menus)',
            'Link the channel to a real case-management backend so reports are actioned',
        ],
        'outcome': '112,000+ active users on @NakhonCity LINE OA; 70% of city population reached',
    },
    {
        'num':   '02',
        'title': 'CLOSE THE COMPLAINT LOOP',
        'intro': (
            'An open complaint loop destroys trust faster than no system at all. '
            'Citizens who report and hear nothing back stop reporting — and stop trusting. '
            'The loop closure is the product.'
        ),
        'expl': (
            'NST\'s complaint workflow follows five steps: receive, assign a case number, '
            'assign a responsible officer, notify the citizen at each status change, then rate. '
            'Every step is visible to the complainant. This visibility drove the 92% satisfaction rating. '
            'When people know their complaint has an ID and an owner, they behave like partners, '
            'not adversaries.'
        ),
        'checks': [
            'Every submitted complaint generates an automatic case number within 1 minute',
            'Each case is assigned to a specific named officer — no anonymous queues',
            'Citizen is notified automatically at each status change (assigned, in progress, resolved)',
            'Resolution is confirmed by the citizen, not just the officer',
            'Citizen rates the interaction after closure (1-5 stars, visible to management)',
            'Weekly report shows resolution rate, average time, and lowest-rated departments',
            'Resolution rate is published publicly each month',
        ],
        'outcome': '38,000 complaints resolved in 3 years; avg resolution time: 6.2 to 2.7 days (-56%)',
    },
    {
        'num':   '03',
        'title': 'INSTRUMENT YOUR DISASTER RISKS',
        'intro': (
            'Every Thai city has at least one seasonal disaster risk. '
            'The question is not whether it will happen — it is how much lead time '
            'you can give citizens to protect themselves.'
        ),
        'expl': (
            'NST\'s flood warning system combines upstream water sensors, city CCTV, '
            'and automated LINE alerts triggered at specific water-level thresholds. '
            'When sensors detect a critical level upstream, the system fires alerts '
            'to affected neighborhoods automatically — without a human in the loop. '
            'This removed the decision latency that has killed people in past flood events.'
        ),
        'checks': [
            'Map the top 3 seasonal risks in your city (flood, fire, storm, drought)',
            'For each risk: identify the upstream signal that predicts the event 6+ hours ahead',
            'Install sensors or subscribe to a data feed that monitors that signal continuously',
            'Set automated citizen alerts at defined risk thresholds — no manual trigger step',
            'Publish the alert protocol publicly so citizens know what each alert level means',
            'Conduct an annual simulation drill using the live warning system',
            'After each real event: post-mortem the warning timeline within 2 weeks',
        ],
        'outcome': '10-hour flood warning window; zero flood fatalities since system went live in 2021',
    },
    {
        'num':   '04',
        'title': 'MAKE THE MAYOR VISIBLE IN THE CHANNEL',
        'intro': (
            'Citizen adoption scales with the perceived authenticity of communication. '
            'If a chatbot sends all messages, citizens disengage. '
            'If the mayor shows up personally, adoption accelerates.'
        ),
        'expl': (
            '"You don\'t push high technology to people. Show them the benefit. They decide." '
            'This was the governing principle behind NST\'s Mayor\'s Classroom — a recurring '
            'live Q&A on LINE where Mayor Kanop Ketchart answered residents directly. '
            'The format is not complicated. The commitment is. '
            'A mayor reachable in the same channel citizens use for everything else '
            'changes the psychological relationship between government and citizen.'
        ),
        'checks': [
            'Mayor (or deputy) posts a personal update in the citizen channel at least weekly',
            'Hold monthly live Q&A sessions — minimum 30 minutes, unscripted questions',
            'Mayor must be able to explain every system benefit in 30 seconds without jargon',
            'When services fail, the mayor communicates the failure and the fix directly',
            'Do not delegate all posts to PR staff — personal authenticity is the mechanism',
        ],
        'outcome': "Mayor's Classroom = highest-engagement format in @NakhonCity; citizen trust: 41% to 70%",
    },
    {
        'num':   '05',
        'title': 'MEASURE WHAT CHANGES BEHAVIOR',
        'intro': (
            'The metric you pick shapes the behavior you get. '
            'If you measure complaint volume, staff will manage volume — '
            'by closing cases fast, not by solving problems. '
            'Measure what citizens actually care about.'
        ),
        'expl': (
            'NST tracked resolution time and satisfaction rating as its two primary metrics — '
            'not complaint volume, not service delivery speed. '
            'Resolution time measures whether the problem was actually fixed. '
            'Satisfaction measures whether the citizen felt heard. '
            'Both require genuine engagement, not just process compliance. '
            'These metrics were reviewed at weekly staff meetings, not monthly reports.'
        ),
        'checks': [
            'Select 2-3 citizen-facing metrics (not internal process metrics)',
            'Track resolution time: avg days from complaint to closure, confirmed by citizen',
            'Track satisfaction rating: post-interaction score, published by department',
            'Track channel adoption: active users as % of adult population, reviewed quarterly',
            'Review all three at weekly management meetings — not monthly',
            'Any department below 85% satisfaction triggers a mandatory improvement plan',
            'Publish an annual public report with actual numbers, not summaries',
        ],
        'outcome': 'Resolution time -56% over 3 years; satisfaction above 90% for 2 consecutive years',
    },
    {
        'num':   '06',
        'title': 'INCLUDE BEFORE YOU AUTOMATE',
        'intro': (
            'A digital system that reaches 112,000 users in a city of 160,000 adults '
            'is doing something right about inclusion. '
            'NST ran digital literacy sessions before pushing the app — not after.'
        ),
        'expl': (
            'The failure mode of smart city programs is a beautiful system that '
            'serves the already-connected 30% while leaving everyone else out. '
            'NST avoided this by sequencing correctly: '
            'understand who is excluded and why first, then design the inclusion path, '
            'then build the digital system on top. '
            'Mobile medical units, digital literacy training, and QR-based street-vendor '
            'catalogs all served populations that a pure-app strategy would have missed.'
        ),
        'checks': [
            'Map excluded populations before launch (elderly, rural, low-income, non-smartphone users)',
            'Design an offline or low-tech fallback for every digital service',
            'Run digital literacy sessions for target populations before the system goes live',
            'Deploy a mobile service unit for neighborhoods where citizens cannot reach city hall',
            'QR-accessible or LINE-menu service options for informal economy workers',
            'Track adoption by neighborhood, not just city-wide (to detect coverage gaps)',
            'Set a city-wide adoption target and review annually (NST aimed for 70%)',
        ],
        'outcome': '70% population adoption; AI School: 6,000+ students; Hospital on Wheels in underserved areas',
    },
]


def build(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LMARGIN, rightMargin=RMARGIN,
        topMargin=25 * mm, bottomMargin=20 * mm,
        title='NST Checklist for Smart Cities',
        author='depa Smart City Promotion Department / SCITI 2026',
        subject='A citizen-first smart city implementation guide based on the Nakhon Si Thammarat model',
    )

    story = []

    # ── Cover ─────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 16 * mm))
    story.append(amber_rule())
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph('NST CHECKLIST', DISPLAY))
    story.append(Paragraph('FOR SMART CITIES',
        S('d2', fontName='Helvetica-Bold', fontSize=28, leading=33, textColor=AMBER, spaceAfter=4)))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph('(and Explanation)', TAGLINE))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        'A citizen-first implementation guide based on the Nakhon Si Thammarat model — '
        'a mid-size Thai city that achieved 112,000+ active app users, '
        '38,000 complaints resolved, and zero flood fatalities since 2021 '
        "without Bangkok's budget.",
        BODY,
    ))
    story.append(Spacer(1, 5 * mm))
    story.append(stat_table([
        ('112,000+', 'Active app users'),
        ('38,000',   'Complaints resolved\nin 3 years'),
        ('70%',      'Citizen trust\n(from 41%)'),
        ('0',        'Flood fatalities\nsince 2021'),
    ]))
    story.append(Spacer(1, 8 * mm))
    story.append(hairline(before=0, after=5))
    story.append(Paragraph(
        'SCITI 2026  ·  Smart City Thailand Index  ·  depa Smart City Promotion Department',
        CAPTION))
    story.append(Paragraph('cdp.nonarkara.org  ·  June 2026', CAPTION))
    story.append(PageBreak())

    # ── Introduction ──────────────────────────────────────────────────────────
    story.append(Paragraph('INTRODUCTION', EYEBROW))
    story.append(Paragraph('Why this checklist exists', H1))
    story.append(amber_rule())
    story.append(Paragraph(
        'Nakhon Si Thammarat (NST) is not Thailand\'s largest city. It does not have Bangkok\'s '
        'budget, Singapore\'s consultants, or Seoul\'s tech infrastructure. It is a provincial '
        'municipality in the south of Thailand with a population of roughly 160,000.',
        BODY,
    ))
    story.append(Paragraph('That is exactly why it matters.', BOLD))
    story.append(Paragraph(
        'Between 2019 and 2025, NST built a citizen-centric smart city system using tools '
        'most Thai cities already have access to: LINE OA, a complaint management workflow, '
        'upstream flood sensors, and a mayor willing to show up in the same channel residents use. '
        'The result was not a technology showcase. It was a governance upgrade — '
        'one that changed how citizens experienced their relationship with city hall.',
        BODY,
    ))
    story.append(Paragraph(
        'This checklist extracts the replicable mechanics. It is structured as six blocks, '
        'each with the action, the explanation, and the documented outcome. '
        'The goal is not to copy NST. It is to understand why it worked, and apply that logic '
        "to your city's specific constraints.",
        BODY,
    ))
    story.append(Spacer(1, 5 * mm))
    story.append(stat_table([
        ('56%',    'Reduction in avg\nresolution time\n(6.2 to 2.7 days)'),
        ('6,000+', 'AI School students\nreached'),
        ('92%',    'Citizen satisfaction\nrating'),
        ('4',      'International awards\n2022 to 2025'),
    ]))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph(
        'HOW TO USE THIS CHECKLIST — Work through each block in order. '
        'The blocks build on each other: you cannot close the complaint loop (Block 02) '
        'if the citizen channel (Block 01) is not working. '
        'Each block has a checkbox list for your team and an explanation of the underlying logic. '
        'The NST Outcome box shows what happened when the block was executed correctly.',
        CAPTION,
    ))
    story.append(PageBreak())

    # ── Six blocks ────────────────────────────────────────────────────────────
    for i, sec in enumerate(SECTIONS):
        story.append(Paragraph(f'BLOCK {sec["num"]}', EYEBROW))
        story.append(Paragraph(sec['title'], H1))
        story.append(amber_rule())
        story.append(Paragraph(sec['intro'], ITALIC))
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph('EXPLANATION', SUBHEAD))
        story.append(Paragraph(sec['expl'], BODY))
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph('CHECKLIST', SUBHEAD))
        for c in sec['checks']:
            story.append(check(c))
        story.append(Spacer(1, 3 * mm))
        story.append(outcome(sec['outcome']))

        is_last = (i == len(SECTIONS) - 1)
        if is_last:
            story.append(PageBreak())
        elif i % 2 == 1:
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 6 * mm))
            story.append(hairline())

    # ── Closing ───────────────────────────────────────────────────────────────
    story.append(Paragraph('ABOUT THIS DOCUMENT', EYEBROW))
    story.append(Paragraph('SCITI 2026 — Smart City Thailand Index', H1))
    story.append(amber_rule())
    story.append(Paragraph(
        'SCITI 2026 is an independent performance benchmark covering 118 Thai cities '
        'across 7 pillars: livability, economy, safety, wellbeing, environment, hospitality, '
        'and digital readiness. Nakhon Si Thammarat ranks as an Alpha-tier city '
        '(composite score 61.3/100) — the highest classification in the index.',
        BODY,
    ))
    story.append(Paragraph(
        'This document is published under the SCITI 2026 case-study series. '
        'The NST figures cited are drawn from municipal case materials, '
        'the depa Smart City Promotion Department nomination files, '
        'and the ASEAN CSCO Handbook (2025 edition). '
        'They are presented as documented case evidence, not live telemetry.',
        BODY,
    ))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph('REFERENCES', SUBHEAD))
    story.append(Spacer(1, 2 * mm))
    for ref in [
        'Nakhon Si Thammarat Municipality — NST Report (municipal case-study material)',
        'Nakhon Innovative Flood Control (2022) — project documentation',
        'depa Nomination File — Batch 3 Smart City Local (2023)',
        'ASEAN CSCO Handbook — Nakhon Si Thammarat case study (2025)',
        'SCITI 2026 city profile: cdp.nonarkara.org/city/nakhon-si-thammarat',
    ]:
        story.append(Paragraph(f'·  {ref}', CAPTION))
    story.append(Spacer(1, 6 * mm))
    story.append(hairline(before=0, after=5))
    story.append(Paragraph(
        'SCITI 2026  ·  depa Smart City Promotion Department  ·  cdp.nonarkara.org  ·  June 2026',
        CAPTION,
    ))

    doc.build(story)
    print(f'PDF saved: {output_path}')


if __name__ == '__main__':
    out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'public', 'nst-checklist.pdf',
    )
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build(out)
