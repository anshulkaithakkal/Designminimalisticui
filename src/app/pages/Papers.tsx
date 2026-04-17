import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Filter, Eye, BookMarked, Search } from "lucide-react";

const ALL_PAPERS = [
  { id: 1, subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ1", paper: 1, isMarkscheme: false, displayName: "Math AI HL — Paper 1 TZ1 May 2022" },
  { id: 2, subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ1", paper: 1, isMarkscheme: true, displayName: "Math AI HL — Paper 1 TZ1 May 2022 MS" },
  { id: 3, subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ1", paper: 2, isMarkscheme: false, displayName: "Math AI HL — Paper 2 TZ1 May 2022" },
  { id: 4, subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ2", paper: 1, isMarkscheme: false, displayName: "Math AI HL — Paper 1 TZ2 May 2022" },
  { id: 5, subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "November", tz: "TZ0", paper: 1, isMarkscheme: false, displayName: "Math AI HL — Paper 1 TZ0 Nov 2022" },
  { id: 6, subject: "math", subjectLabel: "Math AI HL", year: 2021, session: "May", tz: "TZ1", paper: 1, isMarkscheme: false, displayName: "Math AI HL — Paper 1 TZ1 May 2021" },
  { id: 7, subject: "math", subjectLabel: "Math AI HL", year: 2025, session: "May", tz: "TZ1", paper: 1, isMarkscheme: false, displayName: "Math AI HL — Paper 1 TZ1 May 2025" },
  { id: 8, subject: "economics", subjectLabel: "Economics HL", year: 2023, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "Economics HL — Paper 1 May 2023" },
  { id: 9, subject: "economics", subjectLabel: "Economics HL", year: 2023, session: "May", tz: null, paper: 2, isMarkscheme: false, displayName: "Economics HL — Paper 2 May 2023" },
  { id: 10, subject: "economics", subjectLabel: "Economics HL", year: 2023, session: "May", tz: null, paper: 3, isMarkscheme: false, displayName: "Economics HL — Paper 3 May 2023" },
  { id: 11, subject: "economics", subjectLabel: "Economics HL", year: 2022, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "Economics HL — Paper 1 May 2022" },
  { id: 12, subject: "economics", subjectLabel: "Economics HL", year: 2021, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "Economics HL — Paper 1 May 2021" },
  { id: 13, subject: "economics", subjectLabel: "Economics HL", year: 2019, session: "May", tz: "TZ1", paper: 1, isMarkscheme: false, displayName: "Economics HL — Paper 1 TZ1 May 2019" },
  { id: 14, subject: "cs", subjectLabel: "CS SL", year: 2022, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "CS SL — Paper 1 May 2022" },
  { id: 15, subject: "cs", subjectLabel: "CS SL", year: 2022, session: "May", tz: null, paper: 2, isMarkscheme: false, displayName: "CS SL — Paper 2 May 2022" },
  { id: 16, subject: "cs", subjectLabel: "CS SL", year: 2021, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "CS SL — Paper 1 May 2021" },
  { id: 17, subject: "cs", subjectLabel: "CS SL", year: 2020, session: "November", tz: null, paper: 1, isMarkscheme: false, displayName: "CS SL — Paper 1 Nov 2020" },
  { id: 18, subject: "cs", subjectLabel: "CS SL", year: 2019, session: "May", tz: null, paper: 1, isMarkscheme: false, displayName: "CS SL — Paper 1 May 2019" },
];

const SUBJECT_STYLES: Record<string, { badge: string; dot: string }> = {
  math: { badge: "bg-violet-100 text-violet-700", dot: "bg-violet-400" },
  economics: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  cs: { badge: "bg-fuchsia-100 text-fuchsia-700", dot: "bg-fuchsia-400" },
};

export default function Papers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState<string[]>([]);
  const [filterSession, setFilterSession] = useState<string[]>([]);
  const [filterPaper, setFilterPaper] = useState<string[]>([]);
  const [showMarkscheme, setShowMarkscheme] = useState(true);
  const [yearFrom, setYearFrom] = useState(2015);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const filtered = ALL_PAPERS.filter((p) => {
    if (!showMarkscheme && p.isMarkscheme) return false;
    if (filterSubject.length && !filterSubject.includes(p.subject)) return false;
    if (filterSession.length && !filterSession.includes(p.session)) return false;
    if (filterPaper.length && !filterPaper.includes(String(p.paper))) return false;
    if (p.year < yearFrom) return false;
    if (search && !p.displayName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full">
      {/* Sidebar filter */}
      <div className="w-56 flex-shrink-0 border-r border-border bg-white p-5 space-y-5 overflow-y-auto hidden md:block">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-primary" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Filters</p>
        </div>

        <div>
          <label className="text-xs text-foreground/60 uppercase tracking-wider block mb-2">Subject</label>
          <div className="flex flex-col gap-1.5">
            {[
              { val: "math", label: "Math AI HL" },
              { val: "economics", label: "Economics HL" },
              { val: "cs", label: "CS SL" },
            ].map((s) => (
              <FilterChip
                key={s.val}
                label={s.label}
                active={filterSubject.includes(s.val)}
                onClick={() => toggle(filterSubject, setFilterSubject, s.val)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-foreground/60 uppercase tracking-wider block mb-2">Session</label>
          <div className="flex flex-col gap-1.5">
            {["May", "November"].map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={filterSession.includes(s)}
                onClick={() => toggle(filterSession, setFilterSession, s)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-foreground/60 uppercase tracking-wider block mb-2">Paper</label>
          <div className="flex gap-1.5 flex-wrap">
            {["1", "2", "3"].map((p) => (
              <FilterChip
                key={p}
                label={`P${p}`}
                active={filterPaper.includes(p)}
                onClick={() => toggle(filterPaper, setFilterPaper, p)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-foreground/60 uppercase tracking-wider block mb-2">
            From year: {yearFrom}
          </label>
          <input
            type="range"
            min={2015}
            max={2025}
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMarkscheme}
              onChange={(e) => setShowMarkscheme(e.target.checked)}
              className="accent-primary w-3.5 h-3.5"
            />
            <span className="text-xs text-foreground/70">Show markschemes</span>
          </label>
        </div>

        <button
          onClick={() => {
            setFilterSubject([]);
            setFilterSession([]);
            setFilterPaper([]);
            setYearFrom(2015);
            setShowMarkscheme(true);
            setSearch("");
          }}
          className="text-xs text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} papers found</p>

        <div className="grid gap-3">
          {filtered.map((paper) => {
            const style = SUBJECT_STYLES[paper.subject];
            return (
              <div
                key={paper.id}
                className="bg-white border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm hover:shadow-violet-50 transition-all group"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{paper.displayName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
                      {paper.subjectLabel}
                    </span>
                    {paper.isMarkscheme && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                        Markscheme
                      </span>
                    )}
                    {paper.tz && (
                      <span className="text-xs text-muted-foreground">{paper.tz}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/papers/${paper.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground/70 rounded-lg hover:bg-secondary hover:text-primary text-xs transition-all"
                  >
                    <Eye size={12} />
                    View
                  </button>
                  {!paper.isMarkscheme && (
                    <button
                      onClick={() => navigate(`/tutor/${paper.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white text-xs transition-all"
                    >
                      <BookMarked size={12} />
                      Tutor
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">No papers match your filters.</p>
              <p className="text-xs mt-1">Try adjusting or clearing your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
