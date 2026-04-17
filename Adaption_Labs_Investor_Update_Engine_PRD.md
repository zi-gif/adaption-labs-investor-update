# Investor Update Engine: Product Requirements Document

**Author**: Zi
**Last updated**: 2026-04-16
**Status**: Draft v1, ready to build
**Target ship**: 2026-04-18 (two-day sprint)

---

## 0.1 Locked decisions (2026-04-16)

Resolved during PRD refinement, override any earlier language in this doc.

| Area | Decision |
|---|---|
| Stack | Next.js 15 (app router) + TypeScript + Tailwind, package manager **Bun** |
| Hosting | Vercel (Zi owns deploy; this repo pushes to GitHub, Vercel auto-builds from `main`) |
| Repo | `zi-gif/adaption-labs-investor-update`, public, MIT license |
| API key | `ANTHROPIC_API_KEY` as Vercel env var; server-side only, never exposed client-side |
| Rate limit | 10 generations / IP / day. Upstash Redis via `@upstash/ratelimit` when `UPSTASH_*` env vars set; in-memory Map fallback for local dev |
| Logo | Adaption Labs logo + wordmark OK to use (Zi confirmed); still use `/frontend-design` skill for overall UI polish |
| Fonts | Adaption ships STK Bureau Sans (licensed, can't redistribute). Sub with **Inter** via `next/font/google`, which is the closest free grotesque |
| Palette (sampled from adaptionlabs.ai) | Bg `#FAFAFA`, text `#1a1718`, primary accent `#d55e1e` (burnt orange), soft peach `#f9ae7c`, teal accent `#004652`, warn/flag amber `#ffffbe` on `#77433a` |
| Scenario banner | Persistent, not dismissible |
| Prior updates | Seeded Jan/Feb/Mar 2026; users **can add new months** via localStorage (no server persistence) |
| Eval failure UX | Draft renders normally; flag panel shows "Flags unavailable" with a manual retry button. No silent auto-retry |
| Consistency flag JSON shape | `{ excerpt, source_month, drift_type, priority, suggested_addition, relevant_investors }` (keep `relevant_investors` for now; revisit after first demo) |
| Prior updates sender | Sara Hooker for all three seeded months |
| About page | Dedicated `/about` route with framing and real-vs-fabricated disclosure. **Do not** mention "two-day sprint" on the page (that's for the live demo, not the public artifact) |
| Loom / video | None. Demo runs live in the interview |

---

## 0. Content rules (apply to all generated output)

- **No em dashes.** Use commas, semicolons, periods, or parentheses instead. This applies to all Claude-generated text (investor updates, consistency flags, UI copy). Bake this into every system prompt.
- **No emoji** in generated content. UI section labels can use minimal, functional icons (not decorative).

---

## 1. Context

This tool accompanies an application for the **Special Projects Lead** role at [Adaption Labs](https://www.adaptionlabs.ai), the AI lab building efficient, adaptive intelligence that evolves in real time. The JD is dense on five workstreams, but two tower above the rest: (1) "unlock day-to-day execution" including investor/board infrastructure, and (2) "scale team operations globally" for a distributed team growing fast across the US, Canada, UK, and beyond. The tool targets the first; its design intelligence signals fluency in the second.

It is not a portfolio piece. It is a Day-1 operating tool that a recruiter can navigate and that Sara or Sudip could use as-is to draft a real investor update and catch their own narrative drift before investors do. Everything in the tool is either (a) grounded in public data about Adaption Labs or (b) clearly labeled as fabricated demo data.

## 2. Strategic rationale

Three things the tool has to prove, in order:

1. **I understand what this role actually does at a post-seed AI lab.** Adaption closed a $50M seed at a $1B valuation on February 4, 2026, with 7 investor entities. Monthly updates are now a recurring obligation. This is exactly the kind of undefined, high-priority operational task ("doesn't fit neatly into anyone else's job description") the JD describes.
2. **I think like an investor.** The metrics, structure, and consistency tracking are shaped by what seed-stage investors actually care about and notice. Geographic team expansion, customer onboarding velocity, narrative follow-through, not vanity metrics.
3. **I ship.** Built in two days with Claude as a working partner, deployed live, defensible under live demo.

## 3. The fabricated scenario (the frame)

The tool operates under this premise, visible on the landing screen:

> **Scenario**: It is April 2026. Adaption Labs closed its $50M seed led by Emergence Capital Partners in February. The team has grown from the founding duo to ~18 people across four countries. Adaptive Data is onboarding its first enterprise design partners. Adaptive Intelligence is on waitlist. This tool is the Special Projects Lead's workspace for keeping 7 investors informed, aligned, and activated.

This frame is defensible: the seed closed Feb 4, the team is actively hiring across 10+ location tags on their careers page, and their website shows "Now onboarding" for Adaptive Data and "Join the waitlist" for Adaptive Intelligence. It is clearly labeled as hypothetical on the landing screen.

## 4. Product overview

Single-page web app with one primary workflow and one shared data layer.

```
+---------------------------------------------+
|  Investor Update Engine / Adaption Labs      |
|  [Draft Update]  [Prior Updates]             |
+---------------------------------------------+
|                                              |
|   Active view content                        |
|                                              |
+---------------------------------------------+
|  Sidebar: Consistency Flags (on generate)    |
+---------------------------------------------+
```

The main view is the update drafter. Prior updates are reference-only (demo seed data). The consistency engine reads across all updates and surfaces drift in a side panel.

## 5. Feature spec

### 5.1 Primary View: Investor Update Drafter & Consistency Tracker

**Purpose**: the monthly investor update artifact, with drift detection across prior months. A recurring time-sink for a founding CEO turned into a 10-minute workflow. Short, scannable output, not a production letter.

**Input form**:

- Month selector (Apr 2026 is "draft new")
- Sent by: Sara Hooker (CEO) / Sudip Roy (CTO) toggle
- Sections, pre-structured:

  **TL;DR** (one-liner, 280 char limit)
  Placeholder: "The single most important thing this month. Write it like a headline."

  **Key Metrics** (pre-labeled fields, not generic):

  | Field | Type | Why this metric |
  |---|---|---|
  | Team size (current) | Number | Adaption values "talent density." Headcount is the primary execution signal post-seed. |
  | New hires this period | Number | Hiring velocity matters to Emergence Capital, who led at $1B on a team thesis. |
  | New hire countries | Multi-select tags | Pre-populated: US (SF, NYC), Canada, UK, Poland, Brazil, India, Other. Pulled from Adaption's actual careers page location tags. Sara's career is defined by global hiring (Aya: 3,000 researchers, 119 countries). Investors will track geographic expansion. |
  | Cash on hand ($M) | Number | Standard. |
  | Monthly burn ($K) | Number | Standard. |
  | Runway (months) | Auto-calculated | = Cash / Burn. Display only. |
  | Adaptive Data: customers onboarding | Number | Their site says "Now onboarding." This is the live product. |
  | Adaptive Intelligence: waitlist size | Number | Their site says "Join the waitlist." Tracks inbound demand for the next product surface. |
  | Adaptive Interfaces: status | Dropdown | Not yet launched / In design / Early prototype. Tracks the third product pillar. |

  **Wins this month** (textarea, 3-5 bullets)
  Placeholder: "Research milestone, key hire, customer win, press, partnership signal."

  **Challenges / risks** (textarea)
  Placeholder: "Be honest. Investors reward transparency; silence creates its own narrative."

  **Key Hires Spotlight** (repeatable card, up to 3):
  Name / Role / Location / One-line bio (100 char)
  This section exists because Adaption's investor thesis depends on assembling world-class global research talent. Emergence Capital is backing Sara Hooker's ability to do this.

  **Asks** (textarea)
  Placeholder: "Intros, candidates, design partners, signal. The highest-leverage section of any update."

  **Press & Links** (repeatable row, up to 5):
  Title / URL

- "Generate update" button

**Output** (rendered on-page, copy/export options):

1. **Drafted investor update** in tight, scannable format (~300 words). Brief narrative opening, metrics with one-line commentary, wins, risks, hires, asks. Written in a voice appropriate for an AI research lab (precise, confident, no hype).
2. **Consistency flags panel**. A side panel listing narrative drift detected vs. prior updates:
   - "Feb update mentioned 'early conversations with two Fortune 500 financial services firms.' Mar said one signed an onboarding agreement. This month is silent on the second. Investors will notice."
   - "Jan set a target of 15 team members by end of Q1. Current headcount is 18. Worth calling out the overshoot; it's a good signal."
   - "Feb mentioned exploring Nvidia partnership for inference optimization. No mention since. Worth a one-liner even if unchanged."
   - Each flag shows: the prior-update excerpt, the drift type (silence / contradiction / softened language / thread resolved), and a suggested addition.

**Prior-update seed data**: three fabricated "previous months" (Jan, Feb, Mar 2026) stored as markdown, clearly labeled as demo data in the UI. They contain intentional narrative threads that the consistency tracker will catch:

| Thread | Planted in | Expected drift to catch |
|---|---|---|
| Enterprise pilot conversations (2 Fortune 500 finserv firms) | Jan, Feb | One signed in Mar; second goes silent in Apr draft |
| Nvidia inference partnership exploration | Feb | No follow-up in Mar or Apr |
| Q1 headcount target of 15 | Jan | Exceeded (18 by Apr); positive drift, worth surfacing |
| UK employment law setup with Wilson Sonsini | Feb, Mar | Resolved in Mar; tracker should note thread closure |
| Multilingual model adaptation as differentiation | Jan | Consistent thread; no flag needed unless language changes |

**Claude call shape**: two sequential calls.
1. **Draft pass** (Sonnet 4.6): generates the ~300-word update from the user's structured input. Creative/writing layer.
2. **Evaluation pass** (Sonnet 4.6): takes the draft plus all prior monthly updates, compares them, and produces structured consistency flags as JSON. This pass never modifies the draft; it only surfaces what an investor would notice. Separated so the evaluation is independent and honest.

**Why not Opus for evaluation?** Sonnet 4.6 is sufficient for structured comparison tasks and keeps latency tight for a live demo. If the flags feel shallow during testing, upgrade the eval pass to Opus.

### 5.2 Secondary View: Prior Updates (Read-Only)

A simple tab that displays the three fabricated prior updates (Jan, Feb, Mar 2026) as formatted markdown. Purpose: lets the recruiter read the seed data that the consistency engine is reasoning over. Builds trust that the flags aren't fabricated.

### 5.3 Export Options

| Action | Implementation |
|---|---|
| Copy as plain text | Clipboard API. One click. The thing Sara would paste into Gmail. |
| Copy as HTML | Styled HTML for rich-text email clients. |
| Download as Markdown | .md file for archival in internal docs. |

## 6. Demo data (pre-populated for the walkthrough)

All fields pre-filled on first load with plausible but clearly sample data:

| Field | Demo Value |
|---|---|
| Month | April 2026 |
| Sent by | Sara Hooker (CEO) |
| TL;DR | "Shipped v0.1 of Adaptive Data to our first three enterprise design partners and grew the team to 18 across four countries." |
| Team size | 18 |
| New hires | 4 |
| New hire countries | San Francisco, Toronto, London, Nairobi |
| Cash on hand | $44M |
| Monthly burn | $850K |
| Runway | 51.8 months (auto) |
| Adaptive Data customers | 3 |
| Adaptive Intelligence waitlist | 127 |
| Adaptive Interfaces status | In design |
| Win 1 | "First external deployment of Adaptive Data with a Fortune 500 financial services partner. Early signal: 40% reduction in retraining cost vs. their current fine-tuning pipeline." |
| Win 2 | "Hired Dr. [Name], ex-DeepMind, as Research Lead in London. First senior research hire outside North America." |
| Win 3 | "Sara keynoted at [Conference]. 30+ enterprise inquiries in the week after." |
| Challenge 1 | "Senior ML infrastructure hiring remains competitive. Two final-round candidates accepted counteroffers. Adjusting comp bands and sourcing strategy." |
| Challenge 2 | "Navigating employment law across four jurisdictions simultaneously. Legal coordination with Wilson Sonsini ongoing." |
| Key Hire | Dr. [Name] / Research Lead / London / "Ex-DeepMind, 8 years in efficient inference. Led pruning research at scale." |
| Ask 1 | "Intros to Head of AI or CTO-level contacts at mid-market financial services firms (Series C+) exploring custom model adaptation." |
| Ask 2 | "Referrals for senior ML infra engineers, especially candidates with distributed systems experience open to Toronto or London." |
| Press 1 | "Adaption Labs secures $50 million seed round" / Fortune, Feb 4, 2026 |
| Press 2 | "Why Cohere's ex-AI research lead is betting against the scaling race" / TechCrunch, Oct 22, 2025 |

## 7. Investor database (hardcoded)

These 7 investors appear in the email recipient context and inform the consistency engine's judgment about what investors care about. Not a full CRM; just enough structure to make the output intelligent.

| Investor | Role in Round | Why They Care About What |
|---|---|---|
| **Emergence Capital Partners** | Lead | Enterprise SaaS/AI focus. Led at $1B. Will scrutinize product-market fit signals, burn efficiency, and whether the "adaptive" thesis translates to enterprise willingness-to-pay. |
| **Mozilla Ventures** | Participant | Mission-aligned: open, accessible AI. Will track multilingual progress, open-source contributions, global team diversity. |
| **Fifty Years** | Participant | Deep-tech, long-horizon fund. Cares about technical moat and research differentiation vs. scaling labs. |
| **Threshold Ventures** | Participant | Enterprise infrastructure focus. Will watch developer adoption metrics and go-to-market velocity. |
| **Alpha Intelligence Capital** | Participant | AI-specialist fund. Will benchmark Adaption's technical claims against the broader AI lab landscape. |
| **E14 Fund** | Participant | MIT-connected. Research credibility and talent pipeline matter. |
| **Neo** | Participant | Community-driven fund. Hiring velocity and founder brand matter. |

The consistency engine uses this context: a flag about stalled enterprise pilots is marked higher-priority because Emergence (the lead) cares most about enterprise traction. A flag about open-source contributions is marked relevant to Mozilla Ventures specifically.

## 8. Visual direction

Match the Adaption Labs website (adaptionlabs.ai) closely. The tool should feel like it belongs in their product ecosystem, not like an external app.

**Reference (from adaptionlabs.ai)**:
- Clean, modern layout with generous whitespace
- Warm gradient backgrounds (peach/coral tones transitioning to deeper hues)
- Dark text on light surfaces for body content
- Sans-serif typography throughout (clean, modern, no decorative fonts)
- Subtle section dividers, no heavy borders
- Muted, sophisticated color palette (no neon, no primary-color CTAs)
- Product cards with clear labels: "Adaptive Data," "Adaptive Intelligence," "Adaptive Interfaces"
- Footer: "Everything intelligent adapts. So should AI." in centered, elegant type
- Overall tone: confident, restrained, research-lab aesthetic (not SaaS-bright, not dark-mode-hacker)

**Applied to the tool**:
- Header: "Investor Update Engine" in clean sans-serif, with subtle "Adaption Labs" wordmark
- Light/warm background, matching the site's gradient subtlety (not a full gradient; a warm off-white or very soft peach tint)
- Content panels: white or near-white cards with subtle shadows, not bordered boxes
- Generated output: rendered in the same sans-serif, generous line-height, easy to scan
- Buttons: warm accent color for primary ("Generate Update"), outlined for secondary ("Copy to Clipboard")
- Consistency flags: soft amber or warm tone, distinct but not alarming. Feels like a thoughtful nudge, not an error state
- Scenario banner: subtle, top of page, warm-toned pill badge style
- Footer note: "Built by Zi in 2 days, Apr 2026, for the Special Projects Lead application. All scenarios hypothetical except where linked."

Use the `/frontend-design` skill during implementation. The aesthetic has to survive a founder's design eye, and Sara Hooker's team includes brand designers and design engineers.

## 9. Technical architecture

**Stack**:
- React (single .jsx file, rendered as Claude artifact OR deployable standalone)
- Tailwind CSS for styling
- Anthropic API calls for generation (Sonnet 4.6)
- No backend, no auth, no persistence. Stateless. Refresh loses output; that's fine for a demo.

**Alternative (if deploying to Vercel)**:
- Next.js 15 app router
- Server route `/api/generate-update` calls Anthropic SDK
- `ANTHROPIC_API_KEY` as Vercel env var (server-side only)
- Prior updates stored as markdown in `/data/prior-updates/`

**Models**:
- Sonnet 4.6 (`claude-sonnet-4-6`) for both draft and evaluation passes
- Upgrade eval to Opus 4.6 only if consistency flags are shallow during testing

**Streaming**: the draft endpoint streams to the UI so the user watches the update unfold. Best way to show "Claude is doing the work" in a live demo.

**Prompt architecture**:

*Draft pass system prompt* includes:
- Adaption Labs fact sheet (company context, product pillars, team, thesis)
- Investor list with "what they care about" context
- Tone rules: precise, confident, no hype, no em dashes, no emoji
- Structure rules: ~300 words, narrative opening, metrics with commentary, wins, risks, hires, asks
- Instruction to write as if Sara Hooker is sending this to her investors

*Evaluation pass system prompt* includes:
- All prior monthly updates (Jan, Feb, Mar) as full text
- The freshly generated April draft
- Investor context (who cares about what)
- Instruction to produce JSON array of flags: `{ excerpt, source_month, drift_type, priority, suggested_addition }`
- Instruction to never modify the draft, only observe

## 10. Build plan (two days)

### Day 1: Foundation + Core Workflow
- [ ] Scaffold app (React/Next.js), Tailwind, deploy-preview wired
- [ ] Write Adaption Labs fact sheet (single markdown, used in every prompt)
- [ ] Write 3 fabricated prior updates (Jan/Feb/Mar 2026) with embedded narrative threads per Section 5.1 table
- [ ] Build input form with all fields from Section 5.1, pre-populated with demo data from Section 6
- [ ] Draft generation: prompt template, Anthropic SDK, streaming render
- [ ] Export: copy-to-clipboard (plain text + HTML), download markdown
- [ ] Deploy, verify live URL generates a real update

### Day 2: Consistency Engine + Polish
- [ ] Evaluation pass: prompt template, JSON parse, render flags in side panel
- [ ] Prior Updates tab: display Jan/Feb/Mar seed data as formatted markdown
- [ ] Aesthetic pass using `/frontend-design` skill, match adaptionlabs.ai
- [ ] Scenario banner with the post-seed frame
- [ ] Footer attribution note
- [ ] End-to-end demo walkthrough: generate update, flags fire, export works
- [ ] README with build notes, demo script, honest notes on real vs. fabricated
- [ ] Record Loom (3 min) linked from README for async reviewers

### Buffer / nice-to-have (only if time)
- Flag priority ranking by investor relevance (e.g., enterprise flag ranked higher because Emergence cares)
- Investor-specific "what to mention" suggestions based on the database
- Dark mode toggle (skip unless trivial)

## 11. Success criteria

The tool ships successfully if:

1. **A recruiter can land cold at the URL, understand the scenario in 30 seconds, and generate a complete investor update in under 2 minutes of clicking.**
2. **Sara or Sudip could use the output for a real investor email without edits beyond personalization.** Highest bar. The update should read like a human operator wrote it.
3. **The consistency tracker catches at least 3 drift flags on the demo seed data**, with accurate source excerpts and actionable suggestions.
4. **The visual survives a founder's design eye** (no generic AI slop; matches Adaption's aesthetic).
5. **Live demo runs cleanly in under 4 minutes.**

### Demo script (3-4 minutes)

**[0:00-0:30] Context**
Open URL. Point to scenario banner. "Adaption just closed $50M with 7 investors. Sara and Sudip now owe monthly updates. This is a recurring operational task that starts immediately post-close and never stops. I built a tool to compress it."

**[0:30-1:30] The form**
Walk through pre-filled fields. Call out:
- Metrics are Adaption-specific, not generic SaaS (Adaptive Data onboarding count, Adaptive Intelligence waitlist, team by geography)
- Runway auto-calculates
- "Key Hires Spotlight" exists because talent density is a stated company value and global hiring is Sara's track record from Cohere/Aya
- "Asks" is the highest-leverage section; this is where updates generate ROI for the founder

**[1:30-2:30] Generate + consistency flags**
Hit generate. Watch the update stream. Then: "But the real feature is this." Point to the consistency panel.
- "Feb mentioned two enterprise pilot conversations. Mar reported one signed. The tool caught that the second one went silent."
- "Jan set a Q1 headcount target of 15. We're at 18. The tool flags this as a positive signal worth calling out."
- "Feb mentioned exploring an Nvidia inference partnership. No update since. The tool suggests a one-liner."

**[2:30-3:15] Why this matters for Adaption specifically**
"This isn't a generic investor update tool. The metrics map to Adaption's three product pillars: Adaptive Data, Adaptive Intelligence, Adaptive Interfaces. The hire spotlight tracks geographic expansion because that's how Sara has always built teams. The consistency engine knows that Emergence Capital, as the lead, cares most about enterprise traction, so it prioritizes those flags. Every design decision is an Adaption decision."

**[3:15-3:45] The close**
"This took me two days to build. If I had the role, the next version would pull headcount from your HRIS, auto-track narrative threads across quarters, and generate board deck slides from accumulated updates. But the point isn't the tool. It's the instinct: find the operational friction, build the creative fix, give the founders their time back."

**[3:45-4:00]** "Here's the repo." Link GitHub.

## 12. Out of scope (v1)

Explicitly cut to protect the two-day sprint:

- Meeting prep / pitch brief generator (real v2 feature)
- Board deck auto-generation from accumulated updates
- Investor CRM features (pipeline, next steps, open rate tracking)
- HRIS integration for auto-pulling headcount by location
- Email provider integration (Gmail API / SendGrid)
- PDF or Google Doc export
- Auth, multi-user, saved sessions
- Real-time web search grounding (relies on curated data + Claude's training knowledge)

Noted in README as "v2 surface area."

## 13. Open questions

1. **Team size accuracy**: Adaption's exact current headcount is not public. Demo uses 18 as a plausible estimate (founding duo + 2 months of aggressive post-seed hiring across 7+ open roles). Acceptable given the scenario is explicitly hypothetical.
2. **Product naming precision**: the site uses "Adaptive Data," "Adaptive Intelligence," and "Adaptive Interfaces" as the three pillars. Confirm these are stable product names or marketing labels before the demo. Current evidence suggests they're real product lines.
3. **Tone calibration**: Sara Hooker's public voice is precise, intellectually confident, globally minded, and allergic to hype. The generated update should match this. Test with a few generations and tune the system prompt if needed.
4. **Landing framing**: small footer note ("Built by Zi in 2 days, Apr 2026, for the Special Projects Lead application. All scenarios hypothetical except where linked.") so a cold visitor has context without a heavy splash.

---

## 14. Reference data

### Investor List (Verified)

| Investor | Role | Source |
|---|---|---|
| Emergence Capital Partners | Lead | Fortune, Feb 4, 2026 |
| Mozilla Ventures | Participant | Fortune, Feb 4, 2026 |
| Fifty Years | Participant | Fortune, Feb 4, 2026 |
| Threshold Ventures | Participant | Fortune, Feb 4, 2026 |
| Alpha Intelligence Capital | Participant | Fortune, Feb 4, 2026 |
| E14 Fund | Participant | Fortune, Feb 4, 2026 |
| Neo | Participant | Fortune, Feb 4, 2026 |

### Legal Counsel (Verified)

Wilson Sonsini Goodrich & Rosati
Team: Lang Liu, Alex Youssef, MJ Han, Mackenzie Tobin, Kate Secrest
Source: Wilson Sonsini announcement, Feb 5, 2026

### Key Company Facts

| Fact | Value | Source |
|---|---|---|
| Founded | 2025 | BetaKit, Oct 9, 2025 |
| HQ | San Francisco, CA | Fortune, Feb 4, 2026 |
| Seed round | $50M | Fortune, Feb 4, 2026 |
| Valuation | $1B | Pulse2, Feb 9, 2026 |
| CEO | Sara Hooker | Multiple sources |
| CTO | Sudip Roy | BetaKit, Oct 9, 2025 |
| Product pillars | Adaptive Data (onboarding), Adaptive Intelligence (waitlist), Adaptive Interfaces (early) | adaptionlabs.ai |
| Hiring locations | SF, NYC, US, Canada, UK, Poland, Brazil, India, Latin America, Europe, Global Remote | adaptionlabs.ai/careers |
| Open roles (Apr 2026) | ML Engineer, Research Scientist, AI Systems Engineer, Growth Lead, Community Ops Lead, Forward Deployed ML Engineer, Special Projects Lead | adaptionlabs.ai/careers |
| Core thesis | Efficient adaptive AI that learns continuously, without expensive retraining | TechCrunch, Oct 22, 2025 |
| Differentiation | Gradient-free learning, malleable datasets, continual learning; betting against brute-force scaling | Fortune, Feb 4, 2026 |
| Tagline | "Everything intelligent adapts. So should AI." | adaptionlabs.ai |

### Sara Hooker Background

- Co-founder & CEO, Adaption Labs (2025-present)
- VP of Research & Head of Cohere for AI, Cohere (2022-2025)
- Research Scientist, Google Brain / DeepMind (2017-2022)
- Founded Google's first AI research office in Accra, Ghana
- Led Aya project: 3,000+ researchers, 119 countries, 101 languages, largest ML open-science effort
- TIME100 Most Influential People in AI (2024)
- Fortune AI Top 13 Innovators (2023)
- PhD, Mila, Quebec AI Institute
- Founded Delta Analytics (2014), nonprofit technical capacity building
- Grew up across Africa (South Africa, Mozambique, Lesotho, Eswatini, Kenya)

### Sudip Roy Background

- Co-founder & CTO, Adaption Labs (2025-present)
- Senior Director of Inference, Cohere (2021-2025)
- Director of Engineering, Cohere
- Research Scientist, Google (7 years)

### Narrative Threads for Prior Updates (fabricated, for consistency engine)

| Thread | Jan | Feb | Mar | Apr (expected drift) |
|---|---|---|---|---|
| Enterprise finserv pilots | "In early conversations with two Fortune 500 financial services firms exploring adaptive inference" | "One pilot moving to technical evaluation; second still in commercial discussion" | "First pilot signed onboarding agreement; deployment begins April" | Second firm goes silent. Tracker flags it. |
| Nvidia inference partnership | -- | "Exploring partnership with Nvidia on inference optimization for adaptive models" | -- | No update. Tracker flags silence. |
| Q1 headcount target | "Targeting 15 team members by end of Q1" | "Team at 11, 4 offers out" | "Team at 14, on track" | At 18, exceeded. Tracker flags positive overshoot. |
| UK legal setup | -- | "Working with Wilson Sonsini on UK employment structure for first London hires" | "UK entity established; first London offer extended" | Thread resolved. Tracker notes closure. |
| Multilingual adaptation | "Our approach to multilingual adaptation, informed by Aya, is a core differentiator" | "Multilingual benchmarks showing 2x coverage vs. comparable efficient models" | "Expanding language coverage to 30+ languages in Adaptive Data v0.1" | Consistent thread. No flag unless language softens. |

---

**Ready to build.**
