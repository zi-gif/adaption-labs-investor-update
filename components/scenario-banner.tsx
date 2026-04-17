export function ScenarioBanner() {
  return (
    <section
      aria-label="Scenario frame"
      className="elevate border-b border-rule/50 bg-paper/40"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-4 text-[13.5px] text-ink-2 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 items-center gap-2 pt-[2px]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember pulse-dot" />
          <span className="smallcaps">Scenario, April 2026</span>
        </div>
        <p className="leading-relaxed">
          Adaption Labs closed its{" "}
          <span className="font-semibold text-ink">$50M seed</span> led by
          Emergence Capital in February, with 7 investors on the cap table.
          The team has grown from the founding duo to{" "}
          <span className="mono tabular text-ember-deep">~18</span> across
          four countries. This tool is the Special Projects Lead's workspace
          for keeping those investors informed, aligned, and activated. Every
          number and prior-month letter is clearly labelled demo data.
        </p>
      </div>
    </section>
  );
}
