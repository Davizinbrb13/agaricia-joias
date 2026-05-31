"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { productThumbnail } from "@/lib/cloudinary";

const STATUS_LABEL: Record<Product["status"], string> = {
  disponivel: "Disponível",
  inativa: "Inativa",
  vendida: "Vendida",
};

interface Props {
  product: Product;
  busy: boolean;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
  onSell: (product: Product) => void;
}

export default function ProductRow({
  product,
  busy,
  onDeactivate,
  onReactivate,
  onSell,
}: Props) {
  const img = product.thumbnail
    ? productThumbnail(product.thumbnail)
    : product.images[0]
      ? productThumbnail(product.images[0])
      : "/placeholder-product.jpg";

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 12,
        border: "1px solid rgba(15,36,68,0.15)",
        borderRadius: 12,
      }}
    >
      <Image src={img} alt={product.name} width={56} height={56} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ display: "block" }}>{product.name}</strong>
        <span style={{ fontSize: 13 }}>{STATUS_LABEL[product.status]}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {product.status === "disponivel" && (
          <>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => onDeactivate(product.id)}>
              Desativar
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onSell(product)}>
              Vendido
            </button>
          </>
        )}
        {/* Reativar vale tanto para inativa quanto para vendida: a venda é um
            evento permanente em `sales`, mas a peça pode voltar ao catálogo se
            a dona conseguir outra igual. */}
        {product.status !== "disponivel" && (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onReactivate(product.id)}>
            Reativar
          </button>
        )}
      </div>
    </li>
  );
}
