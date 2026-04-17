export function ScenarioBanner() {
  return (
    <div className="mx-auto mt-6 max-w-6xl px-6">
      <div className="rounded-2xl border border-accent-soft/50 bg-accent-wash/60 px-5 py-4 text-[13.5px] leading-relaxed text-flag-ink shadow-[0_1px_0_rgba(183,55,0,0.04)]">
        <div className="mb-1 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-medium uppercase tracking-[0.08em] text-[11px] text-accent-deep">
            Scenario
          </span>
        </div>
        <p>
          It is April 2026. Adaption Labs closed its $50M seed led by Emergence
          Capital Partners in February, with 7 investors on the cap table. The
          team has grown from the founding duo to ~18 across four countries.
          Adaptive Data is onboarding its first enterprise design partners;
          Adaptive Intelligence is on waitlist. This tool is the Special
          Projects Lead's workspace for keeping 7 investors informed, aligned,
          and activated. All specific metrics and prior updates are fabricated
          and clearly labeled as demo data.
        </p>
      </div>
    </div>
  );
}
