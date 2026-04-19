import type { Metadata } from "next";
import ContatoForm from "@/components/contato/ContatoForm";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com a ${storeName}. Atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}. Fale conosco pelo WhatsApp.`,
};

export default function ContatoPage() {
  return (
    <>
      <section className="contato-hero">
        <div className="ag-container">
          <span className="eyebrow">Agendar visita</span>
          <h1 className="contato-h1">
            Me conta quando e onde você<br />
            quer me receber.
          </h1>
          <p style={{ maxWidth: 560, marginTop: 24, color: "var(--ink-soft)", fontSize: 17, lineHeight: 1.6 }}>
            Preencha abaixo e eu mando as opções de horário por WhatsApp. Ou, se preferir, me chama direto.
          </p>
        </div>
      </section>

      <section>
        <div className="ag-container">
          <div className="contato-main">
            <ContatoForm />

            <aside className="contato-aside">
              <div className="contato-card contato-card-dark">
                <p>
                  Prefere o <em>caminho rápido</em>?
                </p>
                <span>Fale já no WhatsApp</span>
                <div style={{ marginTop: 18 }}>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-on-dark"
                  >
                    Abrir WhatsApp
                  </a>
                </div>
              </div>

              <div className="contato-card">
                <h4>Informações</h4>
                <ul>
                  <li>
                    <span>Localização</span>
                    <strong>{city}, {state}</strong>
                  </li>
                  <li>
                    <span>Região atendida</span>
                    <strong>Araruama e Região dos Lagos, RJ</strong>
                  </li>
                  <li>
                    <span>Horário</span>
                    <strong>Seg a Sáb, 9h às 18h</strong>
                  </li>
                  <li>
                    <span>Resposta média</span>
                    <strong>Em até 2 horas (horário comercial)</strong>
                  </li>
                </ul>
              </div>

              <div className="contato-card">
                <h4>Como funciona</h4>
                <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5, color: "var(--ink)" }}>
                  Você me conta onde está e quando fica bom. Eu apareço com o mostruário completo e a gente vai com calma, sem pressa. Pode chamar as amigas.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
