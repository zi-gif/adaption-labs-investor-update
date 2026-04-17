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
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink">
            Prior updates.
          </h1>
          <p className="mt-2 max-w-prose text-[15px] text-ink-soft">
            Jan, Feb, and Mar 2026 are seeded demo updates. They contain
            intentional narrative threads that the consistency engine reasons
            over. You can also paste a real or hypothetical month into
            localStorage; it will feed the engine without leaving your browser.
          </p>
        </div>
        <PriorUpdatesView seed={seed} />
      </main>
      <SiteFooter />
    </>
  );
}
