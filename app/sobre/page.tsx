import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: `Conheça a ${storeName}, joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}. Nossa história e nosso diferencial.`,
};

const PILLARS = [
  {
    n: "01",
    title: "Qualidade",
    desc: "Todas as peças em prata 925, com garantia de autenticidade e acabamento impecável.",
  },
  {
    n: "02",
    title: "Atendimento",
    desc: "Personalizado, no seu tempo e no seu espaço favorito. Sem pressa, sem compromisso.",
  },
  {
    n: "03",
    title: "Confiança",
    desc: "Transparência nos preços, peças selecionadas com carinho e satisfação garantida.",
  },
  {
    n: "04",
    title: "Experiência",
    desc: "Mais que vender joias, levamos um momento íntimo e especial até você.",
  },
];

export default function SobrePage() {
  return (
    <>
      <section className="sobre-hero">
        <div className="ag-container">
          <span className="eyebrow">Nossa História</span>
          <h1 className="sobre-h1">
            joias que<br />
            <em>te acompanham</em>
          </h1>
        </div>
      </section>

      <section>
        <div className="ag-container">
          <div className="sobre-intro">
            <div>
              <p className="sobre-lead">
                A {storeName} nasceu do amor pela beleza e pela{" "}
                <em style={{ fontStyle: "italic", color: "var(--tide)" }}>prata</em>.
                Uma joalheria feminina para mulheres que valorizam elegância, qualidade e conforto.
              </p>
            </div>
            <div className="sobre-intro-col">
              <p>
                Somos especializadas em peças de <em>prata 925</em>, cuidadosamente
                selecionadas para acompanhar cada momento, do dia a dia às ocasiões
                especiais.
              </p>
              <p>
                Atuamos em {city} e em toda a <em>Região dos Lagos, {state}</em>,
                com um modelo de atendimento que é nosso grande diferencial.
              </p>
              <p>
                O <em>atendimento VIP em domicílio</em>: levamos o mostruário completo
                até você: na sua casa, no trabalho, ou em eventos sociais como chás
                de panela, aniversários e reuniões de amigas.
              </p>
              <p>
                Você experimenta cada peça com calma, no conforto do seu ambiente. Uma
                experiência <em>personalizada e intimista</em>, como uma amiga que
                entende de joias e quer te ajudar a brilhar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="ag-container">
          <div className="sobre-pillars">
            {PILLARS.map((p) => (
              <article key={p.n} className="pillar">
                <span className="pillar-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sobre-quote">
        <div className="ag-container">
          <blockquote>
            <div className="sobre-quote-mark">&ldquo;</div>
            <p>
              Cada peça é escolhida com <em>carinho</em>, porque joia não é só
              enfeite, é <em>lembrança</em> que fica.
            </p>
          </blockquote>
        </div>
      </section>

      <section style={{ paddingBottom: 120, textAlign: "center" }}>
        <div className="ag-container">
          <p style={{ color: "var(--ink-soft)", marginBottom: 24, fontSize: 17 }}>
            Ficou interessada? Vamos marcar um atendimento.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Agendar atendimento
          </a>{" "}
          <Link href="/catalogo" className="btn btn-ghost" style={{ marginLeft: 8 }}>
            Ver catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
