import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[860px] flex-1 px-6 pt-14 pb-4">
        {/* Masthead */}
        <section className="reveal mb-14 border-b border-rule pb-10">
          <div className="smallcaps mb-4 text-ember-deep">Colophon</div>
          <h1
            className="display text-[72px] leading-[0.92] text-ink sm:text-[96px]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
          >
            A working
            <br />
            <span
              className="display-italic text-ember-deep"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              artifact,
            </span>
            <br />
            not a deck.
          </h1>
          <p className="mt-8 max-w-[58ch] text-[16px] leading-relaxed text-ink-2">
            An investor-update engine for{" "}
            <a
              href="https://www.adaptionlabs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember-deep underline decoration-ember-soft underline-offset-4"
            >
              Adaption Labs
            </a>
            , built by{" "}
            <Link
              href="https://www.linkedin.com/"
              className="text-ember-deep underline decoration-ember-soft underline-offset-4"
            >
              Zi
            </Link>{" "}
            as a working artifact for the Special Projects Lead application.
          </p>
        </section>

        {/* Numbered long-form */}
        <article className="space-y-14">
          <LongSection folio="01" label="Why this">
            <h2
              className="display mb-6 text-[34px] leading-tight text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              The role, in one tool.
            </h2>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink">
              <p>
                Adaption closed a{" "}
                <span className="mono tabular text-ember-deep">$50M</span>{" "}
                seed at a{" "}
                <span className="mono tabular text-ember-deep">$1B</span>{" "}
                valuation on February 4, 2026, with seven investors on the
                cap table. Monthly updates are now a recurring obligation.
                That work is the kind of thing the JD calls out by name,
                undefined, high-priority, and fit for nobody else's job
                description.
              </p>
              <p>
                This tool compresses the workflow. Structured inputs in, a
                scannable{" "}
                <span className="mono tabular">~300</span>-word draft out,
                plus a second pass that reads the draft against prior months
                and surfaces what investors will notice. Drift, silence,
                positive overshoot, resolved threads.
              </p>
              <p className="display-italic text-ember-deep">
                Sara or Sudip could use it as-is to draft a real update and
                catch their own narrative drift before investors do.
              </p>
            </div>
          </LongSection>

          <LongSection folio="02" label="How it thinks">
            <h2
              className="display mb-6 text-[34px] leading-tight text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              Two passes, one shared context.
            </h2>
            <div className="space-y-5 text-[15.5px] leading-relaxed text-ink">
              <p>
                <span className="display-italic text-ember-deep">
                  Draft pass.
                </span>{" "}
                Claude Sonnet 4.6 reads the Adaption Labs fact sheet (public
                thesis, team, products, investors) and the structured form
                input, then streams a monthly update in Sara Hooker's voice.
                Precise, confident, no hype, no em dashes.
              </p>
              <p>
                <span className="display-italic text-ember-deep">
                  Evaluation pass.
                </span>{" "}
                A second call, same model, different job. It sees every prior
                month plus the fresh draft and returns structured flags,
                excerpt, source month, drift type, priority, suggested
                addition, and which investors care. Read-only; the draft is
                never modified by the eval pass. Separation of concerns
                keeps the evaluation honest.
              </p>
              <p>
                The consistency engine is weighted. Flags that touch the
                lead investor's thesis (Emergence on enterprise pilots, burn
                efficiency) are marked higher priority than generic
                continuity notes.
              </p>
            </div>
          </LongSection>

          <LongSection folio="03" label="Real vs. fabricated">
            <h2
              className="display mb-6 text-[34px] leading-tight text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              What is real.
            </h2>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink">
              <p>
                <span className="smallcaps mr-2 !text-[10px] text-teal">
                  Real
                </span>
                Company, founders, thesis, seed round and valuation, investor
                list, legal counsel, hiring locations, product pillars, open
                roles. Cited from public sources (Fortune, BetaKit,
                TechCrunch, Pulse2, adaptionlabs.ai).
              </p>
              <p>
                <span className="smallcaps mr-2 !text-[10px] text-ember-deep">
                  Fabricated
                </span>
                Every specific metric in the demo form, the three prior-month
                letters (Jan, Feb, Mar 2026), named hires except Sara and
                Sudip, and the narrative threads the consistency engine
                flags. Plausible and consistent with the scenario; not
                representative of any internal Adaption information.
              </p>
              <p>
                The scenario banner at the top of every page marks the frame
                explicitly.
              </p>
            </div>
          </LongSection>

          <LongSection folio="04" label="Stack">
            <h2
              className="display mb-6 text-[34px] leading-tight text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              Under the hood.
            </h2>
            <ul className="space-y-3 text-[15px] leading-relaxed text-ink">
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /01
                </span>
                <span>
                  Next.js 16 (app router), TypeScript, Tailwind v4, Bun.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /02
                </span>
                <span>
                  Anthropic SDK with Claude Sonnet 4.6 for both draft and
                  evaluation passes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /03
                </span>
                <span>
                  Streaming draft over a server route. You watch the update
                  unfold in real time.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /04
                </span>
                <span>
                  Upstash Redis rate-limit (10 generations per IP per day),
                  with an in-memory fallback for local dev.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /05
                </span>
                <span>
                  No auth, no database. Prior updates are seeded as
                  markdown; any month you add lives only in your browser.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mono tabular mt-1 shrink-0 text-[11px] text-ink-4">
                  /06
                </span>
                <span>
                  Source,{" "}
                  <Link
                    href="https://github.com/zi-gif/adaption-labs-investor-update"
                    className="text-ember-deep underline decoration-ember-soft underline-offset-4"
                  >
                    github.com/zi-gif/adaption-labs-investor-update
                  </Link>
                  .
                </span>
              </li>
            </ul>
          </LongSection>

          <LongSection folio="05" label="Typography">
            <h2
              className="display mb-6 text-[34px] leading-tight text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              Set in Fraunces &amp; Schibsted Grotesk.
            </h2>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink">
              <p>
                Adaption's site uses STK Bureau Sans, a licensed foundry
                grotesque. This project doesn't redistribute it. Instead, it
                pairs a warm serif with a crisp grotesque that carry the
                same research-lab confidence.
              </p>
              <p>
                Display type is{" "}
                <span className="display-italic text-ember-deep">Fraunces</span>
                , a variable serif with soft optical sizing. UI and body type
                is{" "}
                <span className="font-medium">Schibsted Grotesk</span>. Metric
                numerals are set in{" "}
                <span className="mono">JetBrains Mono</span> with tabular
                nums. The palette is sampled directly from{" "}
                <a
                  href="https://www.adaptionlabs.ai"
                  className="text-ember-deep underline decoration-ember-soft underline-offset-4"
                >
                  adaptionlabs.ai
                </a>
                , pushed a half-step warmer toward paper.
              </p>
            </div>
          </LongSection>
        </article>

        <div className="mt-20 border-t border-rule pt-6 text-[11px] text-ink-4 mono tabular">
          End of colophon.
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function LongSection({
  folio,
  label,
  children,
}: {
  folio: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-[64px_1fr] gap-6 sm:grid-cols-[96px_1fr] sm:gap-10">
      <div>
        <div
          className="display text-ember-deep"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 60',
            fontSize: "44px",
            lineHeight: 1,
          }}
        >
          §{folio}
        </div>
        <div className="mt-3 smallcaps !text-[10px] text-ink-4">
          {label}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
