import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("favorites").select("restaurant_id");
    setIds(new Set((data ?? []).map((r) => r.restaurant_id as string)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (restaurantId: string) => {
      if (!user) return { ok: false, needsAuth: true };
      if (ids.has(restaurantId)) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("restaurant_id", restaurantId);
        if (error) return { ok: false, error: error.message };
        setIds((s) => {
          const n = new Set(s);
          n.delete(restaurantId);
          return n;
        });
        return { ok: true, added: false };
      }
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, restaurant_id: restaurantId });
      if (error) return { ok: false, error: error.message };
      setIds((s) => new Set(s).add(restaurantId));
      return { ok: true, added: true };
    },
    [ids, user],
  );

  return { ids, loading, toggle, isFavorite: (id: string) => ids.has(id), refresh };
}