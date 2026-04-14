import Link from "next/link";
import Image from "next/image";
import { productThumbnail } from "@/lib/cloudinary";
import ProductPrice from "./ProductPrice";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.thumbnail
    ? productThumbnail(product.thumbnail)
    : product.images[0]
      ? productThumbnail(product.images[0])
      : "/placeholder-product.jpg";

  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ??
    product.category;

  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="group block glass-card overflow-hidden hover-lift hover-glow"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && <Badge variant="featured">Destaque</Badge>}
          <Badge variant="category">{categoryLabel}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg text-brand-dark group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>
        {product.material && (
          <p className="mt-1 text-xs text-brand-muted">{product.material}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <ProductPrice price={product.price} className="text-base" />
          <span className="text-xs text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ver mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
