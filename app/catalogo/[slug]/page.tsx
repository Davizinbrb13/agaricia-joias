import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import CatalogCard from "@/components/product/CatalogCard";
import JsonLd from "@/components/seo/JsonLd";
import { getProductBySlug, getRelatedProducts, getAllSlugs } from "@/lib/queries";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import { ogImage } from "@/lib/cloudinary";

import { CATEGORIES } from "@/types/product";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
  const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
  const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

  const title = product.meta_title ?? `${product.name} | ${storeName}`;
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
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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

      <section>
        <div className="ag-container">
          <div className="produto-inner">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="produto-info">
              <Link href="/catalogo" className="produto-back">
                ← voltar ao catálogo
              </Link>



              <h1 className="produto-name">{product.name}</h1>



              {product.description && (
                <p className="produto-desc">{product.description}</p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="produto-tags">
                  {product.tags.map((tag) => (
                    <span key={tag} className="produto-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="produto-actions">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Quero saber mais
                </a>
                <Link href="/catalogo" className="btn btn-ghost">
                  Ver catálogo
                </Link>
              </div>

              <ul className="produto-specs">
                <li>
                  <strong>Material</strong>
                  <span>{product.material || "Prata 925"}</span>
                </li>
                <li>
                  <strong>Categoria</strong>
                  <span>{categoryLabel}</span>
                </li>
                <li>
                  <strong>Atendimento</strong>
                  <span>VIP em domicílio</span>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="produto-related">
          <div className="ag-container">
            <div className="produto-related-head" style={{ textAlign: "center" }}>
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                Você também pode gostar
              </span>
              <h2>
                Mais peças da categoria{" "}
                <em style={{ fontStyle: "italic", color: "var(--tide)" }}>
                  {categoryLabel.toLowerCase()}
                </em>
              </h2>
            </div>
            <div className="cat-grid">
              {relatedProducts.map((p, i) => (
                <CatalogCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
