// sobre.jsx — about
function SobrePage({ go }) {
  return (
    <div className="page sobre">
      <header className="sobre-hero container">
        <span className="eyebrow">Nossa história</span>
        <h1 className="sobre-h1">
          Da <em>Região<br/>dos Lagos</em>,<br/>com calma.
        </h1>
      </header>

      <section className="sobre-intro container">
        <div className="sobre-intro-col">
          <p className="sobre-lead">
            A Agaricia nasceu de uma ideia simples: joias não deveriam ser compradas com pressa. Deveriam ser escolhidas com calma, experimentadas em casa, na luz certa, sem vitrine nem olhar alheio.
          </p>
        </div>
        <div className="sobre-intro-col">
          <p>
            Somos baseadas em Araruama, no coração da Região dos Lagos. Cada peça que levamos até você é pensada, polida e conferida à mão — prata 925 de verdade, sem atalhos.
          </p>
          <p>
            O nome <em>Agaricia</em> vem dos corais que habitam águas claras e protegidas — os mesmos que inspiram boa parte da coleção. Tudo começa no mar, como tudo na nossa região.
          </p>
        </div>
      </section>

      <section className="sobre-pillars container">
        {[
          { n: "01", t: "VIP em domicílio", d: "Levamos o mostruário até você, onde quiser. Casa, trabalho, evento." },
          { n: "02", t: "Prata 925 real", d: "Esterlina certificada. Acabamento artesanal, sem pressa, sem atalhos." },
          { n: "03", t: "Peças únicas", d: "Nada em escala industrial. Cada joia carrega pequenas variações próprias." },
          { n: "04", t: "Raízes locais", d: "Inspiração e matéria-prima da Região dos Lagos. Identidade do litoral RJ." },
        ].map((p, i) => (
          <article key={i} className="pillar">
            <span className="pillar-n">{p.n}</span>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </article>
        ))}
      </section>

      <section className="sobre-quote container">
        <blockquote>
          <div className="sobre-quote-mark">“</div>
          <p>Toda joia da Agaricia sai de casa como uma carta: <em>escrita à mão, entregue em mãos.</em></p>
        </blockquote>
      </section>

      <section className="closing">
        <div className="container closing-inner">
          <h2 className="closing-h">Quer <em>conhecer</em> pessoalmente?</h2>
          <p>Marque uma visita VIP — o mostruário vai até você, sem compromisso.</p>
          <div className="closing-actions">
            <button className="btn btn-primary" onClick={() => go("contato")}>
              Agendar visita <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// contato.jsx — contact + scheduling
function ContatoPage({ go }) {
  const [form, setForm] = React.useState({ nome: "", cidade: "", periodo: "", mensagem: "" });
  const [sent, setSent] = React.useState(false);
  const change = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const text = `Olá! Gostaria de agendar uma visita VIP.
Nome: ${form.nome}
Cidade: ${form.cidade}
Período: ${form.periodo}
${form.mensagem ? "Mensagem: " + form.mensagem : ""}`;
    window.open(`https://wa.me/5522981584686?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };

  return (
    <div className="page contato">
      <header className="contato-hero container">
        <span className="eyebrow">Agendar visita</span>
        <h1 className="contato-h1">
          Vamos até você.<br/>
          <em>Conte quando.</em>
        </h1>
      </header>

      <section className="contato-main container">
        <form className="contato-form" onSubmit={submit}>
          <div className="ct-row">
            <label>
              <span>Seu nome</span>
              <input required value={form.nome} onChange={e => change("nome", e.target.value)} placeholder="Como podemos te chamar?"/>
            </label>
          </div>
          <div className="ct-row">
            <label>
              <span>Cidade</span>
              <select required value={form.cidade} onChange={e => change("cidade", e.target.value)}>
                <option value="">Selecione…</option>
                <option>Araruama</option>
                <option>Saquarema</option>
                <option>São Pedro da Aldeia</option>
                <option>Cabo Frio</option>
                <option>Arraial do Cabo</option>
                <option>Iguaba Grande</option>
                <option>Outra cidade da região</option>
              </select>
            </label>
          </div>
          <div className="ct-row">
            <span className="ct-label">Qual período é melhor?</span>
            <div className="ct-chips">
              {["Manhã", "Tarde", "Início da noite", "Fim de semana"].map(p => (
                <button type="button" key={p}
                  className={`ct-chip ${form.periodo === p ? "on" : ""}`}
                  onClick={() => change("periodo", p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="ct-row">
            <label>
              <span>Mensagem (opcional)</span>
              <textarea rows="4" value={form.mensagem} onChange={e => change("mensagem", e.target.value)}
                placeholder="Peça que te interessou, data específica, anything…"/>
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            {sent ? "Enviado ✓ Combinar no WhatsApp" : "Combinar no WhatsApp"} <span className="arrow">→</span>
          </button>
        </form>

        <aside className="contato-aside">
          <div className="contato-card">
            <h4>Atendimento</h4>
            <ul>
              <li><span>Região</span><strong>Araruama e Região dos Lagos</strong></li>
              <li><span>Horário</span><strong>Seg–Sáb · 9h às 18h</strong></li>
              <li><span>WhatsApp</span><strong>+55 22 98158-4686</strong></li>
              <li><span>Instagram</span><strong>@agaricia.joias</strong></li>
            </ul>
          </div>
          <div className="contato-card contato-card-dark">
            <p><em>"Escolha com calma, no seu tempo."</em></p>
            <span>— Agaricia Joias</span>
          </div>
        </aside>
      </section>
    </div>
  );
}

Object.assign(window, { SobrePage, ContatoPage });
