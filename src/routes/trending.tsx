import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Star, TrendingUp, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants } from "@/data/restaurants";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending in Bengaluru — Hot Restaurants Now | DineDuel" },
      { name: "description", content: "What's hot in Bengaluru right now. The most-voted, highest-rated spots across the city." },
      { property: "og:title", content: "Trending in Bengaluru — DineDuel" },
      { property: "og:description", content: "Hot picks across Bengaluru, ranked by buzz." },
    ],
  }),
  component: TrendingPage,
});

function TrendingPage() {
  const ranked = [...restaurants]
    .map((r) => ({
      r,
      buzz: r.rate * 20 + Math.min(40, r.votes / 600),
    }))
    .sort((a, b) => b.buzz - a.buzz);

  const top10 = ranked.slice(0, 10);
  const rest = ranked.slice(10);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-secondary mb-2">
          <Flame className="h-5 w-5" />
          <span className="text-xs uppercase tracking-widest font-semibold">Trending Now</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
          Hot in <span className="text-gradient">Bengaluru</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ranked by a blend of rating + raw vote velocity. The whole city's top 10 right now.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        {top10.map(({ r }, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
          >
            <Link
              to="/restaurant/$id"
              params={{ id: r.id }}
              className="glass-strong rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-glow transition-all"
            >
              <div className="text-3xl font-black tabular-nums w-10 text-center" style={{ color: i < 3 ? "var(--color-primary)" : "oklch(0.55 0.02 280)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-4xl">{r.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                  <span>· {r.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-primary justify-end">
                  <Star className="h-3.5 w-3.5 fill-current" />{r.rate}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end mt-0.5">
                  <TrendingUp className="h-3 w-3" />{(r.votes/1000).toFixed(1)}k votes
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4">Also buzzing</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rest.map(({ r }) => (
              <Link key={r.id} to="/restaurant/$id" params={{ id: r.id }} className="glass rounded-2xl p-4 hover:-translate-y-1 transition-transform">
                <div className="text-2xl">{r.emoji}</div>
                <div className="font-semibold text-sm mt-2 truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.location}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}