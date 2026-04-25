type Props = {
  label: string;
  value: number;
  max?: number;
  tint?: "primary" | "accent" | "secondary";
  diff?: number;
};

export function SatisfactionBar({ label, value, max = 100, tint = "primary", diff }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    tint === "primary" ? "var(--color-primary)" : tint === "accent" ? "var(--color-accent)" : "var(--color-secondary)";
  const showDiff = typeof diff === "number" && Math.abs(diff) >= 1;
  const diffPositive = (diff ?? 0) > 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="flex items-center gap-1.5">
          {showDiff && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
              style={{
                color: diffPositive ? "oklch(0.78 0.18 145)" : "oklch(0.7 0.22 25)",
                background: diffPositive
                  ? "color-mix(in oklch, oklch(0.78 0.18 145) 18%, transparent)"
                  : "color-mix(in oklch, oklch(0.7 0.22 25) 18%, transparent)",
              }}
              title={diffPositive ? "Higher than rival" : "Lower than rival"}
            >
              {diffPositive ? "+" : ""}
              {Math.round(diff!)}
            </span>
          )}
          <span className="font-semibold tabular-nums" style={{ color }}>{Math.round(value)}</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-muted/40">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, color-mix(in oklch, ${color}, white 30%))`,
            boxShadow: `0 0 12px ${color}`,
          }}
        >
          <div className="absolute inset-0 animate-shimmer opacity-60" />
        </div>
      </div>
    </div>
  );
}