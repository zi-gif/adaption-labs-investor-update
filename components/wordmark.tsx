import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className ?? ""}`}
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent transition-transform group-hover:scale-110" />
      <span className="text-[15px] font-medium tracking-tight text-ink">
        Adaption Labs
      </span>
      <span className="text-[15px] text-ink-faint">/</span>
      <span className="text-[15px] text-ink-soft">Investor Update</span>
    </Link>
  );
}
