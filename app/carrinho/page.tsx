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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLink(null);
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

  function handleCopy() {
    if (!link) return;
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // SKELETON LOADING UI (Luxury Shimmer Skeletons)
  if (loading) {
    return (
      <section className="cart-page-wrapper">
        <div className="ag-container">
          <div className="cart-glass-card">
            <div className="skeleton w-48 h-10 mb-4" />
            <div className="skeleton w-72 h-4 mb-8" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-brand-ink/5 rounded-xl">
                  <div className="skeleton w-16 h-16 rounded-lg" />
                  <div className="flex-1">
                    <div className="skeleton w-1/3 h-5 mb-2" />
                    <div className="skeleton w-1/4 h-4" />
                  </div>
                  <div className="skeleton w-20 h-9 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // EMPTY STATE UI
  if (ids.length === 0) {
    return (
      <section className="cart-page-wrapper">
        <div className="ag-container">
          <div className="cart-glass-card text-center" style={{ padding: "60px 40px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--tide)" strokeWidth="1.2">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="cart-title">Sua sacola está vazia</h1>
            <p className="cart-subtitle" style={{ maxWidth: 460, margin: "0 auto 32px" }}>
              Explore nosso catálogo e separe as peças que você deseja experimentar em domicílio, sem compromisso.
            </p>
            <Link href="/catalogo" className="btn btn-primary">
              Ver catálogo <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page-wrapper">
      <div className="ag-container">
        <div className="cart-glass-card">
          <h1 className="cart-title">Peças favoritas</h1>
          <p className="cart-subtitle">
            Separe as peças e gere um link único para enviar pelo WhatsApp. Nós levaremos exatamente esse mostruário até você.
          </p>

          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
            {products.map((p) => {
              const img = p.thumbnail
                ? productThumbnail(p.thumbnail)
                : p.images[0]
                  ? productThumbnail(p.images[0])
                  : "/placeholder-product.jpg";
              return (
                <li key={p.id} className="cart-item-row">
                  <div className="cart-item-thumb" style={{ width: 64, height: 64 }}>
                    <Image src={img} alt={p.name} fill sizes="64px" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="cart-item-info">
                    <strong className="cart-item-name">{p.name}</strong>
                    <div className="cart-item-spec">
                      {p.material || "Prata 925"} {p.ring_size ? ` · Aro ${p.ring_size}` : ""}
                    </div>
                  </div>
                  <button type="button" className="cart-remove-btn" onClick={() => remove(p.id)}>
                    Remover
                  </button>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: 36 }}>
            {link ? (
              <div className="cart-share-box">
                <p style={{ marginBottom: 12, fontWeight: 500, color: "var(--ink)" }}>
                  💡 Pronto! Copie o link abaixo para enviar:
                </p>
                <input
                  readOnly
                  value={link}
                  onFocus={(e) => e.currentTarget.select()}
                  className="cart-share-input"
                />
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCopy}
                    style={{ transition: "all 0.3s", borderColor: copied ? "var(--tide)" : "" }}
                  >
                    {copied ? "✓ Copiado!" : "Copiar link"}
                  </button>
                  <a
                    className="btn btn-primary btn-whatsapp-pulse"
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Oi! Separei minhas peças favoritas da Agaricia no site: ${link}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enviar no WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{ minWidth: 200 }}
                >
                  {generating ? "Gerando link…" : "Gerar link da sacola"}
                </button>
                {error && <p style={{ color: "#b00020", marginTop: 12, fontSize: 14 }}>{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
