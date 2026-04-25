import { Star, Users, IndianRupee, Trophy } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";
import { SatisfactionBar } from "./SatisfactionBar";
import { BuzzCloud } from "./BuzzCloud";

type Props = { r: Restaurant; side: "left" | "right"; winner?: boolean };

export function ComparisonCard({ r, side, winner }: Props) {
  const tint = side === "left" ? "primary" : "accent";
  const accent = side === "left" ? "var(--color-primary)" : "var(--color-accent)";
  const overall = Math.round(
    (r.sentiment.food + r.sentiment.service + r.sentiment.ambiance + r.sentiment.value + r.sentiment.hygiene) / 5,
  );

  return (
    <div
      className="glass-strong relative rounded-3xl p-6 lg:p-7 space-y-5 transition-all hover:-translate-y-1 hover:shadow-glow"
      style={{ borderColor: `color-mix(in oklch, ${accent} 40%, transparent)` }}
    >
      {winner && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold text-primary-foreground shadow-glow whitespace-nowrap"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Trophy className="h-3.5 w-3.5" /> WINNER
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-5xl mb-2">{r.emoji}</div>
          <h3 className="text-2xl font-bold leading-tight">{r.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {r.type} · {r.location}
          </p>
        </div>
        <div
          className="rounded-2xl px-3 py-2 text-center shrink-0"
          style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)` }}
        >
          <div className="flex items-center gap-1 text-lg font-bold" style={{ color: accent }}>
            <Star className="h-4 w-4 fill-current" />
            {r.rate}
          </div>
          <div className="text-[10px] text-muted-foreground">/ 5.0</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/30 p-2.5">
          <IndianRupee className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
          <div className="text-sm font-bold mt-1 tabular-nums">₹{r.avg_cost}</div>
          <div className="text-[10px] text-muted-foreground">for two</div>
        </div>
        <div className="rounded-xl bg-muted/30 p-2.5">
          <Users className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
          <div className="text-sm font-bold mt-1 tabular-nums">{(r.votes / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-muted-foreground">votes</div>
        </div>
        <div className="rounded-xl bg-muted/30 p-2.5">
          <Trophy className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
          <div className="text-sm font-bold mt-1 tabular-nums">{overall}</div>
          <div className="text-[10px] text-muted-foreground">satisfaction</div>
        </div>
      </div>

      <div className="space-y-3">
        <SatisfactionBar label="Food Quality" value={r.sentiment.food} tint={tint} />
        <SatisfactionBar label="Service" value={r.sentiment.service} tint={tint} />
        <SatisfactionBar label="Ambiance" value={r.sentiment.ambiance} tint={tint} />
        <SatisfactionBar label="Value" value={r.sentiment.value} tint={tint} />
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Hinglish Buzz
        </div>
        <BuzzCloud r={r} />
      </div>

      <div className="rounded-2xl border border-border p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Signature</div>
        <div className="text-sm font-semibold">{r.signature}</div>
      </div>
    </div>
  );
}