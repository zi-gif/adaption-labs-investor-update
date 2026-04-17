# Adaption Labs Investor Update Engine

A working artifact for the Special Projects Lead application at
[Adaption Labs](https://www.adaptionlabs.ai). It turns structured monthly inputs
into a scannable ~300-word investor update, then runs a second pass that reads
the draft against prior months and surfaces drift (silence, contradiction,
resolved threads, positive overshoot) an investor would notice.

Live demo (Vercel): _link to be added after deploy_

## What it does

Two Claude calls, one shared fact sheet.

1. **Draft pass**. Claude Sonnet 4.6 reads Adaption's public fact sheet plus
   the form input, streams a monthly update in Sara Hooker's voice. Precise,
   confident, no hype, no em dashes.
2. **Evaluation pass**. Same model, different job. It reads all prior months
   plus the fresh draft and returns structured flags: excerpt, source month,
   drift type, priority, suggested addition, relevant investors. Read-only,
   never modifies the draft.

The evaluation is weighted: flags touching the lead investor's thesis (Emergence
on enterprise pilots, burn efficiency) are prioritized over generic continuity
notes.

## What is real

- Company, founders, thesis, $50M seed at $1B (Feb 4, 2026), 7-investor cap
  table, legal counsel, hiring locations, product pillars, open roles. All
  cited from public sources (Fortune, BetaKit, TechCrunch, Pulse2,
  adaptionlabs.ai).
- Every specific metric in the demo form is **fabricated**. So are the three
  prior-month updates (Jan, Feb, Mar 2026), all named hires except Sara and
  Sudip, and the narrative threads the consistency engine flags.

A persistent scenario banner at the top of every page marks the frame.

## Stack

- Next.js 16 (app router), TypeScript, Tailwind v4, Bun.
- Anthropic SDK, Claude Sonnet 4.6.
- Streaming draft over a server route.
- Upstash Redis rate-limit (10 generations per IP per day), in-memory fallback
  for local dev.
- No auth, no database. Prior updates seeded as markdown; user-added months
  live only in the browser's localStorage.

## Setup

```bash
bun install
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY (required)
# UPSTASH_* vars are optional; without them rate-limit falls back to in-memory
bun run dev
```

Open http://localhost:3000.

## Deploy (Vercel)

1. Push to GitHub (this repo is at
   [zi-gif/adaption-labs-investor-update](https://github.com/zi-gif/adaption-labs-investor-update)).
2. Import into Vercel (auto-detects Next.js).
3. Add environment variables in Vercel:
   - `ANTHROPIC_API_KEY` (required)
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (recommended for
     production: add the Upstash integration from the Vercel marketplace,
     which populates these automatically)
4. Deploy. The default build settings work as-is.

## Structure

```
app/
  page.tsx                  Draft Update view (main)
  prior-updates/page.tsx    Prior updates view (seed + user-added)
  about/page.tsx            Framing, real-vs-fabricated, stack
  api/
    generate-update/        Streaming draft endpoint
    evaluate/               Consistency-flag endpoint
    prior-updates/          Seeded prior updates (GET)
components/                 UI (client components)
data/
  adaption-facts.md         Company context, used in every system prompt
  investors.ts              7-investor cap table with thesis notes
  prior-updates/            Three seeded monthly updates (markdown)
lib/
  prompts.ts                Draft + evaluation system prompts
  anthropic.ts              Anthropic client
  rate-limit.ts             Upstash + in-memory fallback
  types.ts                  Shared types
  demo-defaults.ts          Pre-populated form data
  user-updates.ts           localStorage helpers for user-added months
```

## Design

Palette and type are tuned to match adaptionlabs.ai. Adaption's site uses
STK Bureau Sans (licensed); this project substitutes Inter as the closest free
grotesque and keeps the warm palette (burnt orange `#d55e1e`, peach
`#f9ae7c`, teal `#004652`, ink `#1a1718`) with a soft radial wash on a
`#fafafa` base.

## License

MIT.

## Notes

Not affiliated with Adaption Labs. Built as a working artifact for the Special
Projects Lead application. See `/about` for the full framing.
