import Link from "next/link";
import Image from "next/image";
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
            <div className="sig-pebble pebble pebble-b">
              <Image
                src="/Embelezador de Produtos-418749fb-e261-4ee0-8f27-69840365814f.jpg"
                alt="Pulseira em destaque"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="sig-corner-1 pebble pebble-c">
              <Image
                src="/Embelezador de Produtos-21381872-ba80-4108-a36b-a7f43b7485c7.jpg"
                alt="Detalhe do anel"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="signature-copy">
            <span className="eyebrow">Assinatura Agaricia</span>
            <h2>
              Cada pedra tem uma história.
              <br />
              Cada visita, uma lembrança.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p>
                A Agaricia nasceu aqui na Região dos Lagos, com o mar do lado e uma paixão por joias que cresceu ao longo de mais de 10 anos.
              </p>
              <p>
                Trabalho com prata 925 legítima, folheado a ouro 18k e peças com pedras semipreciosas importadas e escolhidas com cuidado: ametista, larimar, pedra da lua, abalone, turmalina, opala e muito mais.
              </p>
              <p>
                E depois da compra, continuo por perto. Faço limpeza das peças e tenho contato especializado para qualquer conserto que precisar.
              </p>
            </div>
            <div className="sig-specs">
              <div className="sig-spec">
                <strong>10 anos</strong>
                <span>de experiência</span>
              </div>
              <div className="sig-spec">
                <strong>Prata 925</strong>
                <span>legítima</span>
              </div>
              <div className="sig-spec">
                <strong>Araruama, RJ</strong>
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
            Quando você precisar,
            <br />
            <em>eu apareço.</em>
          </h2>
          <p>Para o presente que não pode errar, para o look do casamento, para o encontro de amigas que virou tarde de joias. Atendo de segunda a sábado em Araruama e na Região dos Lagos.</p>
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
