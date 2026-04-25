import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Star, MapPin, IndianRupee, Users, Swords, Trophy } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { SatisfactionBar } from "@/components/dineduel/SatisfactionBar";
import { BuzzCloud } from "@/components/dineduel/BuzzCloud";

export const Route = createFileRoute("/restaurant/$id")({
  loader: ({ params }) => {
    const r = restaurants.find((x) => x.id === params.id);
    if (!r) throw notFound();
    return { r };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.r.name} — ${loaderData.r.location} | DineDuel` },
          { name: "description", content: `${loaderData.r.name} in ${loaderData.r.location}: ${loaderData.r.cuisines.join(", ")}. Rated ${loaderData.r.rate}/5 by ${loaderData.r.votes.toLocaleString()} diners.` },
          { property: "og:title", content: `${loaderData.r.name} — DineDuel` },
          { property: "og:description", content: `Sentiment, buzz & verdict for ${loaderData.r.name} in ${loaderData.r.location}.` },
        ]
      : [],
  }),
  component: RestaurantPage,
  notFoundComponent: () => {
    const { id } = Route.useParams();
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🤷</div>
        <h1 className="text-3xl font-bold mb-2">Restaurant "{id}" not found</h1>
        <Link to="/explore" className="text-primary underline">Back to Explore</Link>
      </div>
    );
  },
  errorComponent: ({ error }) => (
    <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
});

function RestaurantPage() {
  const { r } = Route.useLoaderData();
  const overall = Math.round((r.sentiment.food + r.sentiment.service + r.sentiment.ambiance + r.sentiment.value + r.sentiment.hygiene) / 5);
  const similar = restaurants.filter((x) => x.id !== r.id && x.location === r.location).slice(0, 3);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <Link to="/explore" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3 w-3" /> Back to Explore
      </Link>

      <div className="glass-strong rounded-3xl p-6 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5 min-w-0">
            <div className="text-7xl">{r.emoji}</div>
            <div className="min-w-0">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{r.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{r.type} · {r.cuisines.join(" · ")}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" /> {r.address}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-3xl font-black text-primary">
              <Star className="h-6 w-6 fill-current" />{r.rate}
            </div>
            <div className="text-xs text-muted-foreground">{r.votes.toLocaleString()} votes</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          <Stat icon={<IndianRupee className="h-4 w-4" />} label="For two" value={`₹${r.avg_cost}`} />
          <Stat icon={<Users className="h-4 w-4" />} label="Votes" value={`${(r.votes/1000).toFixed(1)}k`} />
          <Stat icon={<Trophy className="h-4 w-4" />} label="Satisfaction" value={`${overall}`} />
          <Stat icon={<Star className="h-4 w-4" />} label="Rating" value={`${r.rate} / 5`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <div className="space-y-3">
            <h2 className="text-lg font-bold mb-3">Sentiment Breakdown</h2>
            <SatisfactionBar label="Food Quality" value={r.sentiment.food} />
            <SatisfactionBar label="Service" value={r.sentiment.service} tint="accent" />
            <SatisfactionBar label="Ambiance" value={r.sentiment.ambiance} />
            <SatisfactionBar label="Value" value={r.sentiment.value} tint="accent" />
            <SatisfactionBar label="Hygiene" value={r.sentiment.hygiene} />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-3">Hinglish Buzz</h2>
            <BuzzCloud r={r} />
            <div className="rounded-2xl border border-border p-4 mt-6">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Signature Dish</div>
              <div className="text-lg font-bold mt-1">{r.signature}</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold mb-3">Recent Reviews</h2>
          <div className="space-y-3">
            {r.reviews_list.map((rev, i) => (
              <div key={i} className="rounded-2xl bg-muted/20 border border-border p-4">
                <div className="flex items-center gap-1 text-primary text-sm">
                  {Array.from({ length: rev.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-sm mt-2">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/duel"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-background shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Swords className="h-4 w-4" /> Duel this restaurant
          </Link>
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-border hover:bg-muted/40">
            More restaurants
          </Link>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">More in {r.location}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {similar.map((s) => (
              <Link
                key={s.id}
                to="/restaurant/$id"
                params={{ id: s.id }}
                className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform"
              >
                <div className="text-3xl">{s.emoji}</div>
                <div className="font-semibold mt-2 truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-primary fill-current" />{s.rate} · ₹{s.avg_cost}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 p-4">
      <div className="flex items-center gap-1 text-muted-foreground text-xs">{icon}{label}</div>
      <div className="text-xl font-bold mt-1 tabular-nums">{value}</div>
    </div>
  );
}