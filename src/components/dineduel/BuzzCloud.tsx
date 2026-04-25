import type { Restaurant } from "@/data/restaurants";

export function BuzzCloud({ r }: { r: Restaurant }) {
  const max = Math.max(...r.buzzwords.map((b) => b.count));
  return (
    <div className="flex flex-wrap gap-2">
      {r.buzzwords.map((b) => {
        const scale = 0.85 + (b.count / max) * 0.6;
        const color =
          b.tone === "pos"
            ? "var(--color-accent)"
            : b.tone === "neg"
            ? "var(--color-secondary)"
            : "var(--color-primary)";
        return (
          <span
            key={b.word}
            className="rounded-full px-3 py-1 font-medium transition-transform hover:scale-110 cursor-default"
            style={{
              fontSize: `${0.75 * scale}rem`,
              color,
              background: `color-mix(in oklch, ${color} 18%, transparent)`,
              border: `1px solid color-mix(in oklch, ${color} 35%, transparent)`,
            }}
            title={`${b.count} mentions`}
          >
            {b.word}
          </span>
        );
      })}
    </div>
  );
}