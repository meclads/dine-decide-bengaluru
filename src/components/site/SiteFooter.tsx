import { Link } from "@tanstack/react-router";
import { Swords } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Swords className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">DineDuel</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Bengaluru's premium concierge for restaurant face-offs. Built on NLP sentiment over the Zomato Bengaluru dataset.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Explore</div>
          <ul className="space-y-1.5">
            <li><Link to="/duel" className="hover:text-primary">Start a Duel</Link></li>
            <li><Link to="/explore" className="hover:text-primary">All Restaurants</Link></li>
            <li><Link to="/trending" className="hover:text-primary">Trending</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Localities</div>
          <ul className="space-y-1.5">
            <li><Link to="/localities" className="hover:text-primary">All Localities</Link></li>
            <li><Link to="/localities/$slug" params={{ slug: "indiranagar" }} className="hover:text-primary">Indiranagar</Link></li>
            <li><Link to="/localities/$slug" params={{ slug: "koramangala" }} className="hover:text-primary">Koramangala</Link></li>
            <li><Link to="/localities/$slug" params={{ slug: "mg-road" }} className="hover:text-primary">MG Road</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">About</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            DineDuel | Deep Insights powered by NLP Sentiment Analysis on Zomato Bengaluru Dataset.
          </p>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} DineDuel · Curated for Bengaluru foodies 🍽️
        </div>
      </div>
    </footer>
  );
}