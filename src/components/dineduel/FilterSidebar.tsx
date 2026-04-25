import { LOCATIONS } from "@/data/restaurants";
import { MapPin, Wallet } from "lucide-react";

type Props = {
  activeLocation: string | null;
  onLocation: (loc: string | null) => void;
  priceMax: number;
  onPriceMax: (n: number) => void;
};

export function FilterSidebar({ activeLocation, onLocation, priceMax, onPriceMax }: Props) {
  return (
    <aside className="glass rounded-3xl p-5 lg:p-6 space-y-6 lg:sticky lg:top-6 h-fit">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-widest">Locality</h3>
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
          {LOCATIONS.map((loc) => (
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