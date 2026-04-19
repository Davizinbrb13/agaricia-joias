"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    kicker: "Escolha",
    title: "Navegue pelo catálogo",
    body: "Explore peças em prata 925 com calma. Separe favoritas para experimentar em casa, sem compromisso.",
  },
  {
    n: "02",
    kicker: "Agende",
    title: "Marcamos a visita",
    body: "Combinamos dia e horário que caibam na sua rotina. Casa, trabalho, evento, vamos até você.",
  },
  {
    n: "03",
    kicker: "Experimente",
    title: "Viva a prata em casa",
    body: "Abrimos o mostruário no seu espaço. Teste cada peça, veja na luz natural, sinta o peso. Sem pressa.",
  },
];

function ProcessArt({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="100" r="88" fill="none" stroke="var(--ink)" strokeWidth="0.5" opacity="0.3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * ((Math.PI * 2) / 12);
          return (
            <circle
              key={i}
              cx={100 + Math.cos(a) * 70}
              cy={100 + Math.sin(a) * 70}
              r="3"
              fill="var(--ink)"
              opacity={0.3 + (i % 3) * 0.2}
            />
          );
        })}
        <circle cx="100" cy="100" r="12" fill="var(--ink)" />
      </svg>
    );
  if (index === 1)
    return (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <path d="M 30 100 Q 100 40, 170 100" stroke="var(--ink)" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="3 4" />
        <circle cx="30" cy="100" r="6" fill="var(--ink)" />
        <circle cx="170" cy="100" r="6" fill="var(--ink)" />
        <circle cx="100" cy="64" r="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="100" y="140" textAnchor="middle" fontFamily="var(--serif)" fontSize="14" fontStyle="italic" fill="var(--tide)">
          até você
        </text>
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <g transform="translate(100 100)">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={-30 + i * 4}
            y={-60 + i * 6}
            width="60"
            height="8"
            rx="4"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="0.8"
            opacity={0.3 + i * 0.15}
            transform={`rotate(${i * 3})`}
          />
        ))}
        <circle cx="0" cy="20" r="18" fill="var(--sand-deep)" opacity="0.5" />
      </g>
    </svg>
  );
}

export default function HomeProcess() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const children = ref.current.querySelectorAll(".process-step");
      const mid = window.innerHeight * 0.5;
      let best = 0,
        bestDist = Infinity;
      children.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="process" ref={ref}>
      <div className="process-inner ag-container">
        <aside className="process-aside">
          <span className="eyebrow">Como funciona</span>
          <h2 className="process-h">
            Um atendimento
            <br />
            <em>feito à mão.</em>
          </h2>
          <p className="process-desc">
            Três passos simples para levar a prata até você, exatamente onde estiver.
          </p>
          <div className="process-indicator">
            {STEPS.map((_, i) => (
              <span key={i} className={`ind ${i === active ? "on" : ""}`} />
            ))}
          </div>
        </aside>

        <div className="process-steps">
          {STEPS.map((step, i) => (
            <article key={i} className={`process-step ${i === active ? "active" : ""}`}>
              <div className="process-step-num">{step.n}</div>
              <div className="process-step-body">
                <span className="process-step-kick">{step.kicker}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <div className="process-step-art">
                <ProcessArt index={i} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
