import Link from "next/link";
import HomeHero from "@/components/home/HomeHero";
import HomeManifesto from "@/components/home/HomeManifesto";
import HomeProcess from "@/components/home/HomeProcess";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import JsonLd from "@/components/seo/JsonLd";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5522981584686";

export const revalidate = 60;

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeName,
    description: `Joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, RJ`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    telephone: `+55${WA}`,
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />

      <HomeHero />
      <HomeManifesto />
      <HomeProcess />

      {/* SIGNATURE */}
      <section className="signature">
        <div className="signature-inner ag-container">
          <div className="signature-art">
            <div
              className="sig-pebble pebble pebble-b"
              style={{
                background: "repeating-linear-gradient(135deg, var(--ocean) 0 14px, var(--ink-soft) 14px 28px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--sand)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "var(--sans)",
              }}
            >
              Peça em destaque
            </div>
            <div
              className="sig-corner-1 pebble pebble-c"
              style={{
                background: "repeating-linear-gradient(135deg, var(--sand-deep) 0 14px, #dccfb0 14px 28px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "var(--sans)",
              }}
            >
              detalhe
            </div>
          </div>
          <div className="signature-copy">
            <span className="eyebrow">Assinatura Agaricia</span>
            <h2>
              Cada peça <em>carrega</em>
              <br />
              um pedaço do mar.
            </h2>
            <p>
              Nossas joias nascem inspiradas na Região dos Lagos: nos corais, nas conchas, no
              movimento da maré. São feitas em prata 925 com acabamento artesanal, pensadas para
              acompanhar quem as usa em cada gesto do dia.
            </p>
            <div className="sig-specs">
              <div className="sig-spec">
                <strong>925</strong>
                <span>prata esterlina</span>
              </div>
              <div className="sig-spec">
                <strong>100%</strong>
                <span>artesanal</span>
              </div>
              <div className="sig-spec">
                <strong>RJ</strong>
                <span>Região dos Lagos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeTestimonials />

      {/* CLOSING CTA */}
      <section className="closing">
        <div className="ag-container closing-inner">
          <h2 className="closing-h">
            Leve a <em>maré</em>
            <br />
            para dentro de casa.
          </h2>
          <p>Agende uma visita sem compromisso. A prata te espera.</p>
          <div className="closing-actions">
            <Link href="/contato" className="btn btn-primary">
              Agendar visita <span className="arrow">→</span>
            </Link>
            <Link href="/catalogo" className="btn btn-ghost">
              Ver catálogo antes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
