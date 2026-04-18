import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="section-padding min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        {/* Ícone SVG de anel — mais consistente que emoji entre plataformas */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="mx-auto mb-6"
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="36" stroke="var(--ocean)" strokeWidth="1.2" opacity="0.3" />
          {/* Ring shape */}
          <circle cx="40" cy="40" r="20" stroke="var(--ocean)" strokeWidth="3" fill="none" opacity="0.5" />
          <circle cx="40" cy="40" r="13" stroke="var(--ocean)" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Gem at top */}
          <path d="M37 22 L40 18 L43 22 L40 26 Z" stroke="var(--ocean)" strokeWidth="1.2" fill="none" opacity="0.6" />
        </svg>

        <h2 className="font-serif text-3xl text-brand-dark mb-4">
          Produto não encontrado
        </h2>
        <p className="text-brand-muted mb-8 leading-relaxed">
          Este produto pode ter sido removido ou o link está incorreto.
          Que tal explorar nosso catálogo?
        </p>
        <Link href="/catalogo" className="btn btn-primary">
          Ver Catálogo
        </Link>
      </div>
    </div>
  );
}
