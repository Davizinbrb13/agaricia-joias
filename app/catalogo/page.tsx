import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import CategoryFilter from "@/components/product/CategoryFilter";
import { getProducts } from "@/lib/queries";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Explore nosso catálogo completo de joias de prata 925. Anéis, colares, brincos, pulseiras e conjuntos com atendimento VIP em domicílio. ${storeName}.`,
};

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <SectionTitle
          title="Nosso Catálogo"
          subtitle="Explore nossa coleção de joias em prata 925. Cada peça é selecionada com carinho para você."
        />
        <CategoryFilter products={products} />
      </div>
    </div>
  );
}
