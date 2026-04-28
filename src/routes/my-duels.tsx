import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Swords, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { restaurants } from "@/data/restaurants";
import { toast } from "sonner";

export const Route = createFileRoute("/my-duels")({
  head: () => ({
    meta: [
      { title: "My Duels — DineDuel" },
      { name: "description", content: "Your saved restaurant duels — synced across devices." },
    ],
  }),
  component: MyDuelsPage,
});

type SavedDuel = {
  id: string;
  restaurant_a_id: string;
  restaurant_b_id: string;
  note: string | null;
  created_at: string;
};

function MyDuelsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [duels, setDuels] = useState<SavedDuel[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_duels")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setDuels(data as SavedDuel[]);
        setFetching(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("saved_duels").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setDuels((d) => d.filter((x) => x.id !== id));
    toast.success("Duel removed");
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-4xl font-bold">My Duels</h1>
          <p className="text-sm text-muted-foreground mt-1">{duels.length} saved comparison{duels.length === 1 ? "" : "s"}</p>
        </div>
        <Link
          to="/duel"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-background shadow-glow"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Swords className="h-3.5 w-3.5" /> New Duel
        </Link>
      </div>

      {fetching ? (
        <div className="text-center py-20"><Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" /></div>
      ) : duels.length === 0 ? (
        <div className="glass-strong rounded-3xl p-10 text-center">
          <div className="text-6xl mb-3">⚔️</div>
          <h2 className="text-xl font-bold">No duels saved yet</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Pick two restaurants and tap save.</p>
          <Link to="/duel" className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-background shadow-glow" style={{ background: "var(--gradient-hero)" }}>
            Start your first duel
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {duels.map((d) => {
            const a = restaurants.find((r) => r.id === d.restaurant_a_id);
            const b = restaurants.find((r) => r.id === d.restaurant_b_id);
            if (!a || !b) return null;
            return (
              <div key={d.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-3xl">{a.emoji}</div>
                    <span className="text-xs font-bold text-muted-foreground">VS</span>
                    <div className="text-3xl">{b.emoji}</div>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-muted/40"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Link to="/restaurant/$id" params={{ id: a.id }} className="truncate hover:text-primary">
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-primary fill-current" />{a.rate}</div>
                  </Link>
                  <Link to="/restaurant/$id" params={{ id: b.id }} className="truncate hover:text-primary">
                    <div className="font-semibold truncate">{b.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-primary fill-current" />{b.rate}</div>
                  </Link>
                </div>
                {d.note && <p className="text-xs text-muted-foreground mt-3 italic">"{d.note}"</p>}
                <div className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
                  {new Date(d.created_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}