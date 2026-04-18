"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = [
  "Prata",
  "925",
  "artesanal",
  "de",
  "coração",
  "para",
  "coração",
  "feita",
  "para",
  "quem",
  "se",
  "cuida.",
];

export default function HomeManifesto() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const p = 1 - r.top / window.innerHeight;
      setProgress(Math.max(0, Math.min(1.5, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="manifesto" ref={ref}>
      <div className="ag-container">
        <p className="manifesto-text">
          {WORDS.map((word, i) => {
            const start = (i / WORDS.length) * 0.9;
            const end = start + 0.15;
            const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
            const r = Math.round(15 + (1 - t) * 100);
            const g = Math.round(36 + (1 - t) * 80);
            const b = Math.round(68 + (1 - t) * 60);
            return (
              <span
                key={i}
                style={{
                  opacity: 0.15 + 0.85 * t,
                  color: `rgb(${r}, ${g}, ${b})`,
                  transition: "opacity 0.2s, color 0.2s",
                  display: "inline-block",
                  marginRight: "0.25em",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
