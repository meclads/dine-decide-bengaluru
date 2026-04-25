import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, MapPin, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants, LOCATIONS } from "@/data/restaurants";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Bengaluru Restaurants | DineDuel" },
      { name: "description", content: "Browse every restaurant in DineDuel's Bengaluru index — search by name, filter by locality and price." },
      { property: "og:title", content: "Explore Bengaluru Restaurants — DineDuel" },
      { property: "og:description", content: "The full Bengaluru restaurant index with search & filters." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<string | null>(null);
  const [sort, setSort] = useState<"rate" | "votes" | "cost">("rate");

  const list = useMemo(() => {
    const filtered = restaurants.filter((r) => {
      if (loc && r.location !== loc) return false;
      if (q && !r.name.toLowerCase().includes(q.toLowerCase()) && !r.cuisines.join(" ").toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "rate") return b.rate - a.rate;
      if (sort === "votes") return b.votes - a.votes;
      return a.avg_cost - b.avg_cost;
    });
  }, [q, loc, sort]);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
          Explore <span className="text-gradient">Bengaluru's</span> finest
        </h1>
        <p className="mt-3 text-muted-foreground">
          {restaurants.length} restaurants curated across {LOCATIONS.length} iconic localities.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center sticky top-16 z-30">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or cuisine…"
            className="w-full bg-muted/40 rounded-full pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={loc ?? ""}
          onChange={(e) => setLoc(e.target.value || null)}
          className="bg-muted/40 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          <option value="">All localities</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="bg-muted/40 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          <option value="rate">Top rated</option>
          <option value="votes">Most voted</option>
          <option value="cost">Lowest price</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold">No matches</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term or clear filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.3) }}
            >
              <Link
                to="/restaurant/$id"
                params={{ id: r.id }}
                className="glass rounded-2xl p-5 block transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/40 h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{r.emoji}</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-primary">
                    <Star className="h-3.5 w-3.5 fill-current" />{r.rate}
                  </div>
                </div>
                <div className="font-bold truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.type} · {r.cuisines.slice(0, 2).join(", ")}</div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                  <span className="flex items-center gap-0.5 font-semibold text-foreground"><IndianRupee className="h-3 w-3" />{r.avg_cost}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}