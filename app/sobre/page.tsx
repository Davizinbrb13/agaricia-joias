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
    desc: "Prata 925 legítima, folheado a ouro 18k e pedras semipreciosas importadas. Cada peça escolhida a dedo.",
  },
  {
    n: "02",
    title: "Atendimento",
    desc: "Vou onde você estiver. Sua casa, seu trabalho, a reunião de amigas. Me encaixo na sua rotina, não o contrário.",
  },
  {
    n: "03",
    title: "Confiança",
    desc: "Mais de 10 anos no mesmo lugar, com as mesmas clientes que continuam me chamando. Isso diz tudo.",
  },
  {
    n: "04",
    title: "Experiência",
    desc: "Depois da compra, continuo por perto. Limpeza de peças e contato especializado para qualquer conserto que precisar.",
  },
];

export default function SobrePage() {
  return (
    <>
      <section className="sobre-hero">
        <div className="ag-container">
          <span className="eyebrow">A Agaricia</span>
          <h1 className="sobre-h1">
            Mais de 10 anos levando joias<br />
            até você com carinho.
          </h1>
        </div>
      </section>

      <section>
        <div className="ag-container">
          <div className="sobre-intro">
            <div>
              <p className="sobre-lead">
                A {storeName} nasceu de um momento especial: eu e minha filha, aqui em Araruama, querendo criar algo que nos representasse de verdade. Algo ligado ao mar, às conchas, à Região dos Lagos que tanto amamos.
              </p>
            </div>
            <div className="sobre-intro-col">
              <p>
                O nome veio daí. Agaricia é um coral do Atlântico, delicado e cheio de vida, exatamente como as mulheres para quem trabalho.
              </p>
              <p>
                Há mais de 10 anos levo joias em prata 925, folheado a ouro e peças com pedras semipreciosas diretamente até as minhas clientes. Na casa delas, no trabalho, no encontro com as amigas, no chá de panela, no aniversário. Cada visita é uma tarde de experimento com calma, sem pressa de vendedora, sem compromisso nenhum.
              </p>
              <p>
                E a relação não termina na venda. Faço limpeza das peças e tenho um contato especializado para consertos, solda e cola de pedra. Estou por perto antes, durante e depois.
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
              Joia boa não é só o que você compra. É também a tarde que você passa
              experimentando, a amiga que chama pra ver, o presente que acertou em cheio.
            </p>
          </blockquote>
        </div>
      </section>

      <section style={{ paddingBottom: 120, textAlign: "center" }}>
        <div className="ag-container">
          <p style={{ color: "var(--ink-soft)", marginBottom: 24, fontSize: 17 }}>
            Quer conhecer o mostruário? Me chame e a gente marca uma tarde.
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
