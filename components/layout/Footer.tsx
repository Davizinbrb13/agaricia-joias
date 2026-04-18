import Link from "next/link";
import AgariciaMark from "@/components/ui/AgariciaMark";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5522981584686";

export default function Footer() {
  return (
    <footer className="ag-footer">
      <div className="footer-top ag-container">
        <div className="footer-brand">
          <AgariciaMark size={56} color="var(--foam)" />
          <div>
            <div className="footer-brand-name">AGARICIA</div>
            <div className="footer-brand-sub">JOIAS · PRATA 925</div>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h5>Navegar</h5>
            <Link href="/">Início</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contato">Contato</Link>
          </div>
          <div>
            <h5>Atendimento</h5>
            {/* Informações de texto simples — sem href pois não são links */}
            <span className="footer-info">Araruama · RJ</span>
            <span className="footer-info">Região dos Lagos</span>
            <span className="footer-info">Seg a Sáb · 9h às 18h</span>
          </div>
          <div>
            <h5>VIP em domicílio</h5>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/agaricia.joias"
              target="_blank"
              rel="noopener noreferrer"
            >
              @agaricia.joias
            </a>
            <a href="mailto:contato@agaricia.com.br">
              contato@agaricia.com.br
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bot ag-container">
        <span>© {new Date().getFullYear()} Agaricia Joias</span>
        <span className="footer-tag">Feito à beira-mar, na Região dos Lagos</span>
      </div>
    </footer>
  );
}
