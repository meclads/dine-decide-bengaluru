import { LOCATIONS } from "@/data/restaurants";
import { MapPin, Wallet, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

type Props = {
  activeLocation: string | null;
  onLocation: (loc: string | null) => void;
  priceMax: number;
  onPriceMax: (n: number) => void;
};

export function FilterSidebar({ activeLocation, onLocation, priceMax, onPriceMax }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => LOCATIONS.filter((l) => l.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  return (
    <aside className="glass rounded-3xl p-5 lg:p-6 space-y-6 lg:sticky lg:top-6 h-fit">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-widest">Locality</h3>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locality…"
            className="w-full text-xs rounded-full bg-muted/40 pl-8 pr-8 py-2 outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onLocation(null)}
            className={`text-xs rounded-full px-3 py-1.5 transition-all ${
              activeLocation === null
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {filtered.map((loc) => (
            <button
              key={loc}
              onClick={() => onLocation(loc)}
              className={`text-xs rounded-full px-3 py-1.5 transition-all ${
                activeLocation === loc
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {loc}
            </button>
          ))}
          {filtered.length === 0 && (
            <span className="text-xs text-muted-foreground py-1.5">No matches</span>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold uppercase tracking-widest">Max ₹ for two</h3>
          </div>
          <span className="text-sm font-bold text-accent">₹{priceMax}</span>
        </div>
        <input
          type="range"
          min={400}
          max={2500}
          step={100}
          value={priceMax}
          onChange={(e) => onPriceMax(Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>₹400</span>
          <span>₹2,500</span>
        </div>
      </div>

      <div className="rounded-2xl p-4 border border-primary/20 bg-primary/5">
        <div className="text-xs text-muted-foreground mb-1">Concierge tip</div>
        <div className="text-sm">
          Pick two restaurants from the same locality for the fairest duel. 🥊
        </div>
      </div>
    </aside>
  );
}