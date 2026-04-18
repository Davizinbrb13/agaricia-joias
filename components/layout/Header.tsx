"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AgariciaMark from "@/components/ui/AgariciaMark";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5522981584686";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ESC fecha o menu e retorna foco ao botão
  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }

      // Focus trap — mantém foco dentro do menu mobile
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Foca o primeiro item do menu ao abrir
    requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
    });

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMenu]);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="nav-brand" aria-label="Agaricia Joias">
        <AgariciaMark size={30} color="var(--ink)" />
        <span className="nav-brand-text">AGARICIA</span>
      </Link>

      {/* Desktop nav */}
      <nav className="nav-links" aria-label="Menu principal">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
        <a
          href={`https://wa.me/${WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          Agendar visita
        </a>
      </nav>

      {/* Mobile CTA — shown via CSS media query */}
      <div className="nav-mobile-cta">
        <a
          href={`https://wa.me/${WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          style={{ fontSize: 11, padding: "10px 16px" }}
        >
          WhatsApp
        </a>
        <button
          ref={menuButtonRef}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          style={{
            marginLeft: 8,
            padding: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.8" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          ref={menuRef}
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            background: "rgba(247,243,234,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(15,36,68,0.08)",
            padding: "16px 20px 24px",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          aria-label="Menu mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{
                padding: "12px 0",
                fontSize: 16,
                fontFamily: "var(--serif)",
                color: "var(--ink)",
                borderBottom: "1px solid rgba(15,36,68,0.06)",
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Botão fechar acessível dentro do menu (útil para usuários de teclado) */}
          <button
            onClick={closeMenu}
            style={{
              marginTop: 8,
              padding: "10px 0",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ocean)",
              fontFamily: "var(--sans)",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            Fechar ×
          </button>
        </nav>
      )}
    </header>
  );
}
