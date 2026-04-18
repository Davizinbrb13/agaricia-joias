// shared.jsx — brand components used across all pages

// ============ AGARICIA LOGO (the coral/hand mark from the reference) ============
function AgariciaMark({ size = 28, color = "currentColor" }) {
  // Stylized coral/sea-fan like the reference logo
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Agaricia">
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* left branch */}
        <path d="M14 42 C 13 34, 10 30, 9 22 C 8.5 17, 10.5 13, 13 12" />
        <path d="M14 42 C 15 34, 17 30, 17 22 C 17 17, 15.5 13, 13 12" />
        <path d="M9.5 24 C 11 23, 12 22, 13 20" />
        <path d="M10.5 30 C 12 29, 13.5 28, 14.5 26" />
        {/* right branch */}
        <path d="M30 42 C 29 34, 26 28, 26 18 C 26 13, 28 9, 31 8" />
        <path d="M30 42 C 32 35, 34 30, 35 22 C 35.5 17, 34 11, 31 8" />
        <path d="M27 20 C 28.5 19, 30 17.5, 30.5 15" />
        <path d="M28 27 C 30 26, 32 24, 33 21" />
        <path d="M27.5 33 C 29.5 32, 31.5 30, 32.5 28" />
      </g>
      {/* dots */}
      <g fill={color}>
        <circle cx="16" cy="16" r="0.9"/>
        <circle cx="12" cy="19" r="0.7"/>
        <circle cx="10.5" cy="27" r="0.7"/>
        <circle cx="15" cy="33" r="0.7"/>
        <circle cx="32" cy="13" r="0.9"/>
        <circle cx="33.5" cy="19" r="0.7"/>
        <circle cx="30" cy="24" r="0.7"/>
        <circle cx="31.5" cy="30" r="0.7"/>
        <circle cx="27" cy="37" r="0.7"/>
      </g>
    </svg>
  );
}

// ============ NAV ============
function Nav({ page, go }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { id: "home", label: "Início" },
    { id: "catalogo", label: "Catálogo" },
    { id: "sobre", label: "Sobre" },
    { id: "contato", label: "Contato" },
  ];

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-brand" onClick={() => go("home")}>
        <AgariciaMark size={30} color="var(--ink)" />
        <span className="nav-brand-text">AGARICIA</span>
      </div>
      <div className="nav-links">
        {items.map(it => (
          <a
            key={it.id}
            className={`nav-link ${page === it.id ? "active" : ""}`}
            onClick={() => go(it.id)}
          >{it.label}</a>
        ))}
        <a
          className="nav-cta"
          href="https://wa.me/5522981584686"
          target="_blank"
          rel="noopener"
        >Agendar visita</a>
      </div>
    </nav>
  );
}

// ============ OCEAN BG — photo with subtle parallax + drift ============
function OceanBackground({ tone = "light" }) {
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="ocean-bg" aria-hidden="true">
      <div
        className="ocean-photo"
        style={{ transform: `translate3d(0, ${scrollY * 0.15}px, 0) scale(1.06)` }}
      />
      <div className="ocean-photo-tint" />
      <div className="ocean-grain" />
    </div>
  );
}

// ============ FOOTER ============
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <AgariciaMark size={56} color="var(--foam)" />
          <div>
            <div className="footer-brand-name">AGARICIA</div>
            <div className="footer-brand-sub">JOIAS · PRATA 925</div>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h5>Navegar</h5>
            <a onClick={() => go("home")}>Início</a>
            <a onClick={() => go("catalogo")}>Catálogo</a>
            <a onClick={() => go("sobre")}>Sobre</a>
            <a onClick={() => go("contato")}>Contato</a>
          </div>
          <div>
            <h5>Atendimento</h5>
            <a>Araruama · RJ</a>
            <a>Região dos Lagos</a>
            <a>Seg–Sáb · 9h às 18h</a>
          </div>
          <div>
            <h5>VIP em domicílio</h5>
            <a href="https://wa.me/5522981584686" target="_blank" rel="noopener">WhatsApp</a>
            <a>@agaricia.joias</a>
            <a>contato@agaricia.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bot container">
        <span>© 2026 Agaricia Joias</span>
        <span className="footer-tag">Feito à beira-mar, na Região dos Lagos</span>
      </div>
    </footer>
  );
}

Object.assign(window, { AgariciaMark, Nav, OceanBackground, Footer });
