import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Heart, Loader2, Star, Users, IndianRupee, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants, type Restaurant } from "@/data/restaurants";
import { RestaurantPicker } from "@/components/dineduel/RestaurantPicker";
import { ComparisonCard } from "@/components/dineduel/ComparisonCard";
import { SentimentRadar } from "@/components/dineduel/SentimentRadar";
import { FilterSidebar } from "@/components/dineduel/FilterSidebar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/duel")({
  head: () => ({
    meta: [
      { title: "Duel — Compare Bengaluru Restaurants Side-by-Side | DineDuel" },
      { name: "description", content: "Side-by-side restaurant duels for Bengaluru. Sentiment radar, Hinglish buzz, ratings and price compared in real time." },
      { property: "og:title", content: "DineDuel — Restaurant Comparison Tool" },
      { property: "og:description", content: "Pick two Bengaluru restaurants and watch the concierge verdict appear instantly." },
    ],
  }),
  component: DuelPage,
});

function scoreBreakdown(r: Restaurant) {
  const sentAvg = (r.sentiment.food + r.sentiment.service + r.sentiment.ambiance + r.sentiment.value + r.sentiment.hygiene) / 5;
  const rating = (r.rate / 5) * 50;
  const sentiment = (sentAvg / 100) * 35;
  const popularity = Math.min(1, r.votes / 25000) * 15;
  return { rating, sentiment, popularity, total: rating + sentiment + popularity };
}

function decideWinner(a: Restaurant, b: Restaurant) {
  const sa = scoreBreakdown(a).total;
  const sb = scoreBreakdown(b).total;

  if (a.rate !== b.rate) {
    return {
      winnerId: a.rate > b.rate ? a.id : b.id,
      scoreA: sa,
      scoreB: sb,
      reason: "rating" as const,
    };
  }

  if (Math.abs(sa - sb) < 0.05) {
    return {
      winnerId: null,
      scoreA: sa,
      scoreB: sb,
      reason: "tie" as const,
    };
  }

  return {
    winnerId: sa > sb ? a.id : b.id,
    scoreA: sa,
    scoreB: sb,
    reason: "score" as const,
  };
}

