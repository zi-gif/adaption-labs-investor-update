"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./wordmark";

const NAV = [
  { href: "/", label: "Draft" },
  { href: "/prior-updates", label: "Prior issues" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="elevate border-b border-rule/70 bg-canvas/70 backdrop-blur-sm">
      {/* Meta bar: journal-style masthead strip */}
      <div className="border-b border-rule/40">
        <div className="mx-auto flex h-7 max-w-[1200px] items-center justify-between px-6 text-[10.5px] tracking-[0.14em] uppercase text-ink-3">
          <span className="mono tabular">Vol. 01 &nbsp;·&nbsp; Apr 2026</span>
          <span className="hidden sm:inline">
            A working artifact for the Special Projects Lead
          </span>
          <span className="mono tabular text-ember-deep">
            ● Live demo
          </span>
        </div>
      </div>
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Wordmark />
        <nav className="flex items-center gap-1 text-[13.5px]">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring relative px-3 py-1.5 transition-colors ${
                  active ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-ember origin-left draw-line" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
