"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  getAllProductsAdmin,
  setProductStatus,
  recordSale,
} from "@/lib/admin-queries";
import type { Product } from "@/types/product";
import ProductRow from "./ProductRow";
import NewProductForm from "./NewProductForm";
import SellModal from "./SellModal";
import SalesPanel from "./SalesPanel";

type Tab = "pecas" | "vendas";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pecas");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selling, setSelling] = useState<Product | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setProducts(await getAllProductsAdmin());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeactivate(id: string) {
    setBusyId(id);
    setActionError(null);
    const ok = await setProductStatus(id, "inativa");
    if (!ok) setActionError("Não consegui desativar a peça. Tente de novo.");
    await load();
    setBusyId(null);
  }

  async function handleReactivate(id: string) {
    setBusyId(id);
    setActionError(null);
    const ok = await setProductStatus(id, "disponivel");
    if (!ok) setActionError("Não consegui reativar a peça. Tente de novo.");
    await load();
    setBusyId(null);
  }

  async function handleConfirmSale(description: string | null) {
    if (!selling) return;
    const id = selling.id;
    setBusyId(id);
    setActionError(null);
    const ok = await recordSale(id, description);
    if (!ok) {
      setActionError(
        "A venda pode não ter sido registrada por completo. Confira o status da peça."
      );
    }
    setSelling(null);
    await load();
    setBusyId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <section>
      <div className="ag-container" style={{ padding: "40px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 className="produto-name">Painel</h1>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button type="button" className={`btn ${tab === "pecas" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("pecas")}>
            Peças
          </button>
          <button type="button" className={`btn ${tab === "vendas" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("vendas")}>
            Balanço de vendas
          </button>
        </div>

        {tab === "pecas" && (
          <>
            {actionError && (
              <p style={{ color: "#b00020", marginBottom: 16 }}>{actionError}</p>
            )}
            <div style={{ marginBottom: 20 }}>
              <button type="button" className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Fechar" : "+ Nova peça"}
              </button>
            </div>

            {showForm && (
              <NewProductForm
                onCreated={async () => {
                  setShowForm(false);
                  await load();
                }}
              />
            )}

            {loading ? (
              <p>Carregando peças…</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, marginTop: 20 }}>
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    busy={busyId === p.id}
                    onDeactivate={handleDeactivate}
                    onReactivate={handleReactivate}
                    onSell={setSelling}
                  />
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "vendas" && <SalesPanel />}
      </div>

      {selling && (
        <SellModal
          product={selling}
          onCancel={() => setSelling(null)}
          onConfirm={handleConfirmSale}
        />
      )}
    </section>
  );
}
