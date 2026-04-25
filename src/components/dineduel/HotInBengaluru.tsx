import { Flame, MapPin, Star } from "lucide-react";
import { restaurants } from "@/data/restaurants";

export function HotInBengaluru() {
  const hot = restaurants
    .filter((r) => r.location === "MG Road" || r.location === "Indiranagar")
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 4);

  return (
    <section className="glass rounded-3xl p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-5">
        <div className="relative">
          <Flame className="h-5 w-5 text-secondary" />
          <div className="absolute inset-0 blur-md bg-secondary/50 -z-10" />
        </div>
        <h2 className="text-xl font-bold">Hot in Bengaluru</h2>
        <span className="text-xs text-muted-foreground">· MG Road & Indiranagar</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {hot.map((r, i) => (
          <div
            key={r.id}
            className="group relative rounded-2xl p-4 bg-muted/20 border border-border hover:border-primary/40 transition-all hover:-translate-y-1 cursor-default overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:opacity-30 group-hover:rotate-12 transition-all">
              {r.emoji}
            </div>
            <div className="relative">
              <div className="text-3xl mb-2">{r.emoji}</div>
              <div className="font-semibold truncate">{r.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                {r.location}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                  <Star className="h-3.5 w-3.5 fill-current" /> {r.rate}
                </div>
                <div className="text-[10px] text-muted-foreground">#{i + 1}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}