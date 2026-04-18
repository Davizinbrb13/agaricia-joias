import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-padding min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        {/* Ícone SVG — mais consistente que emoji entre OSes */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="mx-auto mb-6"
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="36" stroke="var(--ocean)" strokeWidth="1.2" opacity="0.35" />
          <circle cx="40" cy="40" r="24" stroke="var(--ocean)" strokeWidth="0.8" opacity="0.2" />
          {/* Sparkle / star shape */}
          <path
            d="M40 24 L42 36 L54 38 L42 40 L44 52 L40 42 L36 52 L38 40 L26 38 L38 36 Z"
            stroke="var(--ocean)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill="none"
            opacity="0.6"
          />
          <circle cx="40" cy="38" r="3" fill="var(--ocean)" opacity="0.5" />
        </svg>

        <h2 className="font-serif text-4xl text-brand-dark mb-4">
          Página não encontrada
        </h2>
        <p className="text-brand-muted mb-8 leading-relaxed">
          Parece que essa página não existe. Que tal voltar ao início e explorar
          nossas joias?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            Voltar ao Início
          </Link>
          <Link href="/catalogo" className="btn btn-ghost">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
