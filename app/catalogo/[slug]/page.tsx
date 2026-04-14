import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import ProductPrice from "@/components/product/ProductPrice";
import ProductGallery from "@/components/product/ProductGallery";
import ProductGrid from "@/components/product/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getProductBySlug, getRelatedProducts, getAllSlugs } from "@/lib/queries";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import { ogImage } from "@/lib/cloudinary";
import { CATEGORIES } from "@/types/product";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
  const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
  const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

  const title = product.meta_title ?? `${product.name} — ${storeName}`;
  const description =
    product.meta_description ??
    `${product.name} em ${product.material}. Atendimento VIP em domicílio em ${city}, ${state}. Conheça nossa coleção de joias de prata 925.`;

  const imageUrl = product.images[0] ? ogImage(product.images[0]) : undefined;

  return {
    title,
    description: description.substring(0, 155),
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);
  const whatsAppUrl = getProductWhatsAppUrl(product.name);

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ??
    product.category;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => ogImage(img)),
    brand: { "@type": "Brand", name: storeName },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: product.price.toString(),
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: storeName },
      },
    }),
  };

  return (
    <>
      <JsonLd data={productSchema} />

      {/* Override global WhatsApp button with product-specific message */}
      <WhatsAppButton productName={product.name} />

      <div className="section-padding">
        <div className="container-narrow">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-brand-muted mb-8 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-brand-primary transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/catalogo"
              className="hover:text-brand-primary transition-colors"
            >
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-brand-dark font-medium truncate">
              {product.name}
            </span>
          </nav>

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="category">{categoryLabel}</Badge>
                {product.featured && (
                  <Badge variant="featured">Destaque</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <ProductPrice
                  price={product.price}
                  className="text-2xl sm:text-3xl"
                />
              </div>

              {product.material && (
                <div className="flex items-center gap-2 text-sm text-brand-muted mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                  </svg>
                  {product.material}
                </div>
              )}

              {product.description && (
                <p className="text-brand-dark/70 leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-brand-muted bg-brand-secondary/10 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  href={whatsAppUrl}
                  variant="whatsapp"
                  size="lg"
                  external
                  className="flex-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Quero Saber Mais
                </Button>
                <Button href="/catalogo" variant="outline" size="lg">
                  Ver Catálogo
                </Button>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <SectionTitle
                title="Outros Produtos"
                subtitle={`Mais peças da categoria ${categoryLabel}`}
              />
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
