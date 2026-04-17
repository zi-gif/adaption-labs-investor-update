import Link from "next/link";

export function Wordmark({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const main =
    size === "lg"
      ? "text-[22px] tracking-tight"
      : "text-[15px] tracking-tight";
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-2 ${className ?? ""}`}
      aria-label="Home"
    >
      <span
        className={`display ${main} text-ink transition-colors group-hover:text-ember-deep`}
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
      >
        Adaption Labs
      </span>
      <span className="smallcaps text-ink-4 translate-y-[-1px]">
        Investor Update
      </span>
    </Link>
  );
}
