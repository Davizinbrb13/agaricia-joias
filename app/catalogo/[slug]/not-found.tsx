import Button from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <div className="section-padding">
      <div className="container-narrow text-center">
        <div className="max-w-md mx-auto">
          <span className="text-6xl mb-6 block">💍</span>
          <h2 className="font-serif text-3xl text-brand-dark mb-4">
            Produto não encontrado
          </h2>
          <p className="text-brand-muted mb-8 leading-relaxed">
            Este produto pode ter sido removido ou o link está incorreto.
            Que tal explorar nosso catálogo?
          </p>
          <Button href="/catalogo" variant="primary" size="lg">
            Ver Catálogo
          </Button>
        </div>
      </div>
    </div>
  );
}
