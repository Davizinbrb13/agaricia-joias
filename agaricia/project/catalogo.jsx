// catalogo.jsx — 3D-ish catalog with reactive cards

const CATALOG = [
  { id: "coral-anel",     name: "Anel Coral",            cat: "anéis",       price: 289, tag: "Novo", shape: "ring" },
  { id: "mare-braco",     name: "Bracelete Maré",        cat: "braceletes",  price: 349, tag: null,   shape: "braceletThin" },
  { id: "concha-brinco",  name: "Brincos Concha",        cat: "brincos",     price: 179, tag: null,   shape: "earringDrop" },
  { id: "tornoz-folha",   name: "Tornozeleira Folha",    cat: "tornozeleiras", price: 259, tag: "Feito à mão", shape: "anklet" },
  { id: "colar-agua",     name: "Colar Água-viva",       cat: "colares",     price: 459, tag: null,   shape: "necklace" },
  { id: "anel-pena",      name: "Anel Pena",             cat: "anéis",       price: 229, tag: null,   shape: "ringBand" },
  { id: "brinco-gota",    name: "Brincos Gota",          cat: "brincos",     price: 199, tag: "Best seller", shape: "earringStud" },
  { id: "pulseira-onda",  name: "Pulseira Onda",         cat: "braceletes",  price: 319, tag: null,   shape: "braceletChain" },
  { id: "colar-coral",    name: "Colar Coral",           cat: "colares",     price: 529, tag: "Edição única", shape: "necklacePendant" },
];

const CATEGORIES = ["tudo", "anéis", "brincos", "braceletes", "colares", "tornozeleiras"];

function CatalogoPage({ go, catalogLayout, openProduct }) {
  const [cat, setCat] = React.useState("tudo");
  const items = cat === "tudo" ? CATALOG : CATALOG.filter(i => i.cat === cat);

  return (
    <div className="page catalogo">
      <header className="cat-header container">
        <span className="eyebrow">Coleção 2026 · Prata 925</span>
        <h1>Catálogo</h1>
        <p>Passe o mouse sobre cada peça para ver de perto. Favoritas? Separe para experimentar em casa, sem compromisso.</p>
      </header>

      <div className="cat-controls container">
        <div className="cat-filters">
          {CATEGORIES.map(c => (
            <button key={c}
              className={`cat-filter ${cat === c ? "on" : ""}`}
              onClick={() => setCat(c)}
            >{c}</button>
          ))}
        </div>
        <div className="cat-count">
          <span>{items.length}</span> peças
        </div>
      </div>

      <div className={`cat-grid cat-grid-${catalogLayout} container`}>
        {items.map((it, idx) => (
          <CatalogCard key={it.id} item={it} index={idx} onOpen={() => openProduct(it.id)} layout={catalogLayout} />
        ))}
      </div>

      <section className="cat-foot container">
        <h2>Não achou a peça certa?</h2>
        <p>Trazemos mais mostruário na visita. Combine agora pelo WhatsApp.</p>
        <a className="btn btn-primary" href="https://wa.me/5522981584686" target="_blank" rel="noopener">
          Falar no WhatsApp <span className="arrow">→</span>
        </a>
      </section>
    </div>
  );
}

