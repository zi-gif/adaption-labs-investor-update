import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScenarioBanner } from "@/components/scenario-banner";
import { PriorUpdatesView } from "@/components/prior-updates-view";
import { getSeedPriorUpdates } from "@/data/prior-updates";

export default function PriorUpdatesPage() {
  const seed = getSeedPriorUpdates().map((u) => ({
    month: u.month,
    sender: u.sender,
    body: u.body,
    label: u.label,
    source: "seed" as const,
  }));
  return (
    <>
      <SiteHeader />
      <ScenarioBanner />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-10 pb-4">
        <section className="reveal mb-10 grid grid-cols-1 gap-6 pt-2 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="smallcaps mb-3 text-ember-deep">
              Archive &nbsp;/&nbsp; Prior issues
            </div>
            <h1
              className="display text-[64px] leading-[0.92] text-ink sm:text-[84px]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
            >
              What's already
              <br />
              <span
                className="display-italic text-ember-deep"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                on the record.
              </span>
            </h1>
          </div>
          <div className="max-w-[36ch] pb-2 text-[13.5px] leading-relaxed text-ink-2 sm:text-right">
            January through March are seeded demo letters with intentional
            narrative threads; the consistency engine reasons over them. Add
            your own month; it lives only in your browser.
          </div>
        </section>
        <PriorUpdatesView seed={seed} />
      </main>
      <SiteFooter />
    </>
  );
}
