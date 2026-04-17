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
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink">
            Draft the April 2026 investor update.
          </h1>
          <p className="mt-2 max-w-prose text-[15px] text-ink-soft">
            Structured inputs in, scannable ~300-word update out, plus a
            read-only consistency pass that flags drift against January,
            February, and March. The form is pre-populated with plausible demo
            data; edit any field before generating.
          </p>
        </div>
        <DrafterWorkspace seedUpdates={seedUpdates} />
      </main>
      <SiteFooter />
    </>
  );
}
