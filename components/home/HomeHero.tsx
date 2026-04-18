"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function PhotoPlaceholder({
  label,
  tone = "sand",
}: {
  label: string;
  tone?: "sand" | "mist" | "deep";
}) {
  const bg = {
    sand: "repeating-linear-gradient(135deg, #e8dcc0 0 14px, #dccfb0 14px 28px)",
    mist: "repeating-linear-gradient(135deg, #bfd4e5 0 14px, #a8c4db 14px 28px)",
    deep: "repeating-linear-gradient(135deg, #3d6b9c 0 14px, #2f5882 14px 28px)",
  }[tone];
  const fg = tone === "deep" ? "#f4ebd8" : "#0f2444";
  return (
    <div
      className="photo-ph"
      style={{ background: bg, color: fg, fontFamily: "var(--sans)" }}
    >
      <span>{label}</span>
    </div>
  );
}

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const par = (depth: number) => ({
    transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)`,
  });

  return (
    <section className="hero" ref={ref}>
      <div className="ag-container hero-inner">
        {/* Copy */}
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-line-1">O brilho da <em>prata</em>,</span>
            <span className="hero-line-2">trazido até você.</span>
          </h1>
          <p className="hero-sub">
            Joias artesanais em prata 925 com atendimento VIP em domicílio.
            <br />
            Experimente com calma. Sem pressa. Sem compromisso.
          </p>
          <div className="hero-actions">
            <Link href="/catalogo" className="btn btn-primary">
              Ver catálogo <span className="arrow">→</span>
            </Link>
            <Link href="/contato" className="btn btn-ghost">
              Atendimento VIP
            </Link>
          </div>
        </div>

        {/* Photo variant parallax visual */}
        <div className="hero-visual">
          <div className="hero-pebble-lg pebble pebble-a" style={par(18)}>
            <PhotoPlaceholder label="Foto · tornozeleira" tone="deep" />
          </div>
          <div className="hero-pebble-md pebble pebble-b" style={par(28)}>
            <PhotoPlaceholder label="Foto · anel" tone="sand" />
          </div>
          <div className="hero-pebble-sm pebble pebble-c" style={par(38)}>
            <PhotoPlaceholder label="detalhe" tone="mist" />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>role para explorar</span>
      </div>
    </section>
  );
}
