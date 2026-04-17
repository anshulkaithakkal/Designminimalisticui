import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp, Sparkles, Bot, User } from "lucide-react";
import { InlineSparkle } from "../components/Sparkles";

const DEMO_STEPS = [
  {
    title: "Read and Identify",
    body: "Begin by reading the question carefully. Identify the command term — here it is 'Calculate', which means you must obtain a numerical answer with workings shown.",
    ibNote: "IB M marks are awarded for correct method, even if arithmetic errors follow.",
    marks: "M1",
  },
  {
    title: "State the Formula",
    body: "Write down the relevant formula before substituting. For a Normal distribution N(μ, σ²), we standardise using Z = (X − μ) / σ.",
    ibNote: "Stating the formula explicitly earns the method mark, even with a GDC.",
    marks: "M1",
  },
  {
    title: "Substitute Values",
    body: "Substitute X = 72, μ = 65, σ = 8 into the formula: Z = (72 − 65) / 8 = 0.875.",
    ibNote: "Use GDC to find P(Z < 0.875) directly without further manual calculation.",
    marks: "A1",
  },
  {
    title: "Compute and State Answer",
    body: "P(X < 72) = P(Z < 0.875) ≈ 0.809. State the answer to 3 significant figures as required by IB convention.",
    ibNote: "Final A mark requires correct probability to 3 s.f. Do not express as percentage.",
    marks: "A1",
  },
];

const DEMO_MESSAGES = [
  {
    role: "assistant",
    text: "Hello, I am Caliber — your IB exam tutor. I can help you understand any step in the walkthrough. What would you like to explore?",
  },
];

interface Step {
  title: string;
  body: string;
  ibNote: string;
  marks: string;
}

interface Message {
  role: string;
  text: string;
}

function StepCard({ step, index, active }: { step: Step; index: number; active: boolean }) {
  const [expanded, setExpanded] = useState(active);
  useEffect(() => { setExpanded(active); }, [active]);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        active ? "border-primary/30 shadow-sm shadow-violet-50" : "border-border"
      } bg-white`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
            active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          {index + 1}
        </span>
        <span className="text-sm text-foreground flex-1">{step.title}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mr-2">
          {step.marks}
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">{step.body}</p>
          <div className="flex gap-2 items-start bg-secondary/50 rounded-lg px-3 py-2.5">
            <InlineSparkle size={10} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs text-secondary-foreground leading-relaxed">
              <span className="font-semibold">IB Note: </span>
              {step.ibNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tutor() {
  const [question, setQuestion] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartWalk = () => {
    if (!questionInput.trim()) return;
    setQuestion(questionInput);
    setStarted(true);
    setActiveStep(0);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: Message = { role: "user", text: chatInput };
    const aiMsg: Message = {
      role: "assistant",
      text: `That's a great question about Step ${activeStep + 1}. In IB marking, the key is to show your reasoning clearly. Remember: examiners follow your working line by line — if you state the method, you secure the M mark regardless of arithmetic slips.`,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Step Walker */}
      <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-white flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-primary" />
            <h3 className="text-foreground" style={{ fontSize: "0.95rem" }}>AI Step Walker</h3>
          </div>
          <p className="text-xs text-muted-foreground">Enter a question to receive a step-by-step IB walkthrough</p>
        </div>

        {!started ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5">
            <div className="w-full max-w-lg space-y-3">
              <label className="block text-sm text-foreground">
                Paste your question text
              </label>
              <textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                rows={5}
                placeholder="e.g. A factory produces items where the mass follows a Normal distribution with mean 65 g and standard deviation 8 g. Find the probability that a randomly selected item has a mass less than 72 g."
                className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
              <button
                onClick={handleStartWalk}
                className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles size={14} />
                Generate Walkthrough
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="bg-muted/50 rounded-xl px-4 py-3 mb-2">
              <p className="text-xs text-muted-foreground mb-1">Question</p>
              <p className="text-sm text-foreground leading-relaxed">{question}</p>
            </div>
            {DEMO_STEPS.map((step, i) => (
              <div key={i} onClick={() => setActiveStep(i)}>
                <StepCard step={step} index={i} active={i === activeStep} />
              </div>
            ))}
            <button
              onClick={() => {
                setStarted(false);
                setQuestion("");
                setQuestionInput("");
              }}
              className="w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Start new question
            </button>
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Bot size={12} className="text-white" />
            </div>
            <h3 className="text-foreground" style={{ fontSize: "0.9rem" }}>Caliber Tutor</h3>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-secondary" : "bg-primary"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={11} className="text-secondary-foreground" />
                ) : (
                  <Bot size={11} className="text-white" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Ask about any step..."
              className="flex-1 bg-muted rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
