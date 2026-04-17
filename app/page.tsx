import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScenarioBanner } from "@/components/scenario-banner";
import { DrafterWorkspace } from "@/components/drafter-workspace";
import { getSeedPriorUpdates } from "@/data/prior-updates";

export default function Home() {
  const seedUpdates = getSeedPriorUpdates().map((u) => ({
    month: u.month,
    sender: u.sender,
    body: u.body,
    source: "seed" as const,
  }));
  return (
    <>
      <SiteHeader />
      <ScenarioBanner />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-10 pb-4">
        {/* Masthead */}
        <section className="reveal mb-10 grid grid-cols-1 gap-6 pt-2 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="smallcaps mb-3 text-ember-deep">
              Issue No. 04 &nbsp;/&nbsp; Draft workspace
            </div>
            <h1
              className="display text-[64px] leading-[0.92] text-ink sm:text-[84px]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
            >
              Draft the{" "}
              <span
                className="display-italic text-ember-deep"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                April
              </span>
              <br />
              letter.
            </h1>
          </div>
          <div className="max-w-[36ch] pb-2 text-[13.5px] leading-relaxed text-ink-2 sm:text-right">
            Structured inputs in, scannable{" "}
            <span className="mono tabular text-ink">~300</span>-word update
            out. A second pass reads the draft against January, February, and
            March, and flags drift an investor will notice.
          </div>
        </section>

        <DrafterWorkspace seedUpdates={seedUpdates} />
      </main>
      <SiteFooter />
    </>
  );
}
