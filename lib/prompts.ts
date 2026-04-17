import fs from "node:fs";
import path from "node:path";
import type { PriorUpdateDoc, UpdateFormData } from "./types";
import { INVESTORS } from "@/data/investors";

let FACTS_CACHE: string | null = null;
function loadFacts(): string {
  if (FACTS_CACHE) return FACTS_CACHE;
  FACTS_CACHE = fs.readFileSync(
    path.join(process.cwd(), "data", "adaption-facts.md"),
    "utf8",
  );
  return FACTS_CACHE;
}

function formatInvestorBlock(): string {
  return INVESTORS.map((i) => `- **${i.name}** (${i.role}): ${i.thesis}`).join(
    "\n",
  );
}

/**
 * Rules baked into every generated artifact: no em dashes, no emoji, no hype.
 * The PRD is explicit on this. Keep it loud in every system prompt.
 */
const TONE_RULES = `
# Tone rules (non-negotiable)

- Do not use em dashes. Use commas, semicolons, periods, or parentheses instead.
- Do not use emoji.
- Do not use hype language ("incredible", "game-changing", "world-class", "amazing", "revolutionary", "cutting-edge", "leverage"). Strip hedges that mean nothing ("really", "very", "quite").
- Use numbers before narrative. Claims rest on metrics.
- Write as a researcher who is also an operator. Precise, confident, intellectually honest.
- Do not name any person who is not either already named in the user's form input, or explicitly marked as a Founder (Sara Hooker, Sudip Roy) in the fact sheet. Never invent people.
- Reference investors by name only when directly relevant to an ask or a signal. Do not over-cite.
`.trim();

export function buildDraftSystemPrompt(): string {
  return [
    "You are drafting a monthly investor update for Adaption Labs. Write as if you are Sara Hooker, CEO, writing to her 7 seed investors. The tone must pass as human, not template.",
    "",
    "# Fact sheet (company context, grounded in public sources)",
    "",
    loadFacts(),
    "",
    "# Investor context (who cares about what)",
    "",
    formatInvestorBlock(),
    "",
    TONE_RULES,
    "",
    "# Structure",
    "",
    "- Target length: approximately 300 words. Short, scannable, dense.",
    "- Open with a one-paragraph narrative framing (2-3 sentences) that reflects the TL;DR and one most important signal from the month.",
    "- A **Metrics** section with each metric on its own line, short commentary only where it adds information.",
    "- A **Wins** section (3-5 bullets).",
    "- A **Risks / what is uncertain** section. Be honest. Silence creates its own narrative.",
    "- A **Key hires** section, one line per hire.",
    "- An **Asks** section. The highest-leverage part of any update; surface specific, actionable asks.",
    "- An optional **Press and links** section if the user provided items.",
    "- Sign off with the sender's first name.",
    "",
    "# Output format",
    "",
    "Return the update as GitHub-flavored markdown. Do not wrap the output in code fences. Do not include any commentary or preface. Start directly with the first line of the update.",
  ].join("\n");
}

export function buildDraftUserPrompt(form: UpdateFormData): string {
  const runway =
    form.metrics.cashOnHand && form.metrics.monthlyBurn
      ? (
          (form.metrics.cashOnHand * 1_000_000) /
          (form.metrics.monthlyBurn * 1_000)
        ).toFixed(1)
      : "not available";

  const keyHiresBlock =
    form.keyHires.length === 0
      ? "- (none this month)"
      : form.keyHires
          .map(
            (h) =>
              `- ${h.name || "(unnamed hire)"} / ${h.role} / ${h.location} / ${h.bio}`,
          )
          .join("\n");

  const pressBlock =
    form.press.length === 0
      ? "- (none)"
      : form.press.map((p) => `- [${p.title}](${p.url})`).join("\n");

  return [
    `# Structured inputs for ${form.month}`,
    `Sender: ${form.sender}`,
    "",
    `## TL;DR`,
    form.tldr || "(blank)",
    "",
    `## Metrics`,
    `- Team size: ${form.metrics.teamSize ?? "n/a"}`,
    `- New hires this period: ${form.metrics.newHires ?? "n/a"}`,
    `- New hire countries: ${
      form.metrics.newHireCountries.length
        ? form.metrics.newHireCountries.join(", ")
        : "n/a"
    }`,
    `- Cash on hand: $${form.metrics.cashOnHand ?? "n/a"}M`,
    `- Monthly burn: $${form.metrics.monthlyBurn ?? "n/a"}K`,
    `- Runway: ${runway} months`,
    `- Adaptive Data: ${form.metrics.adaptiveDataCustomers ?? "n/a"} customers onboarding`,
    `- Adaptive Intelligence: ${form.metrics.adaptiveIntelligenceWaitlist ?? "n/a"} on waitlist`,
    `- Adaptive Interfaces status: ${form.metrics.adaptiveInterfacesStatus}`,
    "",
    `## Wins (raw notes)`,
    form.wins || "(none)",
    "",
    `## Challenges / risks (raw notes)`,
    form.challenges || "(none)",
    "",
    `## Key hires spotlight`,
    keyHiresBlock,
    "",
    `## Asks (raw notes)`,
    form.asks || "(none)",
    "",
    `## Press and links`,
    pressBlock,
    "",
    `# Write the update now.`,
  ].join("\n");
}

