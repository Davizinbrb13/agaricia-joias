import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="section-padding min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <span className="text-7xl mb-6 block">✨</span>
        <h2 className="font-serif text-4xl text-brand-dark mb-4">
          Página não encontrada
        </h2>
        <p className="text-brand-muted mb-8 leading-relaxed">
          Parece que essa página não existe. Que tal voltar ao início e explorar
          nossas joias?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/" variant="primary" size="lg">
            Voltar ao Início
          </Button>
          <Button href="/catalogo" variant="outline" size="lg">
            Ver Catálogo
          </Button>
        </div>
      </div>
    </div>
  );
}
