import { Link } from "@tanstack/react-router";
import { Swords, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/duel", label: "Duel" },
  { to: "/explore", label: "Explore" },
  { to: "/localities", label: "Localities" },
  { to: "/trending", label: "Trending" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Swords className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 blur-lg bg-primary/40 -z-10" />
            </div>
            <span className="font-bold text-lg tracking-tight">DineDuel</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:inline border-l border-border pl-2 ml-1">
              Bengaluru
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{
                  className:
                    "text-foreground bg-primary/15 ring-1 ring-primary/30",
                }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-muted/40" }}
                className="text-sm font-medium px-3 py-1.5 rounded-full transition-all"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/duel"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-background shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Swords className="h-3.5 w-3.5" /> Start a Duel
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/40"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/50">
            <nav className="container mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "text-foreground bg-primary/15" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}