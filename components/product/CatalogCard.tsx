"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { productThumbnail } from "@/lib/cloudinary";

import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";

interface CatalogCardProps {
  product: Product;
  index?: number;
}

export default function CatalogCard({ product, index = 0 }: CatalogCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [hover, setHover] = useState(false);

  const imageSrc = product.thumbnail
    ? productThumbnail(product.thumbnail)
    : product.images[0]
      ? productThumbnail(product.images[0])
      : "/placeholder-product.jpg";

  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ??
    product.category;
  const specs = [product.material, product.ring_size ? `Aro ${product.ring_size}` : null]
    .filter(Boolean)
    .join(" · ");

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 14;
    const rx = -(y - 0.5) * 14;
    setTilt({ rx, ry, px: x * 100, py: y * 100 });
  }

  function onLeave() {
    setHover(false);
    setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
  }

  return (
    <Link
      ref={ref}
      href={`/catalogo/${product.slug}`}
      className={`cat-card ${hover ? "hover" : ""}`}
      style={{
        animationDelay: `${index * 0.06}s`,
        perspective: "1200px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      aria-label={`Ver ${product.name}`}
    >
      <div
        className="cat-card-scene"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        <div className="cat-card-bg" />
        <div
          className="cat-card-shine"
          style={{
            background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.6), transparent 50%)`,
          }}
        />

        {product.featured && <div className="cat-card-tag">Destaque</div>}

        <div className="cat-card-cta">
          Ver peça
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>

        <div className="cat-card-photo">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={400}
            sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="cat-card-shadow" />

        <div className="cat-card-meta">
          <div>
            <div className="cat-card-cat">{categoryLabel}</div>
            <div className="cat-card-name">{product.name}</div>
            {specs && <div className="cat-card-specs">{specs}</div>}
          </div>

        </div>
      </div>
    </Link>
  );
}
