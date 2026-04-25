import { createFileRoute, Link } from "@tanstack/react-router";
import { Swords, Sparkles, ArrowRight, Star, MapPin, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants, LOCATIONS } from "@/data/restaurants";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DineDuel — Bengaluru's Premium Restaurant Showdown" },
      { name: "description", content: "Compare Bengaluru's best restaurants side-by-side. Sentiment radar, Hinglish buzzwords, ratings & price duels — pick the winner in 3 seconds." },
      { property: "og:title", content: "DineDuel — Bengaluru's Premium Restaurant Showdown" },
      { property: "og:description", content: "The premium concierge for Bengaluru foodies." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = [...restaurants].sort((a, b) => b.rate - a.rate).slice(0, 3);
  const heroDuel = [restaurants.find((r) => r.id === "truffles")!, restaurants.find((r) => r.id === "glens")!];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3 w-3 text-primary" /> Premium Concierge · Bengaluru
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02]">
              Two restaurants enter.
              <br />
              <span className="text-gradient">One Bengaluru favourite wins.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Side-by-side duels across price, ratings, sentiment & Hinglish buzz —
              from Indiranagar's bakehouses to MG Road's biryani legends.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/duel"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-background shadow-glow transition-transform hover:scale-105"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Swords className="h-4 w-4" /> Start a Duel
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border hover:bg-muted/40 transition-colors"
              >
                Browse all restaurants <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Hero duel preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center max-w-4xl mx-auto"
          >
            {heroDuel.map((r, i) => (
              <Link
                key={r.id}
                to="/restaurant/$id"
                params={{ id: r.id }}
                className={`glass-strong rounded-3xl p-6 hover:-translate-y-1 transition-all ${i === 1 ? "md:order-3" : ""}`}
              >
                <div className="text-5xl mb-3">{r.emoji}</div>
                <div className="text-xl font-bold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.location}</div>
                <div className="flex items-center gap-1 text-sm font-bold text-primary mt-3">
                  <Star className="h-3.5 w-3.5 fill-current" />{r.rate}
                  <span className="text-muted-foreground font-normal ml-2">· ₹{r.avg_cost} for two</span>
                </div>
              </Link>
            ))}
            <div className="text-center md:order-2 py-4">
              <div
                className="mx-auto h-14 w-14 rounded-full flex items-center justify-center text-lg font-black shadow-glow animate-float"
                style={{ background: "var(--gradient-hero)", color: "var(--color-primary-foreground)" }}
              >
                VS
              </div>
              <Link to="/duel" className="text-xs text-primary mt-3 inline-block hover:underline">
                Open in arena →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-widest font-semibold">
              <Flame className="h-4 w-4" /> Featured
            </div>
            <h2 className="text-3xl font-bold mt-1">Top-rated this week</h2>
          </div>
          <Link to="/trending" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            See trending <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to="/restaurant/$id"
                params={{ id: r.id }}
                className="glass-strong rounded-3xl p-6 block hover:-translate-y-1 hover:shadow-glow transition-all h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{r.emoji}</div>
                  <div className="rounded-full px-2.5 py-1 bg-primary/15 text-primary text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />{r.rate}
                  </div>
                </div>
                <div className="text-xl font-bold">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.cuisines.slice(0, 3).join(" · ")}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{(r.votes/1000).toFixed(1)}k votes</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Localities */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-semibold">
              <MapPin className="h-4 w-4" /> Neighbourhoods
            </div>
            <h2 className="text-3xl font-bold mt-1">Pick a Bengaluru hood</h2>
          </div>
          <Link to="/localities" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            All localities <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {LOCATIONS.map((loc) => {
            const count = restaurants.filter((r) => r.location === loc).length;
            return (
              <Link
                key={loc}
                to="/localities/$slug"
                params={{ slug: slugify(loc) }}
                className="glass rounded-2xl p-5 hover:-translate-y-1 hover:shadow-glow hover:border-primary/40 transition-all"
              >
                <div className="font-bold">{loc}</div>
                <div className="text-xs text-muted-foreground mt-1">{count} restaurants</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div
          className="glass-strong rounded-3xl p-10 lg:p-14 text-center"
          style={{ background: "var(--gradient-mesh)" }}
        >
          <Swords className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold max-w-2xl mx-auto leading-tight">
            Can't decide between two spots?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Drop them in the arena. Our concierge picks a winner in under 3 seconds.
          </p>
          <Link
            to="/duel"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-background shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Swords className="h-4 w-4" /> Start a Duel
          </Link>
        </div>
      </section>
    </div>
  );
}
