import React from "react";
import { useParams, useNavigate } from "react-router";
import { Brain, ExternalLink, ArrowLeft, FileText } from "lucide-react";

const MOCK_PAPERS: Record<string, { id: number; displayName: string; subject: string; subjectLabel: string; year: number; session: string; tz: string | null; paper: number; markschemeId: number | null }> = {
  "1": { id: 1, displayName: "Math AI HL — Paper 1 TZ1 May 2022", subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ1", paper: 1, markschemeId: 2 },
  "3": { id: 3, displayName: "Math AI HL — Paper 2 TZ1 May 2022", subject: "math", subjectLabel: "Math AI HL", year: 2022, session: "May", tz: "TZ1", paper: 2, markschemeId: null },
  "8": { id: 8, displayName: "Economics HL — Paper 1 May 2023", subject: "economics", subjectLabel: "Economics HL", year: 2023, session: "May", tz: null, paper: 1, markschemeId: null },
};

const SUBJECT_BADGE: Record<string, string> = {
  math: "bg-violet-100 text-violet-700",
  economics: "bg-purple-100 text-purple-700",
  cs: "bg-fuchsia-100 text-fuchsia-700",
};

export default function PaperDetail() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const paper = paperId ? MOCK_PAPERS[paperId] : null;

  if (!paper) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FileText size={32} className="text-muted-foreground mb-3" />
        <p className="text-sm text-foreground mb-1">Paper not found</p>
        <p className="text-xs text-muted-foreground mb-4">This paper may not be in the demo database.</p>
        <button onClick={() => navigate("/papers")} className="text-xs text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={12} />
          Back to Papers
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* PDF Viewer area */}
      <div className="flex-1 bg-muted/50 flex flex-col overflow-hidden">
        <div className="px-5 py-3 bg-white border-b border-border flex items-center gap-3">
          <button onClick={() => navigate("/papers")} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft size={15} className="text-muted-foreground" />
          </button>
          <p className="text-sm text-foreground truncate flex-1">{paper.displayName}</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-xs">
            <div className="w-16 h-20 mx-auto mb-4 rounded-xl bg-white border-2 border-dashed border-primary/20 flex items-center justify-center">
              <FileText size={24} className="text-primary/40" />
            </div>
            <p className="text-sm text-foreground mb-1">PDF Viewer</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In the full implementation, the PDF will render here via react-pdf / PDF.js with page navigation and zoom controls.
            </p>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-l border-border flex flex-col overflow-y-auto p-5 gap-5">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Paper Details</p>
          <div className="space-y-2.5">
            {[
              { label: "Subject", val: paper.subjectLabel },
              { label: "Year", val: String(paper.year) },
              { label: "Session", val: paper.session },
              { label: "Paper", val: `Paper ${paper.paper}` },
              ...(paper.tz ? [{ label: "Timezone", val: paper.tz }] : []),
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${SUBJECT_BADGE[paper.subject] ?? "bg-muted text-foreground"}`}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate(`/tutor/${paper.id}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Brain size={14} />
            Open in AI Tutor
          </button>
          {paper.markschemeId && (
            <button
              onClick={() => navigate(`/papers/${paper.markschemeId}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink size={14} />
              View Markscheme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
