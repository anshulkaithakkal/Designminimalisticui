import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight, BookOpen, TrendingUp, Wand2, Clock } from "lucide-react";
import { SparkleOverlay, InlineSparkle } from "../components/Sparkles";

const SUBJECTS = [
  {
    id: "math",
    name: "Math AI HL",
    code: "Group 5",
    papers: 12,
    sessions: "2021 – 2025",
    color: "from-violet-50 to-violet-100/60",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-400",
    topics: ["Statistics", "Calculus", "Voronoi", "Paper 3"],
  },
  {
    id: "economics",
    name: "Economics HL",
    code: "Group 3",
    papers: 28,
    sessions: "2015 – 2025",
    color: "from-purple-50 to-purple-100/60",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-400",
    topics: ["Microeconomics", "Macroeconomics", "HL Extensions", "Paper 3"],
  },
  {
    id: "cs",
    name: "Computer Science SL",
    code: "Group 4",
    papers: 18,
    sessions: "2015 – 2025",
    color: "from-fuchsia-50 to-fuchsia-100/60",
    border: "border-fuchsia-200",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    dot: "bg-fuchsia-400",
    topics: ["Pseudocode", "OOP", "Data Structures", "Networking"],
  },
];

const RECENT_ACTIVITY = [
  { label: "Math AI HL — Paper 2 TZ1 2022", time: "Yesterday", tag: "Viewed" },
  { label: "Economics HL — Paper 3 2023", time: "2 days ago", tag: "Tutored" },
  { label: "CS SL — Paper 1 2021", time: "3 days ago", tag: "Generated" },
];

const STATS = [
  { label: "Total Papers", value: "58" },
  { label: "Sessions", value: "10" },
  { label: "Subjects", value: "3" },
  { label: "AI Walkthroughs", value: "—" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-violet-100 bg-white px-8 py-10">
        <SparkleOverlay count={6} />
        <p className="text-xs text-primary tracking-widest uppercase mb-2">IB Exam Prep</p>
        <h1
          className="text-5xl text-foreground mb-3"
          style={{ fontFamily: "var(--font-family-display)", fontWeight: 500, lineHeight: 1.15 }}
        >
          Welcome to{" "}
          <span className="shimmer-text">Caliber</span>
        </h1>
        <p className="text-muted-foreground max-w-md mb-6" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Your guided IB exam companion. Browse past papers, walk through solutions step-by-step
          with AI, and discover recurring exam patterns.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/papers")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-violet-200"
          >
            <BookOpen size={15} />
            Browse Papers
          </button>
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <Wand2 size={15} />
            Generate Practice
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-border rounded-xl px-5 py-4 text-center"
          >
            <p
              className="text-foreground mb-0.5"
              style={{ fontFamily: "var(--font-family-display)", fontSize: "1.9rem", fontWeight: 500 }}
            >
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subject cards */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-display)", fontSize: "1.4rem", fontWeight: 500 }}>
            Subjects
          </h2>
          <InlineSparkle size={12} delay={0.4} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {SUBJECTS.map((subj) => (
            <div
              key={subj.id}
              className={`relative rounded-2xl border ${subj.border} bg-gradient-to-br ${subj.color} p-5 cursor-pointer group hover:shadow-md hover:shadow-violet-100 transition-all duration-200`}
              onClick={() => navigate(`/papers?subject=${subj.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${subj.badge}`}>
                  {subj.code}
                </span>
                <span className={`w-2 h-2 rounded-full ${subj.dot}`} />
              </div>
              <h3 className="text-foreground mb-1" style={{ fontSize: "0.95rem" }}>
                {subj.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {subj.papers} papers &middot; {subj.sessions}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {subj.topics.map((t) => (
                  <span key={t} className="text-xs bg-white/70 text-foreground/60 px-2 py-0.5 rounded-full border border-white/80">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                <span>View papers</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2
          className="text-foreground mb-4"
          style={{ fontFamily: "var(--font-family-display)", fontSize: "1.4rem", fontWeight: 500 }}
        >
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/patterns")}
            className="flex items-center gap-4 bg-white border border-border rounded-xl px-5 py-4 hover:border-primary/30 hover:bg-muted/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground">Explore Patterns</p>
              <p className="text-xs text-muted-foreground mt-0.5">Find recurring exam topics</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => navigate("/tutor")}
            className="flex items-center gap-4 bg-white border border-border rounded-xl px-5 py-4 hover:border-primary/30 hover:bg-muted/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Wand2 size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground">AI Step Walker</p>
              <p className="text-xs text-muted-foreground mt-0.5">Walk through any question</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2
          className="text-foreground mb-4"
          style={{ fontFamily: "var(--font-family-display)", fontSize: "1.4rem", fontWeight: 500 }}
        >
          Recent Activity
        </h2>
        <div className="bg-white border border-border rounded-2xl divide-y divide-border">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Clock size={14} className="text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-foreground flex-1">{item.label}</p>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {item.tag}
              </span>
              <p className="text-xs text-muted-foreground hidden sm:block">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
