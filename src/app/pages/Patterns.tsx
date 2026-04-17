import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

const SUBJECTS = [
  { id: "math", label: "Math AI HL" },
  { id: "economics", label: "Economics HL" },
  { id: "cs", label: "CS SL" },
];

const HEATMAP_DATA: Record<string, { topic: string; years: Record<number, number> }[]> = {
  math: [
    { topic: "Normal Distribution", years: { 2021: 3, 2022: 4, 2023: 2, 2024: 3, 2025: 4 } },
    { topic: "Chi-squared Test", years: { 2021: 2, 2022: 2, 2023: 3, 2024: 2, 2025: 3 } },
    { topic: "Regression & Correlation", years: { 2021: 4, 2022: 3, 2023: 4, 2024: 4, 2025: 3 } },
    { topic: "Voronoi Diagrams", years: { 2021: 1, 2022: 2, 2023: 1, 2024: 2, 2025: 2 } },
    { topic: "Compound Interest", years: { 2021: 2, 2022: 3, 2023: 3, 2024: 2, 2025: 3 } },
    { topic: "Euler's Method (P3)", years: { 2021: 1, 2022: 1, 2023: 2, 2024: 1, 2025: 2 } },
  ],
  economics: [
    { topic: "Supply & Demand Shifts", years: { 2021: 5, 2022: 5, 2023: 4, 2024: 5, 2025: 5 } },
    { topic: "PED Calculation", years: { 2021: 3, 2022: 4, 2023: 3, 2024: 3, 2025: 4 } },
    { topic: "AD/AS Diagrams", years: { 2021: 4, 2022: 3, 2023: 4, 2024: 4, 2025: 3 } },
    { topic: "Multiplier (HL P3)", years: { 2021: 2, 2022: 3, 2023: 2, 2024: 3, 2025: 3 } },
    { topic: "Exchange Rate Effects", years: { 2021: 2, 2022: 2, 2023: 3, 2024: 2, 2025: 3 } },
    { topic: "HDI & Development", years: { 2021: 1, 2022: 2, 2023: 2, 2024: 1, 2025: 2 } },
  ],
  cs: [
    { topic: "Binary Search Trace", years: { 2021: 3, 2022: 3, 2023: 2, 2024: 3, 2025: 3 } },
    { topic: "Pseudocode Writing", years: { 2021: 5, 2022: 5, 2023: 5, 2024: 5, 2025: 5 } },
    { topic: "OOP & Inheritance", years: { 2021: 3, 2022: 4, 2023: 3, 2024: 3, 2025: 4 } },
    { topic: "Linked List Operations", years: { 2021: 2, 2022: 2, 2023: 3, 2024: 2, 2025: 2 } },
    { topic: "OSI / TCP-IP Layers", years: { 2021: 2, 2022: 2, 2023: 2, 2024: 3, 2025: 2 } },
  ],
};