export function buildEvaluationSystemPrompt(): string {
  return [
    "You are reading Adaption Labs' monthly investor updates as if you were one of their 7 seed investors. Your job: surface narrative drift between prior months and the freshly drafted current month.",
    "",
    "# Fact sheet",
    "",
    loadFacts(),
    "",
    "# Investor context (used to set priority)",
    "",
    formatInvestorBlock(),
    "",
    TONE_RULES,
    "",
    "# What counts as drift",
    "",
    "- **silence**: a thread (pilot, partnership, hire, target) appeared in a prior update and is not addressed in the current draft. Investors will notice. Flag it.",
    "- **contradiction**: a specific claim changed meaning across months (e.g., 'signed' vs 'in discussion' reversal without explanation).",
    "- **softened language**: a thread is still mentioned but downgraded in confidence or specificity without acknowledgement.",
    "- **thread resolved**: a risk or open item from a prior month is now closed; worth an explicit one-liner so investors register the resolution.",
    "- **positive overshoot**: a target was set and exceeded; worth surfacing rather than quietly glossing.",
    "",
    "# Priority rubric",
    "",
    "- **high**: directly touches the lead investor's thesis (Emergence: enterprise pilots, burn, PMF), or a commitment made explicitly to all investors.",
    "- **medium**: matters to multiple investors; affects the running narrative but not central thesis.",
    "- **low**: minor continuity; noting it is better than not, but would not sink an update.",
    "",
    "# Output format",
    "",
    "Return a single JSON object with one key: `flags`. Each flag is an object with these exact keys:",
    "- `excerpt`: string. A short verbatim excerpt (≤160 chars) from a prior update that sets up the thread.",
    "- `source_month`: string. Month the excerpt is from (e.g., 'January 2026').",
    "- `drift_type`: one of 'silence', 'contradiction', 'softened language', 'thread resolved', 'positive overshoot'.",
    "- `priority`: one of 'high', 'medium', 'low'.",
    "- `suggested_addition`: string. A one-sentence proposed line the sender could add to the current draft to close or acknowledge the thread. No em dashes.",
    "- `relevant_investors`: array of investor names (from the investor context above) whose thesis this flag touches. Empty array if generic.",
    "",
    "Return only the JSON object. No prose. No code fences. No commentary. If you have nothing to flag, return `{\"flags\": []}`.",
  ].join("\n");
}

export function buildEvaluationUserPrompt(
  priorUpdates: PriorUpdateDoc[],
  currentDraft: string,
  currentMonth: string,
): string {
  const priorBlock = priorUpdates
    .map(
      (u) =>
        `## ${u.month} update (sent by ${u.sender})\n\n${u.body}\n`,
    )
    .join("\n---\n\n");

  return [
    `# Prior monthly updates`,
    "",
    priorBlock,
    "",
    `---`,
    "",
    `# Freshly drafted ${currentMonth} update`,
    "",
    currentDraft,
    "",
    `---`,
    "",
    `Return the JSON object of flags now.`,
  ].join("\n");
}
