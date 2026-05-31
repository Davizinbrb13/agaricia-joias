"use client";

import { useState } from "react";
import { getSalesForMonth } from "@/lib/admin-queries";
import { salesToCsv, formatSaleDate } from "@/lib/sales-export";
import type { SaleWithProduct } from "@/types/sale";
import { CATEGORIES } from "@/types/product";

export default function SalesPanel() {
  // Avaliado na montagem (não no load do módulo) para não congelar a data.
  const [year, setYear] = useState(() => new Date().getUTCFullYear());
  const [month, setMonth] = useState(() => new Date().getUTCMonth() + 1);
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getSalesForMonth(year, month);
    setSales(data);
    setLoaded(true);
    setLoading(false);
  }

  function download() {
    const csv = salesToCsv(sales);
    // BOM para o Excel abrir acentos corretamente
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `balanco-${year}-${String(month).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputStyle = { padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" } as const;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        <input style={inputStyle} type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Mês" />
        <input style={inputStyle} type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Ano" />
        <button type="button" className="btn btn-primary" onClick={load} disabled={loading}>
          {loading ? "Buscando…" : "Buscar vendas"}
        </button>
        {loaded && sales.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={download}>
            Exportar planilha (CSV)
          </button>
        )}
      </div>

      {loaded && sales.length === 0 && <p>Nenhuma venda nesse mês.</p>}

      {sales.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {sales.map((s) => {
            const catLabel = CATEGORIES.find((c) => c.value === s.product?.category)?.label ?? s.product?.category ?? "";
            return (
              <li key={s.id} style={{ padding: 12, border: "1px solid rgba(15,36,68,0.15)", borderRadius: 12 }}>
                <strong>{s.product?.name ?? "(peça removida)"}</strong>
                <div style={{ fontSize: 13 }}>
                  {catLabel} · {formatSaleDate(s.sold_at)}
                </div>
                {s.description && <div style={{ fontSize: 13, marginTop: 4 }}>{s.description}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
