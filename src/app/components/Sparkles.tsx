import React from "react";

interface SparkleProps {
  count?: number;
  className?: string;
}

const SPARKLE_CONFIGS = [
  { top: "8%", left: "5%", size: 6, duration: 2.4, delay: 0 },
  { top: "12%", left: "92%", size: 8, duration: 3.1, delay: 0.5 },
  { top: "35%", left: "96%", size: 5, duration: 2.8, delay: 1.2 },
  { top: "60%", left: "3%", size: 7, duration: 3.5, delay: 0.8 },
  { top: "75%", left: "90%", size: 6, duration: 2.2, delay: 1.7 },
  { top: "88%", left: "15%", size: 5, duration: 3.0, delay: 0.3 },
  { top: "20%", left: "48%", size: 4, duration: 2.6, delay: 1.0 },
  { top: "50%", left: "88%", size: 8, duration: 2.9, delay: 2.1 },
];

function StarShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
        fill="currentColor"
      />
      <path
        d="M19 2L19.8 5.2L23 6L19.8 6.8L19 10L18.2 6.8L15 6L18.2 5.2L19 2Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function DiamondDot({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  );
}

export function SparkleOverlay({ count = 8, className = "" }: SparkleProps) {
  const configs = SPARKLE_CONFIGS.slice(0, count);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {configs.map((c, i) => (
        <span
          key={i}
          className="sparkle absolute text-violet-300"
          style={{
            top: c.top,
            left: c.left,
            "--duration": `${c.duration}s`,
            "--delay": `${c.delay}s`,
          } as React.CSSProperties}
        >
          {i % 3 === 0 ? (
            <StarShape size={c.size} />
          ) : (
            <DiamondDot size={c.size - 1} />
          )}
        </span>
      ))}
    </div>
  );
}

export function InlineSparkle({ size = 14, className = "", delay = 0 }: { size?: number; className?: string; delay?: number }) {
  return (
    <span
      className={`inline-block sparkle-drift text-violet-400 ${className}`}
      style={{ "--duration": "2.5s", "--delay": `${delay}s` } as React.CSSProperties}
    >
      <StarShape size={size} />
    </span>
  );
}