function DuelPage() {
  const [a, setA] = useState<Restaurant>(restaurants[0]);
  const [b, setB] = useState<Restaurant>(restaurants[1]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState(2500);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const saveDuel = async () => {
    if (!user) {
      toast.info("Sign in to save duels");
      navigate({ to: "/auth" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("saved_duels").insert({
      user_id: user.id,
      restaurant_a_id: a.id,
      restaurant_b_id: b.id,
      note: winnerName ? `${winnerName} wins` : `Tie`,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Duel saved!");
  };

  const filtered = useMemo(
    () =>
      restaurants.filter(
        (r) => (!activeLocation || r.location === activeLocation) && r.avg_cost <= priceMax,
      ),
    [activeLocation, priceMax],
  );

  const { winnerId: winner, scoreA: sa, scoreB: sb, reason: winnerReason } = useMemo(
    () => decideWinner(a, b),
    [a, b],
  );
  const winnerName = winner === a.id ? a.name : winner === b.id ? b.name : null;
  const ratingMargin = Math.abs(a.rate - b.rate).toFixed(1);
  const verdict = winnerName
    ? winnerReason === "score"
      ? `${winnerName} edges it on overall score (${sa.toFixed(1)} vs ${sb.toFixed(1)})`
      : `${winnerName} wins with ${Math.max(a.rate, b.rate)}★ (margin ${ratingMargin})`
    : `It's a tie at ${a.rate}★`;

  const winnerR = winner === a.id ? a : winner === b.id ? b : null;
  const loserR = winnerR ? (winnerR.id === a.id ? b : a) : null;
  const reasons = winnerR && loserR
    ? [
        {
          icon: Star,
          label: "Rating",
          detail:
            winnerR.rate > loserR.rate
              ? `Higher star rating — ${winnerR.rate}★ vs ${loserR.rate}★ (+${(winnerR.rate - loserR.rate).toFixed(1)})`
              : winnerR.rate === loserR.rate
                ? `Tied on stars at ${winnerR.rate}★`
                : `Lower stars (${winnerR.rate}★ vs ${loserR.rate}★) but made up elsewhere`,
          win: winnerR.rate >= loserR.rate,
        },
        {
          icon: Users,
          label: "Popularity",
          detail:
            winnerR.votes > loserR.votes
              ? `More diners voting — ${(winnerR.votes / 1000).toFixed(1)}k vs ${(loserR.votes / 1000).toFixed(1)}k reviews`
              : winnerR.votes === loserR.votes
                ? `Equally buzzed about (${(winnerR.votes / 1000).toFixed(1)}k reviews each)`
                : `Smaller crowd (${(winnerR.votes / 1000).toFixed(1)}k vs ${(loserR.votes / 1000).toFixed(1)}k) but loyal fans`,
          win: winnerR.votes >= loserR.votes,
        },
        {
          icon: IndianRupee,
          label: "Price",
          detail:
            winnerR.avg_cost < loserR.avg_cost
              ? `Lighter on the wallet — ₹${winnerR.avg_cost} vs ₹${loserR.avg_cost} for two`
              : winnerR.avg_cost === loserR.avg_cost
                ? `Same ticket size at ₹${winnerR.avg_cost} for two`
                : `Pricier (₹${winnerR.avg_cost} vs ₹${loserR.avg_cost}) but worth the spend`,
          win: winnerR.avg_cost <= loserR.avg_cost,
        },
      ]
    : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05]">
          The <span className="text-gradient">Duel</span> Arena
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Pick two contenders. We'll score them across rating, sentiment & popularity — winner declared in 3 seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <FilterSidebar
          activeLocation={activeLocation}
          onLocation={setActiveLocation}
          priceMax={priceMax}
          onPriceMax={setPriceMax}
        />

        <div className="space-y-6 min-w-0">
          <section className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <RestaurantPicker selected={a} onChange={setA} excludeId={b.id} side="left" />
            <div className="text-center">
              <div
                className="mx-auto h-12 w-12 rounded-full flex items-center justify-center text-xl font-black shadow-glow"
                style={{ background: "var(--gradient-hero)" }}
              >
                VS
              </div>
            </div>
            <RestaurantPicker selected={b} onChange={setB} excludeId={a.id} side="right" />
          </section>

          <div
            className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between flex-wrap gap-3"
            style={{ borderColor: "color-mix(in oklch, var(--color-primary) 35%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="text-muted-foreground">Concierge verdict:</span>{" "}
                <span className="font-semibold">{verdict}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                Pool: <span className="text-foreground font-semibold">{filtered.length}</span>
              </div>
              <button
                onClick={saveDuel}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className="h-3.5 w-3.5" />}
                Save duel
              </button>
            </div>
          </div>

          {winnerR && (
            <div
              className="glass rounded-2xl p-5"
              style={{ borderColor: "color-mix(in oklch, oklch(0.85 0.17 85) 35%, transparent)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-4 w-4" style={{ color: "oklch(0.85 0.17 85)" }} />
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Why {winnerR.name} won
                </h3>
              </div>
              <ul className="grid sm:grid-cols-3 gap-3">
                {reasons.map(({ icon: Icon, label, detail, win }) => (
                  <li
                    key={label}
                    className="rounded-xl p-3 bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: win ? "oklch(0.85 0.17 85)" : "var(--color-muted-foreground)" }}
                      />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                        {label}
                      </span>
                    </div>
                    <p className="text-xs leading-snug">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ComparisonCard r={a} rival={b} side="left" winner={winner === a.id} />
              </motion.div>
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <ComparisonCard r={b} rival={a} side="right" winner={winner === b.id} />
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="glass rounded-3xl p-6 lg:p-8">
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
              <h2 className="text-xl font-bold">Sentiment Radar</h2>
              <p className="text-xs text-muted-foreground">
                Five-axis comparison · larger area = happier diners
              </p>
            </div>
            <SentimentRadar a={a} b={b} />
          </section>
        </div>
      </div>
    </div>
  );
}