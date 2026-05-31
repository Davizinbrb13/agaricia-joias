"use client";

import { useState } from "react";
import { CATEGORIES } from "@/types/product";
import { createProduct } from "@/lib/admin-queries";
import { uploadProductImage } from "@/lib/cloudinary-upload";

export default function NewProductForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].value);
  const [material, setMaterial] = useState("Prata 925");
  const [ringSize, setRingSize] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Escolha uma foto da peça.");
      return;
    }
    setSaving(true);
    try {
      const imageId = await uploadProductImage(file);
      const ok = await createProduct({
        name: name.trim(),
        price: price ? Number(price) : null,
        category,
        material: material.trim() || null,
        ring_size: category === "anel" && ringSize ? ringSize.trim() : null,
        description: description.trim() || null,
        imageId,
        featured,
      });
      if (!ok) throw new Error("Falha ao salvar a peça.");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar a peça.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)", width: "100%" } as const;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, padding: 20, border: "1px solid rgba(15,36,68,0.2)", borderRadius: 12, marginBottom: 20 }}
    >
      <input style={inputStyle} placeholder="Nome da peça" value={name} onChange={(e) => setName(e.target.value)} required />
      <input style={inputStyle} type="number" step="0.01" placeholder="Preço (opcional)" value={price} onChange={(e) => setPrice(e.target.value)} />
      <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input style={inputStyle} placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
      {category === "anel" && (
        <input style={inputStyle} placeholder="Número do aro (ex.: 16)" value={ringSize} onChange={(e) => setRingSize(e.target.value)} />
      )}
      <textarea style={inputStyle} rows={3} placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Destaque na home
      </label>
      <label style={{ fontSize: 14 }}>
        Foto da peça
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ display: "block", marginTop: 6 }} />
      </label>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Salvando…" : "Salvar peça"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
    </form>
  );
}
