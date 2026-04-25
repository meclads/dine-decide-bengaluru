import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import type { Restaurant } from "@/data/restaurants";

const METRIC_TO_KEY: Record<string, keyof Restaurant["sentiment"]> = {
  Food: "food",
  Service: "service",
  Ambiance: "ambiance",
  Value: "value",
  Hygiene: "hygiene",
};

const METRIC_QUOTES: Record<string, string> = {
  Food: "Oota was super tasty macha 🤌",
  Service: "Staff was prompt and very polite",
  Ambiance: "Aesthetic AF — perfect date spot",
  Value: "Paisa vasool, fully worth it",
  Hygiene: "Cleanliness top-notch, no complaints",
};

function pickQuote(r: Restaurant, metric: string) {
  const key = METRIC_TO_KEY[metric];
  const score = r.sentiment[key];
  const tone: "pos" | "neg" | "neu" = score >= 85 ? "pos" : score >= 70 ? "neu" : "neg";
  const match = r.buzzwords.find((b) => b.tone === tone);
  return match?.word ?? METRIC_QUOTES[metric];
}

export function SentimentRadar({ a, b }: { a: Restaurant; b: Restaurant }) {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const data = ["Food", "Service", "Ambiance", "Value", "Hygiene"].map((metric) => {
    const key = METRIC_TO_KEY[metric];
    return { metric, [a.name]: a.sentiment[key], [b.name]: b.sentiment[key] };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length || !label) return null;
    return (
      <div className="glass-strong rounded-xl p-3 text-xs shadow-card max-w-[240px]">
        <div className="font-bold mb-2 text-foreground">{label}</div>
        <div className="space-y-2">
          {payload.map((p: any) => {
            const r = p.dataKey === a.name ? a : b;
            const color = p.dataKey === a.name ? "var(--color-primary)" : "var(--color-accent)";
            return (
              <div key={p.dataKey}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    <span className="font-semibold">{p.dataKey}</span>
                  </span>
                  <span className="font-bold tabular-nums" style={{ color }}>{p.value}</span>
                </div>
                <div className="mt-1 italic text-muted-foreground leading-snug">
                  "{pickQuote(r, label)}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Toggle = ({
    on,
    onClick,
    color,
    label,
  }: { on: boolean; onClick: () => void; color: string; label: string }) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
        on ? "" : "opacity-40"
      }`}
      style={{
        background: `color-mix(in oklch, ${color} ${on ? 22 : 8}%, transparent)`,
        border: `1px solid color-mix(in oklch, ${color} ${on ? 50 : 20}%, transparent)`,
        color,
      }}
      title={on ? "Click to hide" : "Click to show"}
    >
      <span
        className="h-2.5 w-2.5 rounded-full transition-all"
        style={{ background: on ? color : "transparent", border: `1.5px solid ${color}` }}
      />
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex justify-end gap-2 mb-2 flex-wrap">
        <Toggle on={showA} onClick={() => setShowA((v) => !v)} color="var(--color-primary)" label={a.name} />
        <Toggle on={showB} onClick={() => setShowB((v) => !v)} color="var(--color-accent)" label={b.name} />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="oklch(0.97 0.01 90 / 0.15)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "oklch(0.97 0.01 90 / 0.85)", fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "oklch(0.97 0.01 90 / 0.2)" }} />
          {showA && (
            <Radar
              name={a.name}
              dataKey={a.name}
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.35}
              strokeWidth={2}
              isAnimationActive
            />
          )}
          {showB && (
            <Radar
              name={b.name}
              dataKey={b.name}
              stroke="var(--color-accent)"
              fill="var(--color-accent)"
              fillOpacity={0.3}
              strokeWidth={2}
              isAnimationActive
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}