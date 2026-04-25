import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants, LOCATIONS, type Restaurant } from "@/data/restaurants";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/localities/$slug")({
  loader: ({ params }) => {
    const loc = LOCATIONS.find((l) => slugify(l) === params.slug);
    if (!loc) throw notFound();
    const items = restaurants.filter((r) => r.location === loc).sort((a, b) => b.rate - a.rate);
    return { loc, items };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.loc} Restaurants — Top Picks | DineDuel` },
          { name: "description", content: `Best restaurants in ${loaderData.loc}, Bengaluru. ${loaderData.items.length} curated spots ranked by sentiment & rating.` },
          { property: "og:title", content: `${loaderData.loc} — DineDuel` },
          { property: "og:description", content: `Top restaurants in ${loaderData.loc}, ranked.` },
        ]
      : [],
  }),
  component: LocalityPage,
  notFoundComponent: () => (
    <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="text-6xl mb-4">🗺️</div>
      <h1 className="text-3xl font-bold mb-2">Locality not found</h1>
      <Link to="/localities" className="text-primary underline">Back to Localities</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
});

function LocalityPage() {
  const { loc, items } = Route.useLoaderData();
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <Link to="/localities" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3 w-3" /> All Localities
      </Link>
      <div className="flex items-center gap-2 text-primary mb-2">
        <MapPin className="h-5 w-5" />
        <span className="text-xs uppercase tracking-widest font-semibold">Locality</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
        <span className="text-gradient">{loc}</span>
      </h1>
      <p className="text-muted-foreground mt-3">{items.length} restaurants ranked by rating.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {items.map((r: Restaurant, i: number) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
          >
            <Link
              to="/restaurant/$id"
              params={{ id: r.id }}
              className="glass rounded-2xl p-5 block hover:-translate-y-1 hover:shadow-glow transition-all relative h-full"
            >
              {i < 3 && (
                <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-glow"
                  style={{ background: "var(--gradient-hero)", color: "var(--color-primary-foreground)" }}>
                  #{i + 1}
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <div className="text-4xl">{r.emoji}</div>
                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                  <Star className="h-3.5 w-3.5 fill-current" />{r.rate}
                </div>
              </div>
              <div className="font-bold truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground truncate">{r.cuisines.slice(0,2).join(", ")}</div>
              <div className="flex justify-between text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-0.5"><IndianRupee className="h-3 w-3" />{r.avg_cost} for two</span>
                <span>{(r.votes/1000).toFixed(1)}k votes</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}