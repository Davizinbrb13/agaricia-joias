import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

// FASE 2: Inserir Google Analytics 4 e Meta Pixel aqui
// Usar next/script com strategy="afterInteractive"
// Importar no layout.tsx já está preparado

export default function Analytics() {
  return <VercelAnalytics />;
}
