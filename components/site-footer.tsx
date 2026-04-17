import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="elevate mt-24 border-t border-rule/70 bg-paper/40">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div
              className="display text-[34px] leading-none text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              Everything intelligent adapts.
            </div>
            <div
              className="display-italic mt-1 text-[22px] text-ember-deep"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              So should the update.
            </div>
            <p className="mt-5 max-w-[44ch] text-[12.5px] leading-relaxed text-ink-3">
              Built by Zi for the Special Projects Lead application at
              Adaption Labs. Not affiliated. All prior-month letters are
              fabricated demo data; the scenario banner marks the frame on
              every page.
            </p>
          </div>
          <div className="text-[12.5px] text-ink-3">
            <div className="smallcaps mb-3 text-ink-4">Pages</div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-ember-deep">
                  Draft
                </Link>
              </li>
              <li>
                <Link
                  href="/prior-updates"
                  className="hover:text-ember-deep"
                >
                  Prior issues
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ember-deep">
                  Colophon
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-[12.5px] text-ink-3">
            <div className="smallcaps mb-3 text-ink-4">Links</div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.adaptionlabs.ai"
                  className="hover:text-ember-deep"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  adaptionlabs.ai
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/zi-gif/adaption-labs-investor-update"
                  className="hover:text-ember-deep"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source on GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="rule mt-10" />
        <div className="mt-4 flex flex-col items-start justify-between gap-2 text-[11px] text-ink-4 sm:flex-row sm:items-center">
          <span className="mono tabular">
            Vol. 01 &nbsp;·&nbsp; Issue 04 &nbsp;·&nbsp; MMXXVI
          </span>
          <span>
            Set in Fraunces &amp; Schibsted Grotesk. Grain printed in-browser.
          </span>
        </div>
      </div>
    </footer>
  );
}
