type Props = { label: string; value: number; max?: number; tint?: "primary" | "accent" | "secondary" };

export function SatisfactionBar({ label, value, max = 100, tint = "primary" }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    tint === "primary" ? "var(--color-primary)" : tint === "accent" ? "var(--color-accent)" : "var(--color-secondary)";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{Math.round(value)}</span>
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