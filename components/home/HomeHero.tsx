"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import Image from "next/image";


export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const pebbleLgRef = useRef<HTMLDivElement>(null);
  const pebbleMdRef = useRef<HTMLDivElement>(null);
  const pebbleSmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      if (pebbleLgRef.current)
        pebbleLgRef.current.style.transform = `translate3d(${x * 18}px, ${y * 18}px, 0)`;
      if (pebbleMdRef.current)
        pebbleMdRef.current.style.transform = `translate3d(${x * 28}px, ${y * 28}px, 0)`;
      if (pebbleSmRef.current)
        pebbleSmRef.current.style.transform = `translate3d(${x * 38}px, ${y * 38}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5;
      y = (e.clientY - r.top) / r.height - 0.5;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="hero" ref={ref}>
      <div className="ag-container hero-inner">
        {/* Copy */}
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-line-1">Joias que chegam</span>
            <span className="hero-line-2">até você.</span>
          </h1>
          <p className="hero-sub">
            Prata 925, folheado a ouro e pedras semipreciosas escolhidas com cuidado.
            <br />
            Levo o mostruário até você em Araruama e na Região dos Lagos.
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
          <div ref={pebbleLgRef} className="hero-pebble-lg pebble pebble-a">
            <Image src="/Captura de tela_12-11-2025_212846_www.instagram.com.jpg" alt="Foto Tornozeleira" fill style={{ objectFit: "cover" }} />
          </div>
          <div ref={pebbleMdRef} className="hero-pebble-md pebble pebble-b">
            <Image src="/Captura de tela_12-11-2025_212727_www.instagram.com.jpg" alt="Foto Anel" fill style={{ objectFit: "cover" }} />
          </div>
          <div ref={pebbleSmRef} className="hero-pebble-sm pebble pebble-c">
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
