import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartByCode, getProductsByIds } from "@/lib/queries";
import { productThumbnail } from "@/lib/cloudinary";
import { CATEGORIES } from "@/types/product";

export const metadata: Metadata = {
  title: "Sacola compartilhada",
  robots: { index: false, follow: false },
};

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
    <section className="cart-page-wrapper">
      <div className="ag-container">
        <div className="cart-glass-card">
          <h1 className="cart-title">Sacola compartilhada</h1>
          <p className="cart-subtitle">
            Esta é a seleção de peças escolhidas. Você tem {products.length} {products.length === 1 ? "item" : "itens"} nesta lista.
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
                  className="cart-item-row"
                  style={{ opacity: unavailable ? 0.6 : 1 }}
                >
                  <div className="cart-item-thumb" style={{ width: 64, height: 64 }}>
                    <Image src={img} alt={p.name} fill sizes="64px" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="cart-item-info">
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tide)", fontWeight: 500 }}>
                      {categoryLabel}
                    </div>
                    <strong className="cart-item-name" style={{ fontSize: 18 }}>{p.name}</strong>
                    <div className="cart-item-spec">
                      {p.material || "Prata 925"} {p.ring_size ? ` · Aro ${p.ring_size}` : ""}
                    </div>
                  </div>
                  {unavailable && (
                    <span style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "#b00020", fontWeight: 600, padding: "6px 12px", background: "rgba(176,0,32,0.06)", borderRadius: 99 }}>
                      Indisponível
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/catalogo" className="btn btn-primary">
              Ver catálogo completo <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
