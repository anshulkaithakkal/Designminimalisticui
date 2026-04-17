import React, { useState } from "react";
import { Wand2, Eye, EyeOff, RotateCcw } from "lucide-react";
import { InlineSparkle } from "../components/Sparkles";

const TOPIC_MAP: Record<string, string[]> = {
  math: ["Statistics & Probability", "Normal Distribution", "Regression", "Chi-squared Test", "Voronoi Diagrams", "Compound Interest", "Calculus", "Euler's Method (P3)"],
  economics: ["Supply & Demand", "PED & Revenue", "AD/AS Model", "Multiplier Effect", "Exchange Rates", "Development Indicators", "Market Structures", "Fiscal Policy"],
  cs: ["Pseudocode", "Binary Search", "OOP & Inheritance", "Linked Lists", "Sorting Algorithms", "Networking (OSI)", "Data Representation", "System Reliability"],
};

const SUBJECTS = [
  { id: "math", label: "Math AI HL" },
  { id: "economics", label: "Economics HL" },
  { id: "cs", label: "CS SL" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", desc: "4–6 marks, direct", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id: "medium", label: "Medium", desc: "8–12 marks, multi-part", badge: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "hard", label: "Hard", desc: "15–20 marks, Paper 3 style", badge: "bg-rose-50 text-rose-600 border-rose-100" },
];

const MOCK_QUESTION = {
  math: {
    easy: {
      question: "The heights of students in a school are normally distributed with mean μ = 168 cm and standard deviation σ = 9 cm.\n\n(a) Find the probability that a randomly selected student has a height greater than 175 cm. [3 marks]\n\n(b) Find the height that is exceeded by 20% of students. [2 marks]",
      answer: "(a) P(X > 175) = P(Z > (175 − 168)/9) = P(Z > 0.778)\n    Using GDC: P(X > 175) = 0.218 (3 s.f.)\n    [M1 for standardising, A1 for correct z-value, A1 for final answer]\n\n(b) We need P(X > k) = 0.20, so P(X < k) = 0.80\n    Using inverse Normal: k = μ + z·σ = 168 + (0.842)(9) = 175.6 cm (4 s.f.)\n    [M1 for correct setup, A1 for final answer]",
    },
  },
  economics: {
    medium: {
      question: "The government of Country A imposes a specific tax of $4 per unit on the production of cigarettes.\n\n(a) Using a supply and demand diagram, explain the effects of this tax on the market for cigarettes. [4 marks]\n\n(b) The price elasticity of demand for cigarettes is −0.3. Calculate the percentage change in quantity demanded if price rises by 10%. [2 marks]\n\n(c) Discuss the effectiveness of this tax as a strategy to reduce cigarette consumption and raise government revenue. [6 marks]",
      answer: "(a) A specific tax shifts supply curve upward by $4. At new equilibrium, price paid by consumers rises and price received by producers falls. Quantity falls. Show tax incidence: CS falls, PS falls, tax revenue = shaded rectangle.\n[2 marks for correctly drawn diagram, 2 marks for explanation with relevant economic analysis]\n\n(b) %ΔQd = PED × %ΔP = (−0.3)(10%) = −3%\nQuantity demanded falls by 3%.\n[M1 for formula, A1 for answer]\n\n(c) Arguments for effectiveness: raises revenue (inelastic demand → large revenue), creates negative consumption externality correction, signals social disapproval.\nArguments against: addictive nature reduces price sensitivity, may increase illegal trade, regressive — disproportionate burden on lower-income consumers.\nConclusion: moderately effective for revenue, limited for reducing consumption given low PED.\n[Mark as 3 marks for each side, 2 for evaluation/synthesis]",
    },
  },
  cs: {
    medium: {
      question: "A library system stores books as objects. Each Book object has the attributes: title (string), author (string), ISBN (string), and isAvailable (boolean).\n\n(a) Construct a class diagram for the Book class, including all attributes with their data types and an appropriate constructor and methods. [4 marks]\n\n(b) Write pseudocode for a method searchByAuthor(author) that searches an array BOOKS of Book objects and outputs the titles of all books by that author. [4 marks]\n\n(c) State one advantage of using object-oriented programming for this library system. [1 mark]",
      answer: "(a) Class diagram:\n    ┌─────────────────────────────┐\n    │           Book              │\n    ├─────────────────────────────┤\n    │ - title : String            │\n    │ - author : String           │\n    │ - ISBN : String             │\n    │ - isAvailable : Boolean     │\n    ├─────────────────────────────┤\n    │ + Book(t, a, i, avail)      │\n    │ + getTitle() : String       │\n    │ + getAuthor() : String      │\n    │ + setAvailable(b : Boolean) │\n    └─────────────────────────────┘\n[2 marks for attributes with types, 2 marks for appropriate methods]\n\n(b) IB Pseudocode:\n    METHOD searchByAuthor(author)\n        LOOP I FROM 0 TO BOOKS.length - 1\n            IF BOOKS[I].getAuthor() == author THEN\n                OUTPUT BOOKS[I].getTitle()\n            END IF\n        END LOOP\n    END METHOD\n[M1 correct loop structure, M1 correct condition, A1 correct output, A1 correct syntax]\n\n(c) Encapsulation allows each Book's data to be bundled with its methods, reducing errors and making the system easier to maintain / extend.",
    },
  },
};

export default function Generate() {
  const [subject, setSubject] = useState("math");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const topics = TOPIC_MAP[subject] ?? [];

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleGenerate = () => {
    setLoading(true);
    setShowAnswer(false);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
    }, 1400);
  };

  const handleReset = () => {
    setGenerated(false);
    setShowAnswer(false);
  };

  const mockData =
    (MOCK_QUESTION as any)[subject]?.[difficulty] ??
    (MOCK_QUESTION as any)["math"]["easy"];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1
            className="text-foreground"
            style={{ fontFamily: "var(--font-family-display)", fontSize: "1.8rem", fontWeight: 500 }}
          >
            Practice Generator
          </h1>
          <InlineSparkle size={14} delay={0.2} />
        </div>
        <p className="text-sm text-muted-foreground">
          AI-generated IB-style questions with model answers.
        </p>
      </div>

      {!generated ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Config */}
          <div className="space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-2">Subject</label>
              <div className="flex flex-col gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSubject(s.id);
                      setSelectedTopics([]);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all ${
                      subject === s.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white border border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-2">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`flex-1 px-3 py-2.5 rounded-xl text-xs transition-all border ${
                      difficulty === d.id
                        ? "bg-primary text-white border-primary shadow-sm"
                        : `bg-white ${d.badge} hover:opacity-80`
                    }`}
                  >
                    <p className="font-semibold">{d.label}</p>
                    <p className="opacity-70 mt-0.5" style={{ fontSize: "0.68rem" }}>{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-2">
              Topics{" "}
              <span className="normal-case text-muted-foreground">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedTopics.includes(t)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="md:col-span-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  Generate Question
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Generated question */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {SUBJECTS.find((s) => s.id === subject)?.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      DIFFICULTIES.find((d) => d.id === difficulty)?.badge
                    }`}
                  >
                    {DIFFICULTIES.find((d) => d.id === difficulty)?.label}
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw size={12} />
                New question
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Question</p>
              <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                {mockData.question}
              </pre>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs hover:bg-secondary/80 transition-colors"
              >
                {showAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
                {showAnswer ? "Hide model answer" : "Reveal model answer"}
              </button>

              {showAnswer && (
                <div className="mt-4 bg-muted/60 rounded-xl px-4 py-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Model Answer</p>
                  <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                    {mockData.answer}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {/* navigate to tutor */}}
            className="flex items-center gap-2 text-xs text-primary hover:underline"
          >
            Open in Tutor for guided walkthrough
          </button>
        </div>
      )}
    </div>
  );
}
