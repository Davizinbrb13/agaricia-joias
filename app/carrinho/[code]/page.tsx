import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartByCode, getProductsByIds } from "@/lib/queries";
import { productThumbnail } from "@/lib/cloudinary";
import { CATEGORIES } from "@/types/product";

export const metadata: Metadata = {
  title: "Carrinho compartilhado",
  robots: { index: false, follow: false },
};

// sempre dinâmico: cada link é único e raramente acessado
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

export default async function SharedCartPage({ params }: Props) {
  const { code } = await params;
  const cart = await getCartByCode(code);

  if (!cart) {
    notFound();
  }

  const products = await getProductsByIds(cart.product_ids);

  return (
    <section>
      <div className="ag-container" style={{ padding: "48px 0" }}>
        <h1 className="produto-name">Peças selecionadas</h1>
        <p style={{ marginBottom: 24 }}>
          {products.length} {products.length === 1 ? "peça" : "peças"} neste carrinho.
        </p>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {products.map((p) => {
            const img = p.thumbnail
              ? productThumbnail(p.thumbnail)
              : p.images[0]
                ? productThumbnail(p.images[0])
                : "/placeholder-product.jpg";
            const categoryLabel =
              CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category;
            const unavailable = p.status !== "disponivel";
            return (
              <li
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 12,
                  border: "1px solid rgba(15,36,68,0.15)",
                  borderRadius: 12,
                  opacity: unavailable ? 0.6 : 1,
                }}
              >
                <Image src={img} alt={p.name} width={72} height={72} sizes="72px" style={{ borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--tide, #3a6ea5)" }}>{categoryLabel}</div>
                  <strong>{p.name}</strong>
                  {p.ring_size && <div style={{ fontSize: 13 }}>Aro {p.ring_size}</div>}
                  {unavailable && (
                    <div style={{ fontSize: 13, color: "#b00020", marginTop: 4 }}>
                      Essa peça não está mais disponível
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 32 }}>
          <Link href="/catalogo" className="btn btn-ghost">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
