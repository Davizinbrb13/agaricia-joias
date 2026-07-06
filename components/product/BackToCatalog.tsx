"use client";

import { useRouter } from "next/navigation";

interface BackToCatalogProps {
  className?: string;
  children: React.ReactNode;
}

/** Volta ao catálogo preservando o filtro: se houver histórico dentro do site,
 *  usa o "voltar" do navegador (que restaura a URL filtrada, ex: ?cat=anel&aro=20).
 *  Caso o usuário tenha caído direto na peça (ex: link do Google), vai ao catálogo. */
export default function BackToCatalog({ className, children }: BackToCatalogProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Deixa o comportamento normal para abrir em nova aba / com modificadores
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/catalogo");
    }
  }

  return (
    <a href="/catalogo" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
