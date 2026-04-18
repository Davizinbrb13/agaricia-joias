// home.jsx — immersive scroll-storytelling home

function HomePage({ go, heroVariant }) {
  return (
    <div className="page home">
      <HomeHero go={go} variant={heroVariant} />
      <HomeManifesto />
      <HomeProcess />
      <HomeSignature />
      <HomeTestimonials />
      <HomeCTA go={go} />
    </div>
  );
}

// ---------- HERO (3 variants) ----------
function HomeHero({ go, variant }) {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onMove = (e) => {
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

  // Parallax transform helper
  const par = (depth) => ({
    transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)`,
  });

  return (
    <section className="hero" ref={ref}>
      {/* Variant visual */}
      {variant === "svg" && <HeroSVG par={par} />}
      {variant === "photo" && <HeroPhoto par={par} />}
      {variant === "video" && <HeroVideo par={par} />}

      {/* Copy */}
      <div className="hero-copy container">
        <span className="eyebrow">Região dos Lagos · Araruama RJ</span>
        <h1 className="hero-title">
          <span className="hero-line-1">O brilho</span>
          <span className="hero-line-2">da <em>prata</em>,</span>
          <span className="hero-line-3">trazido até você.</span>
        </h1>
        <p className="hero-sub">
          Joias artesanais em prata 925 com atendimento VIP em domicílio. <br/>
          Experimente com calma. Sem pressa. Sem compromisso.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => go("catalogo")}>
            Ver catálogo <span className="arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => go("contato")}>
            Atendimento VIP
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll">
        <div className="hero-scroll-line"/>
        <span>role para explorar</span>
      </div>
    </section>
  );
}

function HeroSVG({ par }) {
  // SVG-only abstract coral composition
  return (
    <div className="hero-visual hero-visual-svg">
      <div className="hero-svg-wrap" style={par(12)}>
        <svg viewBox="0 0 600 700" width="100%" height="100%">
          <defs>
            <radialGradient id="heroGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#6b96bf" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#f4ebd8" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="380" rx="280" ry="320" fill="url(#heroGrad)"/>
          {/* large coral mark */}
          <g transform="translate(300 350) scale(8)" stroke="#0f2444" strokeWidth="0.2" fill="none" strokeLinecap="round">
            <path d="M-10 20 C -11 10, -14 4, -15 -4 C -15.5 -9, -13.5 -13, -11 -14" />
            <path d="M-10 20 C -9 10, -7 4, -7 -4 C -7 -9, -8.5 -13, -11 -14" />
            <path d="M-13.5 0 C -12 -1, -11 -2, -10 -4" />
            <path d="M-12.5 6 C -11 5, -9.5 4, -8.5 2" />
            <path d="M6 20 C 5 10, 2 4, 2 -6 C 2 -11, 4 -15, 7 -16" />
            <path d="M6 20 C 8 11, 10 6, 11 -2 C 11.5 -7, 10 -13, 7 -16" />
            <path d="M3 -4 C 4.5 -5, 6 -6.5, 6.5 -9" />
            <path d="M4 3 C 6 2, 8 0, 9 -3" />
            <g fill="#0f2444" stroke="none">
              <circle cx="-8" cy="-8" r="0.4"/>
              <circle cx="-12" cy="-5" r="0.3"/>
              <circle cx="-13.5" cy="3" r="0.3"/>
              <circle cx="-9" cy="9" r="0.3"/>
              <circle cx="8" cy="-11" r="0.4"/>
              <circle cx="9.5" cy="-5" r="0.3"/>
              <circle cx="6" cy="0" r="0.3"/>
              <circle cx="7.5" cy="6" r="0.3"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function HeroPhoto({ par }) {
  return (
    <div className="hero-visual hero-visual-photo">
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
  );
}

function HeroVideo({ par }) {
  return (
    <div className="hero-visual hero-visual-video">
      {/* Animated SVG water surface that reads as video */}
      <div className="hero-water" style={par(8)}>
        <div className="hero-water-layer hero-water-1"/>
        <div className="hero-water-layer hero-water-2"/>
        <div className="hero-water-layer hero-water-3"/>
        <svg className="hero-water-caustics" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="caustic">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="3">
                <animate attributeName="baseFrequency" values="0.012;0.018;0.012" dur="14s" repeatCount="indefinite"/>
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="50"/>
            </filter>
          </defs>
          <rect width="800" height="800" fill="#6b96bf" opacity="0.4" filter="url(#caustic)"/>
        </svg>
      </div>
      <div className="hero-pebble-lg pebble pebble-a" style={par(18)}>
        <PhotoPlaceholder label="Vídeo · joia submersa" tone="deep" />
      </div>
    </div>
  );
}

function PhotoPlaceholder({ label, tone = "sand" }) {
  const bg = {
    sand:  "repeating-linear-gradient(135deg, #e8dcc0 0 14px, #dccfb0 14px 28px)",
    mist:  "repeating-linear-gradient(135deg, #bfd4e5 0 14px, #a8c4db 14px 28px)",
    deep:  "repeating-linear-gradient(135deg, #3d6b9c 0 14px, #2f5882 14px 28px)",
  }[tone];
  const fg = tone === "deep" ? "#f4ebd8" : "#0f2444";
  return (
    <div className="photo-ph" style={{ background: bg, color: fg }}>
      <span>{label}</span>
    </div>
  );
}

// ---------- MANIFESTO ----------
function HomeManifesto() {
  const ref = React.useRef(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = 1 - (r.top / vh);
      setProgress(Math.max(0, Math.min(1.5, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = [
    "Prata", "925", "artesanal",
    "de", "coração", "para", "coração",
    "feita", "para", "quem", "se", "cuida."
  ];

  return (
    <section className="manifesto" ref={ref}>
      <div className="container">
        <p className="manifesto-text">
          {words.map((w, i) => {
            const start = i / words.length * 0.9;
            const end = start + 0.15;
            const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
            return (
              <span key={i} style={{
                opacity: 0.15 + 0.85 * t,
                color: `rgb(${15 + (1-t)*100}, ${36 + (1-t)*80}, ${68 + (1-t)*60})`,
                transition: "opacity 0.2s, color 0.2s",
                display: "inline-block",
                marginRight: "0.25em",
              }}>{w}</span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

// ---------- PROCESS ----------
function HomeProcess() {
  const [active, setActive] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const children = ref.current.querySelectorAll(".process-step");
      const vhMid = window.innerHeight * 0.5;
      let best = 0, bestDist = Infinity;
      children.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - vhMid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const steps = [
    {
      n: "01",
      kicker: "Escolha",
      title: "Navegue pelo catálogo",
      body: "Explore peças em prata 925 com calma. Separe favoritas para experimentar em casa — sem compromisso.",
    },
    {
      n: "02",
      kicker: "Agende",
      title: "Marcamos a visita",
      body: "Combinamos dia e horário que caibam na sua rotina. Casa, trabalho, evento — vamos até você.",
    },
    {
      n: "03",
      kicker: "Experimente",
      title: "Viva a prata em casa",
      body: "Abrimos o mostruário no seu espaço. Teste cada peça, veja na luz natural, sinta o peso. Sem pressa.",
    },
  ];

  return (
    <section className="process" ref={ref}>
      <div className="process-inner container">
        <aside className="process-aside">
          <span className="eyebrow">Como funciona</span>
          <h2 className="process-h">
            Um atendimento<br/>
            <em>feito à mão.</em>
          </h2>
          <p className="process-desc">
            Três passos simples para levar a prata até você, exatamente onde estiver.
          </p>
          <div className="process-indicator">
            {steps.map((_, i) => (
              <span key={i} className={`ind ${i === active ? "on" : ""}`}/>
            ))}
          </div>
        </aside>
        <div className="process-steps">
          {steps.map((s, i) => (
            <article key={i} className={`process-step ${i === active ? "active" : ""}`}>
              <div className="process-step-num">{s.n}</div>
              <div className="process-step-body">
                <span className="process-step-kick">{s.kicker}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
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

function ProcessArt({ index }) {
  // 3 abstract vignettes
  if (index === 0) return (
    <svg viewBox="0 0 200 200" className="pa">
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--ink)" strokeWidth="0.5" opacity="0.3"/>
      <g className="pa-dots">
        {Array.from({length: 12}).map((_, i) => {
          const a = i * (Math.PI * 2 / 12);
          const x = 100 + Math.cos(a) * 70;
          const y = 100 + Math.sin(a) * 70;
          return <circle key={i} cx={x} cy={y} r="3" fill="var(--ink)" opacity={0.3 + (i%3)*0.2}/>;
        })}
      </g>
      <circle cx="100" cy="100" r="12" fill="var(--ink)"/>
    </svg>
  );
  if (index === 1) return (
    <svg viewBox="0 0 200 200" className="pa">
      <path d="M 30 100 Q 100 40, 170 100" stroke="var(--ink)" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="3 4"/>
      <circle cx="30" cy="100" r="6" fill="var(--ink)"/>
      <circle cx="170" cy="100" r="6" fill="var(--ink)"/>
      <circle cx="100" cy="64" r="10" fill="none" stroke="var(--ink)" strokeWidth="1.5"/>
      <text x="100" y="140" textAnchor="middle" fontFamily="var(--serif)" fontSize="14" fontStyle="italic" fill="var(--ocean)">até você</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 200 200" className="pa">
      <g transform="translate(100 100)">
        {[0,1,2,3,4].map(i => (
          <rect key={i}
            x={-30 + i*4} y={-60 + i*6}
            width="60" height="8" rx="4"
            fill="none" stroke="var(--ink)" strokeWidth="0.8"
            opacity={0.3 + i * 0.15}
            transform={`rotate(${i*3})`}
          />
        ))}
        <circle cx="0" cy="20" r="18" fill="var(--sand-deep)" opacity="0.5"/>
      </g>
    </svg>
  );
}

// ---------- SIGNATURE (featured piece) ----------
function HomeSignature() {
  return (
    <section className="signature">
      <div className="signature-inner container">
        <div className="signature-art">
          <div className="sig-pebble pebble pebble-b">
            <PhotoPlaceholder label="Peça em destaque" tone="deep" />
          </div>
          <div className="sig-corner-1 pebble pebble-c">
            <PhotoPlaceholder label="detalhe" tone="sand" />
          </div>
        </div>
        <div className="signature-copy">
          <span className="eyebrow">Assinatura Agaricia</span>
          <h2>Cada peça <em>carrega</em><br/>um pedaço do mar.</h2>
          <p>
            Nossas joias nascem inspiradas na Região dos Lagos — nas corais, nas conchas, no movimento da maré. São feitas em prata 925 com acabamento artesanal, pensadas para acompanhar quem as usa em cada gesto do dia.
          </p>
          <div className="sig-specs">
            <div className="sig-spec"><strong>925</strong><span>prata esterlina</span></div>
            <div className="sig-spec"><strong>100%</strong><span>artesanal</span></div>
            <div className="sig-spec"><strong>RJ</strong><span>Região dos Lagos</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- TESTIMONIALS ----------
function HomeTestimonials() {
  const [i, setI] = React.useState(0);
  const items = [
    { q: "Nunca pensei que comprar joias pudesse ser tão confortável. Atendimento impecável, peças lindíssimas — já indiquei para todas as amigas.", who: "Carolina Santos", where: "Saquarema" },
    { q: "Adorei a experiência. A vendedora trouxe tudo na minha casa e pude experimentar com calma. As peças são maravilhosas e a prata é de qualidade incrível.", who: "Mariana Silva", where: "Araruama" },
    { q: "Comprei um conjunto para usar no meu casamento e fiquei encantada. A qualidade da prata 925 é visível. Recomendo de olhos fechados.", who: "Fernanda Oliveira", where: "São Pedro da Aldeia" },
  ];

  React.useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="testimonials">
      <div className="container">
        <span className="eyebrow" style={{justifyContent: "center", width: "100%"}}>Quem já viveu</span>
        <div className="testimonial-wrap">
          {items.map((t, idx) => (
            <blockquote key={idx} className={`testimonial ${idx === i ? "active" : ""}`}>
              <div className="testimonial-mark">“</div>
              <p>{t.q}</p>
              <footer>
                <strong>{t.who}</strong>
                <span>{t.where}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="testimonial-dots">
          {items.map((_, idx) => (
            <button key={idx}
              className={`tdot ${idx === i ? "on" : ""}`}
              onClick={() => setI(idx)}
              aria-label={`Depoimento ${idx+1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CLOSING CTA ----------
function HomeCTA({ go }) {
  return (
    <section className="closing">
      <div className="container closing-inner">
        <h2 className="closing-h">
          Leve a <em>maré</em><br/>para dentro de casa.
        </h2>
        <p>Agende uma visita sem compromisso. A prata te espera.</p>
        <div className="closing-actions">
          <button className="btn btn-primary" onClick={() => go("contato")}>
            Agendar visita <span className="arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => go("catalogo")}>
            Ver catálogo antes
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomePage });
