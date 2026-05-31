"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <section>
      <div className="ag-container" style={{ maxWidth: 380, padding: "80px 0" }}>
        <h1 className="produto-name" style={{ marginBottom: 24 }}>
          Painel da Agaricia
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
          {error && <p style={{ color: "#b00020" }}>{error}</p>}
        </form>
      </div>
    </section>
  );
}
