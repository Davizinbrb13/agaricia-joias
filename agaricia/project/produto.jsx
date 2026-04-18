// produto.jsx — product detail page

function ProdutoPage({ productId, go }) {
  const item = (window.CATALOG || []).find(c => c.id === productId) || (window.CATALOG || [])[0];
  const [angle, setAngle] = React.useState(0);
  const [variant, setVariant] = React.useState(0);
  const dragRef = React.useRef(null);
  const dragState = React.useRef({ dragging: false, lastX: 0 });

  // auto-rotate
  React.useEffect(() => {
    let raf;
    const tick = () => {
      if (!dragState.current.dragging) {
        setAngle(a => a + 0.3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e) => { dragState.current = { dragging: true, lastX: e.clientX }; };
  const onMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.lastX;
    dragState.current.lastX = e.clientX;
    setAngle(a => a + dx * 0.8);
  };
  const onUp = () => { dragState.current.dragging = false; };

  React.useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!item) return null;
  const variants = ["Prata 925", "Prata oxidada", "Prata com detalhe dourado"];

  return (
    <div className="page produto">
      <div className="produto-inner container">
        <div className="produto-viewer">
          <div className="produto-stage"
            ref={dragRef}
            onMouseDown={onDown}
            style={{ cursor: dragState.current.dragging ? "grabbing" : "grab" }}
          >
            <div className="produto-jewel-wrap" style={{
              transform: `rotateY(${angle}deg)`,
            }}>
              <JewelSVG shape={item.shape} spin={false} />
            </div>
            <div className="produto-stage-hint">
              <span>↔ arraste para girar</span>
            </div>
            <svg className="produto-halo" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="200" fill="none" stroke="var(--ocean)" strokeWidth="0.5" opacity="0.15"/>
              <circle cx="250" cy="250" r="160" fill="none" stroke="var(--ocean)" strokeWidth="0.5" opacity="0.2"/>
              <circle cx="250" cy="250" r="120" fill="none" stroke="var(--ocean)" strokeWidth="0.5" opacity="0.25"/>
            </svg>
          </div>
          <div className="produto-thumbs">
            {[0,1,2].map(i => (
              <button key={i} className={`prod-thumb ${variant === i ? "on" : ""}`}
                onClick={() => setVariant(i)}>
                <JewelSVG shape={item.shape} spin={false} />
              </button>
            ))}
          </div>
        </div>

        <div className="produto-info">
          <button className="produto-back" onClick={() => go("catalogo")}>← Voltar ao catálogo</button>
          <span className="eyebrow">{item.cat}</span>
          <h1 className="produto-name">{item.name}</h1>
          <div className="produto-price">R$ {item.price},00</div>
          <p className="produto-desc">
            Peça artesanal em {variants[variant].toLowerCase()}, feita à mão na Região dos Lagos. Acabamento polido com pequenas variações que marcam cada unidade — nenhuma peça é igual à outra.
          </p>

          <div className="produto-field">
            <label>Acabamento</label>
            <div className="produto-variants">
              {variants.map((v, i) => (
                <button key={i}
                  className={`prod-var ${variant === i ? "on" : ""}`}
                  onClick={() => setVariant(i)}>{v}</button>
              ))}
            </div>
          </div>

          <div className="produto-actions">
            <a className="btn btn-primary"
              href={`https://wa.me/5522981584686?text=Ol%C3%A1!%20Gostaria%20de%20experimentar%20em%20casa%3A%20${encodeURIComponent(item.name)}.`}
              target="_blank" rel="noopener">
              Experimentar em casa <span className="arrow">→</span>
            </a>
            <button className="btn btn-ghost">Salvar favorita ♡</button>
          </div>

          <ul className="produto-specs">
            <li><strong>Material</strong><span>Prata 925 certificada</span></li>
            <li><strong>Origem</strong><span>Região dos Lagos · RJ</span></li>
            <li><strong>Garantia</strong><span>6 meses</span></li>
            <li><strong>Entrega</strong><span>Em mãos, sem pressa</span></li>
          </ul>
        </div>
      </div>

      <section className="produto-related container">
        <div className="produto-related-head">
          <span className="eyebrow">Combinam juntas</span>
          <h2>Peças da mesma maré</h2>
        </div>
        <div className="produto-related-grid">
          {(window.CATALOG || []).filter(c => c.id !== item.id).slice(0, 3).map(c => (
            <article key={c.id} className="related-card" onClick={() => { go("produto", c.id); }}>
              <div className="related-jewel"><JewelSVG shape={c.shape} spin={false} /></div>
              <div className="related-meta">
                <span>{c.cat}</span>
                <h4>{c.name}</h4>
                <strong>R$ {c.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ProdutoPage });
