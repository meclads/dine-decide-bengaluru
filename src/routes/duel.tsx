import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants, type Restaurant } from "@/data/restaurants";
import { RestaurantPicker } from "@/components/dineduel/RestaurantPicker";
import { ComparisonCard } from "@/components/dineduel/ComparisonCard";
import { SentimentRadar } from "@/components/dineduel/SentimentRadar";
import { FilterSidebar } from "@/components/dineduel/FilterSidebar";

export const Route = createFileRoute("/duel")({
  head: () => ({
    meta: [
      { title: "Duel — Compare Bengaluru Restaurants Side-by-Side | DineDuel" },
      { name: "description", content: "Side-by-side restaurant duels for Bengaluru. Sentiment radar, Hinglish buzz, ratings and price compared in real time." },
      { property: "og:title", content: "DineDuel — Restaurant Comparison Tool" },
      { property: "og:description", content: "Pick two Bengaluru restaurants and watch the concierge verdict appear instantly." },
    ],
  }),
  component: DuelPage,
});

function scoreBreakdown(r: Restaurant) {
  const sentAvg = (r.sentiment.food + r.sentiment.service + r.sentiment.ambiance + r.sentiment.value + r.sentiment.hygiene) / 5;
  const rating = (r.rate / 5) * 50;
  const sentiment = (sentAvg / 100) * 35;
  const popularity = Math.min(1, r.votes / 25000) * 15;
  return { rating, sentiment, popularity, total: rating + sentiment + popularity };
}

function DuelPage() {
  const [a, setA] = useState<Restaurant>(restaurants[0]);
  const [b, setB] = useState<Restaurant>(restaurants[1]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState(2500);

  const filtered = useMemo(
    () =>
      restaurants.filter(
        (r) => (!activeLocation || r.location === activeLocation) && r.avg_cost <= priceMax,
      ),
    [activeLocation, priceMax],
  );

  const sa = scoreBreakdown(a).total;
  const sb = scoreBreakdown(b).total;
  const winner = Math.abs(sa - sb) < 0.05 ? null : sa > sb ? a.id : b.id;
  const winnerName = winner === a.id ? a.name : winner === b.id ? b.name : null;
  const margin = Math.abs(sa - sb).toFixed(1);
  const verdict = winnerName
    ? `${winnerName} wins by ${margin} pts (${sa.toFixed(1)} vs ${sb.toFixed(1)})`
    : `It's a tie at ${sa.toFixed(1)} pts!`;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
          The <span className="text-gradient">Duel</span> Arena
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Pick two contenders. We'll score them across rating, sentiment & popularity — winner declared in 3 seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <FilterSidebar
          activeLocation={activeLocation}
          onLocation={setActiveLocation}
          priceMax={priceMax}
          onPriceMax={setPriceMax}
        />

        <div className="space-y-6 min-w-0">
          <section className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <RestaurantPicker selected={a} onChange={setA} excludeId={b.id} side="left" />
            <div className="text-center">
              <div
                className="mx-auto h-12 w-12 rounded-full flex items-center justify-center text-xl font-black shadow-glow"
                style={{ background: "var(--gradient-hero)" }}
              >
                VS
              </div>
            </div>
            <RestaurantPicker selected={b} onChange={setB} excludeId={a.id} side="right" />
          </section>

          <div
            className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between flex-wrap gap-3"
            style={{ borderColor: "color-mix(in oklch, var(--color-primary) 35%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="text-muted-foreground">Concierge verdict:</span>{" "}
                <span className="font-semibold">{verdict}</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Filtered pool: <span className="text-foreground font-semibold">{filtered.length}</span> restaurants
            </div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ComparisonCard r={a} rival={b} side="left" winner={winner === a.id} />
              </motion.div>
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <ComparisonCard r={b} rival={a} side="right" winner={winner === b.id} />
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="glass rounded-3xl p-6 lg:p-8">
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
              <h2 className="text-xl font-bold">Sentiment Radar</h2>
              <p className="text-xs text-muted-foreground">
                Five-axis comparison · larger area = happier diners
              </p>
            </div>
            <SentimentRadar a={a} b={b} />
          </section>
        </div>
      </div>
    </div>
  );
}