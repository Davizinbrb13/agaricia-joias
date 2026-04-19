import type { Metadata } from "next";
import CategoryFilter from "@/components/product/CategoryFilter";
import { getProducts } from "@/lib/queries";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Explore nosso catálogo completo de joias de prata 925. Anéis, colares, brincos, pulseiras e conjuntos com atendimento VIP em domicílio. ${storeName}.`,
};

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <>
      <header className="cat-header">
        <div className="ag-container">
          <span className="eyebrow">COLEÇÃO 2025 · PRATA 925</span>
          <h1>
            Catálogo
          </h1>
          <p>
            Passe o mouse sobre cada peça para ver de perto. Favoritas? Separe<br/>
            para experimentar em casa, sem compromisso.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: 60 }}>
        <div className="ag-container">
          <CategoryFilter products={products} />
        </div>
      </section>

      <section className="cat-foot">
        <div className="ag-container">
          <h2>
            Não encontrou o que <em style={{ fontStyle: "italic", color: "var(--tide)" }}>procurava</em>?
          </h2>
          <p>
            Nosso mostruário vai além do site. Chame no WhatsApp e levamos as peças até você.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Falar com a gente
          </a>
        </div>
      </section>
    </>
  );
}
