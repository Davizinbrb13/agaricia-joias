"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    kicker: "Escolha",
    title: "Explore as peças",
    body: "Navegue pelo catálogo e separe as peças que chamaram sua atenção. Anéis, colares, brincos, pulseiras em prata 925 e folheado a ouro.",
  },
  {
    n: "02",
    kicker: "Agende",
    title: "Me chame no WhatsApp",
    body: "Combinamos o melhor dia e horário pra você. Sua casa, seu trabalho, o encontro com as amigas, o chá de panela da vizinha. Eu me adapto.",
  },
  {
    n: "03",
    kicker: "Experimente",
    title: "Experimente sem pressa",
    body: "Abro o mostruário no seu espaço. Você prova cada peça na luz natural, sente o peso, combina com o look. Sem pressa de vendedora, sem compromisso nenhum.",
  },
];

function ProcessArt({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="100" r="88" fill="var(--sand-deep)" opacity="0.3" />
        <g transform="translate(100 100)" stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Diamond */}
          <path d="M-20 -30 L20 -30 L40 -10 L-40 -10 Z" />
          <path d="M-40 -10 L0 45 L40 -10" />
          <path d="M-20 -30 L0 45 M20 -30 L0 45" opacity="0.4" />
          <path d="M0 -30 L0 -10" opacity="0.4" />
          {/* Sparkles */}
          <path d="M -40 -40 L -45 -55 M -35 -45 L -20 -50" strokeWidth="1.5" opacity="0.5" />
          <path d="M 35 -20 L 40 -30 M 30 -25 L 45 -25" strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>
    );
  if (index === 1)
    return (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="100" r="88" fill="var(--sand-deep)" opacity="0.3" />
        <g transform="translate(100 100)" stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Chat Bubble */}
          <rect x="-35" y="-25" width="70" height="50" rx="15" />
          <path d="M -15 25 L -25 40 L -5 25" fill="var(--ink)" opacity="0.2" />
          {/* Dots */}
          <circle cx="-15" cy="0" r="2" fill="var(--ink)" stroke="none" />
          <circle cx="0" cy="0" r="2" fill="var(--ink)" stroke="none" />
          <circle cx="15" cy="0" r="2" fill="var(--ink)" stroke="none" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      <circle cx="100" cy="100" r="88" fill="var(--sand-deep)" opacity="0.3" />
      <g transform="translate(100 100)" stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Hand Mirror rotated slightly */}
        <g transform="rotate(15)">
          {/* Handle */}
          <rect x="-6" y="30" width="12" height="35" rx="3" />
          {/* Mirror Frame */}
          <ellipse cx="0" cy="-10" rx="25" ry="35" />
          <ellipse cx="0" cy="-10" rx="20" ry="30" opacity="0.4" />
          {/* Reflection lines */}
          <line x1="-8" y1="-25" x2="8" y2="-5" opacity="0.3" />
          <line x1="-3" y1="-30" x2="13" y2="-10" opacity="0.3" />
        </g>
        {/* Sparkles */}
        <path d="M -30 -20 L -35 -30 M -25 -25 L -40 -25" strokeWidth="1.5" opacity="0.5" />
        <path d="M 30 10 L 35 20 M 25 15 L 40 15" strokeWidth="1.5" opacity="0.5" />
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
            Do catálogo
            <br />
            <em>à sua sala.</em>
          </h2>
          <p className="process-desc">
            Simples assim: você escolhe, a gente aparece, você experimenta com calma.
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
