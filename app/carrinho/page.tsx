"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { getProductsByIds, createCart } from "@/lib/queries";
import { generateCartCode } from "@/lib/cart-code";
import { productThumbnail } from "@/lib/cloudinary";
import type { Product } from "@/types/product";

export default function CarrinhoPage() {
  const { ids, remove } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductsByIds(ids).then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [ids]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    const code = generateCartCode();
    const cart = await createCart(ids, code);
    setGenerating(false);
    if (!cart) {
      setError("Não consegui gerar o link agora. Tente de novo em instantes.");
      return;
    }
    setLink(`${window.location.origin}/carrinho/${cart.code}`);
  }

  if (loading) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "60px 0" }}>
          <p>Carregando seu carrinho…</p>
        </div>
      </section>
    );
  }

  if (ids.length === 0) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "60px 0", textAlign: "center" }}>
          <h1 className="produto-name">Seu carrinho está vazio</h1>
          <p>Volte ao catálogo e separe as peças que você quer experimentar.</p>
          <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: 16 }}>
            Ver catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="ag-container" style={{ padding: "48px 0" }}>
        <h1 className="produto-name">Minhas peças favoritas</h1>
        <p style={{ marginBottom: 24 }}>
          Separe as peças e gere um link para enviar no WhatsApp. A gente leva
          exatamente essas peças até você.
        </p>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {products.map((p) => {
            const img = p.thumbnail
              ? productThumbnail(p.thumbnail)
              : p.images[0]
                ? productThumbnail(p.images[0])
                : "/placeholder-product.jpg";
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
                }}
              >
                <Image src={img} alt={p.name} width={64} height={64} style={{ borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <strong>{p.name}</strong>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => remove(p.id)}>
                  Remover
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 32 }}>
          {link ? (
            <div
              style={{
                padding: 20,
                border: "1px solid rgba(15,36,68,0.2)",
                borderRadius: 12,
              }}
            >
              <p style={{ marginBottom: 12 }}>
                <strong>Pronto!</strong> Copie e envie este link no WhatsApp:
              </p>
              <input
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                style={{ width: "100%", padding: 10, borderRadius: 8, marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigator.clipboard?.writeText(link)}
                >
                  Copiar link
                </button>
                <a
                  className="btn btn-primary"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Oi! Separei minhas peças favoritas: ${link}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? "Gerando…" : "Gerar link para enviar"}
              </button>
              {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
