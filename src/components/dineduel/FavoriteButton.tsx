import { Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoriteButton({
  restaurantId,
  variant = "icon",
}: {
  restaurantId: string;
  variant?: "icon" | "pill";
}) {
  const navigate = useNavigate();
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(restaurantId);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggle(restaurantId);
    if (res.needsAuth) {
      toast.info("Sign in to save favorites");
      navigate({ to: "/auth" });
      return;
    }
    if (!res.ok) {
      toast.error(res.error || "Could not update favorite");
      return;
    }
    toast.success(res.added ? "Saved to favorites" : "Removed from favorites");
  };

  if (variant === "pill") {
    return (
      <button
        onClick={onClick}
        aria-pressed={fav}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border transition ${
          fav
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border hover:bg-muted/40"
        }`}
      >
        {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {fav ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={`p-2 rounded-full backdrop-blur-md transition ${
        fav
          ? "bg-primary/20 text-primary"
          : "bg-background/60 text-muted-foreground hover:text-primary hover:bg-background/80"
      }`}
    >
      {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  );
}