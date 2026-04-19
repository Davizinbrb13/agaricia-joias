"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Image from "next/image";


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
            <Image src="/Captura de tela_12-11-2025_212846_www.instagram.com.jpg" alt="Foto Tornozeleira" fill style={{ objectFit: "cover" }} />
          </div>
          <div className="hero-pebble-md pebble pebble-b" style={par(28)}>
            <Image src="/Captura de tela_12-11-2025_212727_www.instagram.com.jpg" alt="Foto Anel" fill style={{ objectFit: "cover" }} />
          </div>
          <div className="hero-pebble-sm pebble pebble-c" style={par(38)}>
            <Image src="/Captura de tela_12-11-2025_21286_www.instagram.com.jpg" alt="Foto Detalhe" fill style={{ objectFit: "cover" }} />
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