// 3D-reactive card
function CatalogCard({ item, index, onOpen, layout }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, px: 50, py: 50 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      ry: (x - 0.5) * 16,
      rx: -(y - 0.5) * 16,
      px: x * 100,
      py: y * 100,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, px: 50, py: 50 });

  // Sizes for asymmetric layout
  const aspect = layout === "asymmetric"
    ? ["1/1.3", "1/1", "1/1.5", "1/0.9", "1/1.2", "1/1.4"][index % 6]
    : "1/1.15";

  return (
    <article
      ref={ref}
      className={`card ${hover ? "hover" : ""}`}
      style={{ aspectRatio: aspect, animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); onLeave(); }}
      onMouseMove={onMove}
      onClick={onOpen}
    >
      <div className="card-scene" style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}>
        <div className="card-bg">
          <div className="card-shine" style={{
            background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.7) 0%, transparent 40%)`,
          }}/>
        </div>
        <div className="card-jewel">
          <JewelSVG shape={item.shape} spin={hover} />
        </div>
        <div className="card-shadow"/>
      </div>
      {item.tag && <span className="card-tag">{item.tag}</span>}
      <div className="card-meta">
        <div>
          <div className="card-cat">{item.cat}</div>
          <div className="card-name">{item.name}</div>
        </div>
        <div className="card-price">R$ {item.price}</div>
      </div>
      <div className="card-cta"><span>Ver peça</span><span className="arrow">→</span></div>
    </article>
  );
}

// ---------- JEWEL SVGs ----------
function JewelSVG({ shape, spin }) {
  const silver = "url(#silverGrad)";
  return (
    <svg viewBox="0 0 200 200" className={`jewel ${spin ? "spin" : ""}`}>
      <defs>
        <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f5f7"/>
          <stop offset="35%" stopColor="#c8ccd1"/>
          <stop offset="55%" stopColor="#8a92a0"/>
          <stop offset="75%" stopColor="#c8ccd1"/>
          <stop offset="100%" stopColor="#e8eaed"/>
        </linearGradient>
        <radialGradient id="silverHi" cx="30%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9"/>
          <stop offset="40%" stopColor="#fff" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {shape === "ring" && <g>
        <ellipse cx="100" cy="110" rx="60" ry="14" fill="none" stroke={silver} strokeWidth="8"/>
        <ellipse cx="100" cy="110" rx="60" ry="14" fill="none" stroke="url(#silverHi)" strokeWidth="8"/>
        <circle cx="100" cy="80" r="18" fill={silver} stroke="#0f2444" strokeWidth="0.5"/>
        <circle cx="100" cy="80" r="18" fill="url(#silverHi)"/>
      </g>}
      {shape === "ringBand" && <g>
        <ellipse cx="100" cy="100" rx="58" ry="58" fill="none" stroke={silver} strokeWidth="14"/>
        <path d="M 70 100 Q 100 70 130 100" stroke="#8a92a0" strokeWidth="1" fill="none" opacity="0.5"/>
        <path d="M 78 100 Q 100 80 122 100" stroke="#8a92a0" strokeWidth="1" fill="none" opacity="0.5"/>
        <path d="M 86 100 Q 100 90 114 100" stroke="#8a92a0" strokeWidth="1" fill="none" opacity="0.5"/>
      </g>}
      {shape === "braceletThin" && <g>
        <ellipse cx="100" cy="100" rx="75" ry="55" fill="none" stroke={silver} strokeWidth="5"/>
        <ellipse cx="100" cy="100" rx="75" ry="55" fill="none" stroke="url(#silverHi)" strokeWidth="5"/>
        {Array.from({length: 8}).map((_, i) => {
          const a = i * (Math.PI * 2 / 8);
          const x = 100 + Math.cos(a) * 75;
          const y = 100 + Math.sin(a) * 55;
          return <circle key={i} cx={x} cy={y} r="3" fill={silver}/>;
        })}
      </g>}
      {shape === "braceletChain" && <g>
        {Array.from({length: 12}).map((_, i) => {
          const a = i * (Math.PI * 2 / 12);
          const x = 100 + Math.cos(a) * 72;
          const y = 100 + Math.sin(a) * 52;
          return <ellipse key={i} cx={x} cy={y} rx="8" ry="6"
            transform={`rotate(${a*180/Math.PI + 90} ${x} ${y})`}
            fill="none" stroke={silver} strokeWidth="2"/>;
        })}
      </g>}
      {shape === "earringDrop" && <g>
        <circle cx="70" cy="60" r="6" fill={silver}/>
        <path d="M 70 66 L 70 110 L 65 140 Q 70 155 75 140 L 70 110" fill={silver} stroke="#8a92a0" strokeWidth="0.3"/>
        <circle cx="130" cy="60" r="6" fill={silver}/>
        <path d="M 130 66 L 130 110 L 125 140 Q 130 155 135 140 L 130 110" fill={silver} stroke="#8a92a0" strokeWidth="0.3"/>
        <circle cx="70" cy="140" r="10" fill={silver}/>
        <circle cx="70" cy="140" r="10" fill="url(#silverHi)"/>
        <circle cx="130" cy="140" r="10" fill={silver}/>
        <circle cx="130" cy="140" r="10" fill="url(#silverHi)"/>
      </g>}
      {shape === "earringStud" && <g>
        <circle cx="75" cy="100" r="22" fill={silver}/>
        <circle cx="75" cy="100" r="22" fill="url(#silverHi)"/>
        <circle cx="75" cy="100" r="8" fill="#f4ebd8" opacity="0.6"/>
        <circle cx="125" cy="100" r="22" fill={silver}/>
        <circle cx="125" cy="100" r="22" fill="url(#silverHi)"/>
        <circle cx="125" cy="100" r="8" fill="#f4ebd8" opacity="0.6"/>
      </g>}
      {shape === "anklet" && <g>
        <path d="M 20 100 Q 100 130 180 100" stroke={silver} strokeWidth="3" fill="none"/>
        {Array.from({length: 6}).map((_, i) => {
          const x = 40 + i * 24;
          const y = 100 + Math.sin((i-2.5)*0.6) * 15 + 8;
          return <g key={i}>
            <line x1={x} y1={y-5} x2={x} y2={y+8} stroke={silver} strokeWidth="1"/>
            <path d={`M ${x-6} ${y+14} Q ${x} ${y+22} ${x+6} ${y+14} Q ${x+4} ${y+8} ${x} ${y+8} Q ${x-4} ${y+8} ${x-6} ${y+14}`} fill={silver}/>
          </g>;
        })}
      </g>}
      {shape === "necklace" && <g>
        <path d="M 40 50 Q 100 140 160 50" stroke={silver} strokeWidth="2" fill="none"/>
        <circle cx="100" cy="130" r="14" fill={silver}/>
        <circle cx="100" cy="130" r="14" fill="url(#silverHi)"/>
        <path d="M 100 116 L 100 144 M 94 122 L 106 138 M 106 122 L 94 138" stroke="#8a92a0" strokeWidth="0.5"/>
      </g>}
      {shape === "necklacePendant" && <g>
        <path d="M 40 50 Q 100 100 160 50" stroke={silver} strokeWidth="2" fill="none"/>
        <g transform="translate(100 110)">
          <path d="M 0 -18 C -12 -12, -14 0, -8 10 C -4 4, 0 -2, 0 -8 C 0 -2, 4 4, 8 10 C 14 0, 12 -12, 0 -18 Z" fill={silver}/>
          <path d="M 0 -18 C -12 -12, -14 0, -8 10 C -4 4, 0 -2, 0 -8 C 0 -2, 4 4, 8 10 C 14 0, 12 -12, 0 -18 Z" fill="url(#silverHi)"/>
        </g>
      </g>}
    </svg>
  );
}

Object.assign(window, { CatalogoPage, CATALOG });