const PATTERNS: Record<string, { name: string; topic: string; freq: number; years: string; commandTerms: string[]; markRange: string; desc: string }[]> = {
  math: [
    { name: "Normal Distribution + Inverse", topic: "Statistics", freq: 17, years: "2021–2025", commandTerms: ["Calculate", "Find"], markRange: "4–8 marks", desc: "Normal distribution questions consistently appear on Paper 2. Students must find P(X < k), inverse normal, or combined probabilities. GDC use is mandatory." },
    { name: "Regression Coefficient Interpretation", topic: "Statistics", freq: 18, years: "2021–2025", commandTerms: ["Interpret", "Comment"], markRange: "2–4 marks", desc: "Questions ask to state the meaning of r or the regression coefficient in context. Always use context-specific language, avoid pure math terms." },
    { name: "Voronoi Perpendicular Bisector", topic: "Geometry", freq: 8, years: "2021–2025", commandTerms: ["Find", "Sketch"], markRange: "6–10 marks", desc: "Voronoi diagram construction appears in nearly every session. Requires midpoint, gradient, and perpendicular bisector equations." },
  ],
  economics: [
    { name: "Supply/Demand Shifts + Welfare", topic: "Microeconomics", freq: 24, years: "2015–2025", commandTerms: ["Explain", "Discuss", "Evaluate"], markRange: "4–15 marks", desc: "The core micro diagram question. Must include shift with arrows, new equilibrium, consumer/producer surplus changes, and dead-weight loss where applicable." },
    { name: "PED Calculation + Revenue", topic: "Microeconomics", freq: 16, years: "2015–2025", commandTerms: ["Calculate", "Explain"], markRange: "4–6 marks", desc: "Calculate PED using the formula, then interpret whether revenue rises or falls. Elastic → inverse revenue relationship, inelastic → direct." },
    { name: "AD/AS with Macro Objectives", topic: "Macroeconomics", freq: 19, years: "2015–2025", commandTerms: ["Explain", "Discuss"], markRange: "8–15 marks", desc: "Shift AD or AS with the relevant shock, then evaluate impact on inflation, output, and unemployment using Phillips Curve where relevant." },
  ],
  cs: [
    { name: "Pseudocode Loops & Conditionals", topic: "Programming", freq: 22, years: "2015–2025", commandTerms: ["Write", "Construct"], markRange: "4–8 marks", desc: "IB pseudocode syntax: WHILE/LOOP, IF/THEN/ELSE, OUTPUT, NEXT. Do not use Python or Java syntax — examiners strictly penalise language-specific code." },
    { name: "Binary Search Trace Table", topic: "Algorithms", freq: 14, years: "2015–2025", commandTerms: ["Trace", "State"], markRange: "4–6 marks", desc: "Must show low, mid, high columns for each iteration. Circle or highlight the found element. Describe the termination condition." },
    { name: "OOP Class Design with UML", topic: "OOP", freq: 16, years: "2015–2025", commandTerms: ["Construct", "Describe"], markRange: "6–10 marks", desc: "Draw UML class diagrams with attributes (type + name) and methods. Show inheritance with hollow arrowhead. Describe access modifiers." },
  ],
};

const YEARS = [2021, 2022, 2023, 2024, 2025];

function intensityClass(val: number): string {
  if (val >= 5) return "bg-primary text-white";
  if (val >= 4) return "bg-primary/70 text-white";
  if (val >= 3) return "bg-primary/45 text-primary";
  if (val >= 2) return "bg-primary/20 text-primary";
  return "bg-primary/8 text-muted-foreground";
}

function PatternCard({ p }: { p: typeof PATTERNS.math[0] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-foreground">{p.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {p.topic}
            </span>
            <span className="text-xs text-muted-foreground">
              {p.freq}x &middot; {p.years} &middot; {p.markRange}
            </span>
          </div>
        </div>
        {open ? <ChevronUp size={14} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-xs text-foreground/80 leading-relaxed">{p.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {p.commandTerms.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 bg-muted text-foreground/60 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigate("/papers")}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink size={11} />
              See example papers
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => navigate("/generate")}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              Generate practice question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Patterns() {
  const [activeSubject, setActiveSubject] = useState("math");
  const heatmap = HEATMAP_DATA[activeSubject] ?? [];
  const patterns = PATTERNS[activeSubject] ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-foreground mb-1"
          style={{ fontFamily: "var(--font-family-display)", fontSize: "1.8rem", fontWeight: 500 }}
        >
          Exam Patterns
        </h1>
        <p className="text-sm text-muted-foreground">Topics that recur across sessions — ranked by frequency.</p>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSubject(s.id)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              activeSubject === s.id
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm text-foreground">Topic Frequency Heatmap</p>
          <p className="text-xs text-muted-foreground mt-0.5">Frequency of appearance per session year</p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-muted-foreground font-medium pb-3 pr-4 min-w-[160px]">Topic</th>
                {YEARS.map((y) => (
                  <th key={y} className="text-center text-muted-foreground font-medium pb-3 px-2">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {heatmap.map((row) => (
                <tr key={row.topic}>
                  <td className="pr-4 py-1.5 text-foreground/70">{row.topic}</td>
                  {YEARS.map((y) => {
                    const val = row.years[y] ?? 0;
                    return (
                      <td key={y} className="px-2 py-1.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold ${intensityClass(val)}`}
                        >
                          {val > 0 ? val : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4 flex items-center gap-3">
          <p className="text-xs text-muted-foreground mr-1">Frequency:</p>
          {[
            { label: "Low", cls: "bg-primary/8" },
            { label: "Med", cls: "bg-primary/25" },
            { label: "High", cls: "bg-primary/55" },
            { label: "Very High", cls: "bg-primary" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-4 h-4 rounded ${l.cls}`} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern cards */}
      <div>
        <p className="text-sm text-foreground mb-3">Top Patterns</p>
        <div className="space-y-2.5">
          {patterns.map((p) => (
            <PatternCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
