import type { Metadata, Viewport } from "next";
import { inter, cormorant } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OceanBackground from "@/components/layout/OceanBackground";
import Analytics from "@/components/Analytics";
import "./globals.css";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

export const metadata: Metadata = {
  title: {
    default: `${storeName} | Joias de Prata 925 | ${city}, ${state}`,
    template: `%s | ${storeName}`,
  },
  description: `Joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}. Conheça nosso catálogo e agende uma visita.`,
  keywords: [
    "joias de prata",
    "prata 925",
    "joalheria",
    city,
    "Região dos Lagos",
    state,
    "atendimento em domicílio",
    "joias femininas",
  ],
  authors: [{ name: storeName }],
  creator: storeName,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: storeName,
    title: `${storeName} | Joias de Prata 925`,
    description: `Joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2444",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <body style={{ minHeight: "100vh" }}>
        <OceanBackground />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
