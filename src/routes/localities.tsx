import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { restaurants, LOCATIONS } from "@/data/restaurants";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/localities")({
  head: () => ({
    meta: [
      { title: "Bengaluru Localities — Restaurant Hubs | DineDuel" },
      { name: "description", content: "Discover top restaurants by locality across Bengaluru — Indiranagar, Koramangala, HSR, Jayanagar, MG Road, Whitefield and Brigade Road." },
      { property: "og:title", content: "Bengaluru Localities — DineDuel" },
      { property: "og:description", content: "The best of every Bengaluru neighbourhood, ranked." },
    ],
  }),
  component: LocalitiesPage,
});

const LOCALITY_BLURBS: Record<string, string> = {
  "Indiranagar": "Brewpubs, bakehouses & cafes — Bengaluru's hippest strip.",
  "Koramangala": "Tech-bro biryani belt with steakhouses & dessert bars.",
  "HSR Layout": "Quiet residential foodie favourites and grill houses.",
  "Jayanagar": "Old-school South Indian classics & ice-cream legends.",
  "MG Road": "Heritage burgers, biryani & cocktail bars downtown.",
  "Whitefield": "Mall-side global cuisine for the IT corridor.",
  "Brigade Road": "Late-night biryani, pubs & shopping street eats.",
};

function LocalitiesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
          Bengaluru, <span className="text-gradient">neighbourhood by neighbourhood</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Every locality has its own personality. Tap in to see top picks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LOCATIONS.map((loc) => {
          const items = restaurants.filter((r) => r.location === loc);
          const top = [...items].sort((a, b) => b.rate - a.rate).slice(0, 3);
          return (
            <Link
              key={loc}
              to="/localities/$slug"
              params={{ slug: slugify(loc) }}
              className="glass-strong rounded-3xl p-6 block transition-all hover:-translate-y-1 hover:shadow-glow group"
            >
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest">Locality</span>
              </div>
              <h2 className="text-2xl font-bold">{loc}</h2>
              <p className="text-sm text-muted-foreground mt-1">{LOCALITY_BLURBS[loc]}</p>
              <div className="text-xs text-muted-foreground mt-4">
                <span className="text-foreground font-bold">{items.length}</span> restaurants
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {top.map((t) => (
                  <span key={t.id} className="text-xs rounded-full px-2 py-1 bg-muted/40">
                    {t.emoji} {t.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-5 group-hover:gap-2 transition-all">
                Explore {loc} <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}