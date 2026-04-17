import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, SectionHeading } from "@/components/ui";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-12 pb-10">
        <h1 className="text-[34px] font-semibold tracking-tight text-ink">
          About this tool.
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
          An investor-update engine for Adaption Labs. Built by{" "}
          <Link
            href="https://www.linkedin.com/"
            className="text-accent-deep underline decoration-accent-soft underline-offset-2"
          >
            Zi
          </Link>{" "}
          as a working artifact for the Special Projects Lead application.
        </p>

        <div className="mt-10 space-y-6">
          <Card className="p-6">
            <SectionHeading
              eyebrow="Why this"
              title="The role, in one tool"
            />
            <div className="space-y-3 text-[14.5px] leading-relaxed text-ink">
              <p>
                Adaption closed a $50M seed at a $1B valuation on February 4,
                2026, with 7 investors on the cap table. Monthly updates are
                now a recurring obligation. That work is the kind of thing the
                JD calls out by name: undefined, high-priority, doesn't fit
                neatly into anyone else's job description.
              </p>
              <p>
                This tool compresses the workflow into structured inputs in, a
                scannable ~300-word draft out, and a second pass that reads the
                draft against prior months and surfaces what investors will
                notice. Drift, silence, positive overshoot, resolved threads.
              </p>
              <p>
                It's a working artifact, not a portfolio piece. Sara or Sudip
                could use it as-is to draft a real update and catch their own
                narrative drift before investors do.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading
              eyebrow="How it thinks"
              title="Two passes, one shared context"
            />
            <div className="space-y-3 text-[14.5px] leading-relaxed text-ink">
              <p>
                <strong>Draft pass.</strong> Claude Sonnet 4.6 reads the fact
                sheet (Adaption's public thesis, team, products, investors) and
                the structured form input, then streams a monthly update in
                Sara Hooker's voice. Precise, confident, no hype, no em dashes.
              </p>
              <p>
                <strong>Evaluation pass.</strong> A second call, same model,
                different job. It sees all prior months plus the fresh draft
                and returns structured flags: excerpt, source month, drift
                type, priority, suggested addition, and which investors care.
                Read-only; the draft is never modified by the eval pass.
                Separation of concerns keeps the evaluation honest.
              </p>
              <p>
                The consistency engine is weighted. Flags that touch the lead
                investor's thesis (Emergence on enterprise pilots, burn
                efficiency) are marked higher priority than generic continuity
                notes.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading
              eyebrow="What is real"
              title="Real vs. fabricated"
            />
            <div className="space-y-3 text-[14.5px] leading-relaxed text-ink">
              <p>
                <strong>Real</strong>: company, founders, thesis, seed round
                and valuation, investor list, legal counsel, hiring locations,
                product pillars, open roles. All cited from public sources
                (Fortune, BetaKit, TechCrunch, Pulse2, adaptionlabs.ai).
              </p>
              <p>
                <strong>Fabricated</strong>: every specific metric in the demo
                form, the three prior-month updates (Jan, Feb, Mar 2026),
                named hires except Sara and Sudip, and all narrative threads
                the consistency engine flags. Fabricated data is plausible and
                consistent with the scenario, not representative of any
                internal Adaption information.
              </p>
              <p>
                The scenario banner at the top of every page marks the frame
                explicitly.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading
              eyebrow="Stack"
              title="What's under the hood"
            />
            <ul className="space-y-2 text-[14px] leading-relaxed text-ink">
              <li>Next.js 16 (app router), TypeScript, Tailwind, Bun.</li>
              <li>
                Anthropic SDK, Claude Sonnet 4.6 for both draft and
                evaluation passes.
              </li>
              <li>
                Streaming draft over a server route so the user watches the
                update unfold in real time.
              </li>
              <li>
                Upstash Redis rate-limit (10 generations per IP per day), with
                an in-memory fallback for local dev.
              </li>
              <li>
                No auth, no database. Prior updates are seeded as markdown;
                any month you add lives only in your browser's localStorage.
              </li>
              <li>
                Source code:{" "}
                <Link
                  href="https://github.com/zi-gif/adaption-labs-investor-update"
                  className="text-accent-deep underline decoration-accent-soft underline-offset-2"
                >
                  github.com/zi-gif/adaption-labs-investor-update
                </Link>
                .
              </li>
            </ul>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
