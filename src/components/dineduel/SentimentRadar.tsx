import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import type { Restaurant } from "@/data/restaurants";

export function SentimentRadar({ a, b }: { a: Restaurant; b: Restaurant }) {
  const data = [
    { metric: "Food", [a.name]: a.sentiment.food, [b.name]: b.sentiment.food },
    { metric: "Service", [a.name]: a.sentiment.service, [b.name]: b.sentiment.service },
    { metric: "Ambiance", [a.name]: a.sentiment.ambiance, [b.name]: b.sentiment.ambiance },
    { metric: "Value", [a.name]: a.sentiment.value, [b.name]: b.sentiment.value },
    { metric: "Hygiene", [a.name]: a.sentiment.hygiene, [b.name]: b.sentiment.hygiene },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="oklch(0.97 0.01 90 / 0.15)" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "oklch(0.97 0.01 90 / 0.85)", fontSize: 12, fontWeight: 500 }}
        />
        <Radar
          name={a.name}
          dataKey={a.name}
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.35}
          strokeWidth={2}
        />
        <Radar
          name={b.name}
          dataKey={b.name}
          stroke="var(--color-accent)"
          fill="var(--color-accent)"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}