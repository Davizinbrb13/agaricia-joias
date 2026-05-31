"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setReady(true);
      }
    });

    // Se a sessão expirar/encerrar com o painel aberto, volta pro login
    // (evita mutações que falhariam silenciosamente na RLS).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/admin/login");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  if (!ready) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "80px 0" }}>
          <p>Verificando acesso…</p>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}
