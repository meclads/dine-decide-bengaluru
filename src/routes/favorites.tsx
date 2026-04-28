import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bookmark, Loader2, Star, MapPin } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteButton } from "@/components/dineduel/FavoriteButton";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Favorites — DineDuel" },
      { name: "description", content: "Your bookmarked Bengaluru restaurants — synced across devices." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { ids, loading } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  if (authLoading || !user || loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
      </div>
    );
  }

  const favs = restaurants.filter((r) => ids.has(r.id));

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-primary" /> My Favorites
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {favs.length} bookmarked restaurant{favs.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border border-border hover:bg-muted/40"
        >
          Explore more
        </Link>
      </div>

      {favs.length === 0 ? (
        <div className="glass-strong rounded-3xl p-10 text-center">
          <div className="text-6xl mb-3">🔖</div>
          <h2 className="text-xl font-bold">No favorites yet</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            Tap the bookmark icon on any restaurant to save it here.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-background shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favs.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5 relative group">
              <div className="absolute top-3 right-3">
                <FavoriteButton restaurantId={r.id} />
              </div>
              <Link to="/restaurant/$id" params={{ id: r.id }} className="block">
                <div className="text-4xl">{r.emoji}</div>
                <div className="font-semibold mt-2 truncate pr-8">{r.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {r.location}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="flex items-center gap-1 text-primary font-bold">
                    <Star className="h-3 w-3 fill-current" />
                    {r.rate}
                  </span>
                  <span className="text-muted-foreground">₹{r.avg_cost} for two</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}