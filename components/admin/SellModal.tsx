"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  onCancel: () => void;
  onConfirm: (description: string | null) => void;
}

const MAX = 150;

export default function SellModal({ product, onCancel, onConfirm }: Props) {
  const [description, setDescription] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,36,68,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        padding: 16,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420 }}>
        <h2 style={{ marginBottom: 8 }}>Registrar venda</h2>
        <p style={{ marginBottom: 16 }}>{product.name}</p>

        <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
          Descrição da venda (opcional)
        </label>
        <textarea
          value={description}
          maxLength={MAX}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Ex.: vendido à vista por 180, com brinde"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
        />
        <div style={{ fontSize: 12, textAlign: "right", marginBottom: 16 }}>
          {description.length}/{MAX}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm(description.trim() || null)}
          >
            Confirmar venda
          </button>
        </div>
      </div>
    </div>
  );
}
