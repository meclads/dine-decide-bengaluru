import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Swords, Sparkles } from "lucide-react";
import { restaurants, type Restaurant } from "@/data/restaurants";
import { RestaurantPicker } from "@/components/dineduel/RestaurantPicker";
import { ComparisonCard } from "@/components/dineduel/ComparisonCard";
import { SentimentRadar } from "@/components/dineduel/SentimentRadar";
import { FilterSidebar } from "@/components/dineduel/FilterSidebar";
import { HotInBengaluru } from "@/components/dineduel/HotInBengaluru";

export const Route = createFileRoute("/")({
  component: Index,
});

function score(r: Restaurant) {
  const sentAvg =
    (r.sentiment.food + r.sentiment.service + r.sentiment.ambiance + r.sentiment.value + r.sentiment.hygiene) / 5;
  // weighted: rating 40%, sentiment 35%, popularity 15%, value (inverse cost) 10%
  return (
    (r.rate / 5) * 40 +
    (sentAvg / 100) * 35 +
    Math.min(1, r.votes / 25000) * 15 +
    (1 - Math.min(1, r.avg_cost / 2500)) * 10
  );
}

function Index() {
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

  const sa = score(a);
  const sb = score(b);
  const winner = sa === sb ? null : sa > sb ? a.id : b.id;
  const verdict =
    winner === a.id
      ? `${a.name} edges out by ${(sa - sb).toFixed(1)} pts`
      : winner === b.id
      ? `${b.name} edges out by ${(sb - sa).toFixed(1)} pts`
      : "It's a tie!";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Swords className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/40 -z-10" />
              </div>
              <span className="font-bold text-lg tracking-tight">DineDuel</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">· Bengaluru</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground glass rounded-full px-3 py-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              Premium Concierge
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Two restaurants enter.
              <br />
              <span className="text-gradient">One Bengaluru favourite wins.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
              Side-by-side duels across price, ratings, sentiment & Hinglish buzz —
              from Indiranagar's bakehouses to MG Road's biryani legends.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <FilterSidebar
            activeLocation={activeLocation}
            onLocation={setActiveLocation}
            priceMax={priceMax}
            onPriceMax={setPriceMax}
          />

          <div className="space-y-6 min-w-0">
            {/* Pickers + verdict bento */}
            <section className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <RestaurantPicker
                selected={a}
                onChange={setA}
                excludeId={b.id}
                side="left"
              />
              <div className="text-center">
                <div
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center text-xl font-black shadow-glow"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  VS
                </div>
              </div>
              <RestaurantPicker
                selected={b}
                onChange={setB}
                excludeId={a.id}
                side="right"
              />
            </section>

            {/* Verdict bar */}
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

            {/* Bento grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ComparisonCard r={a} side="left" winner={winner === a.id} />
              <ComparisonCard r={b} side="right" winner={winner === b.id} />
            </section>

            {/* Sentiment radar — full width */}
            <section className="glass rounded-3xl p-6 lg:p-8">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                <h2 className="text-xl font-bold">Sentiment Radar</h2>
                <p className="text-xs text-muted-foreground">
                  Five-axis comparison · larger area = happier diners
                </p>
              </div>
              <SentimentRadar a={a} b={b} />
            </section>

            <HotInBengaluru />

            <footer className="text-center text-xs text-muted-foreground pt-6">
              DineDuel · Curated for Bengaluru foodies · Data styled after Zomato Bangalore Restaurants
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
