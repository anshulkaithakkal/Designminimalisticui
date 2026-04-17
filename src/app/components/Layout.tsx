import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Wand2,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { InlineSparkle } from "./Sparkles";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/papers", label: "Papers", icon: BookOpen },
  { to: "/tutor", label: "AI Tutor", icon: Brain },
  { to: "/patterns", label: "Patterns", icon: TrendingUp },
  { to: "/generate", label: "Generate", icon: Wand2 },
];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Math AI HL": { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-400" },
  "Economics HL": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-400" },
  "CS SL": { bg: "bg-fuchsia-100", text: "text-fuchsia-700", dot: "bg-fuchsia-400" },
};

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = NAV_ITEMS.find((n) =>
    n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to) && n.to !== "/"
  )?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-border flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-violet-200">
              <span
                style={{ fontFamily: "var(--font-family-display)", fontWeight: 600 }}
                className="text-white text-sm"
              >
                C
              </span>
            </div>
          </div>
          <span
            style={{ fontFamily: "var(--font-family-display)", fontWeight: 600 }}
            className="text-lg text-foreground tracking-tight"
          >
            Caliber
          </span>
          <InlineSparkle size={10} className="ml-auto opacity-70" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
                  ${
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-violet-200"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Subjects Legend */}
        <div className="px-4 pb-4 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider px-1">Subjects</p>
          {Object.entries(SUBJECT_COLORS).map(([subj, c]) => (
            <div key={subj} className="flex items-center gap-2 px-1 py-1">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              <span className="text-xs text-foreground/70">{subj}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-sm border-b border-border flex items-center gap-4 px-6 flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} className="text-foreground" />
          </button>
          <h2 className="text-base text-foreground/60" style={{ fontFamily: "var(--font-family)", fontWeight: 500 }}>
            {pageTitle}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-semibold">
              IB
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
