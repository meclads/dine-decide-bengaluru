import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { restaurants, type Restaurant } from "@/data/restaurants";

type Props = {
  selected: Restaurant;
  onChange: (r: Restaurant) => void;
  excludeId?: string;
  side: "left" | "right";
};

export function RestaurantPicker({ selected, onChange, excludeId, side }: Props) {
  const [open, setOpen] = useState(false);
  const accent = side === "left" ? "var(--color-primary)" : "var(--color-accent)";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="glass w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:shadow-glow"
        style={{ borderColor: accent }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{selected.emoji}</span>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {side === "left" ? "Challenger A" : "Challenger B"}
            </div>
            <div className="font-semibold truncate">{selected.name}</div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="glass-strong absolute z-30 mt-2 w-full max-h-80 overflow-auto rounded-2xl p-2 shadow-card">
          {restaurants
            .filter((r) => r.id !== excludeId)
            .map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted/40 transition-colors"
              >
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {r.location} · ₹{r.avg_cost} for two
                  </div>
                </div>
                {r.id === selected.id && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
