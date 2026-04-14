"use client";

import { useState } from "react";
import Image from "next/image";
import { productHero, productGallery } from "@/lib/cloudinary";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-brand-secondary/10 rounded-2xl flex items-center justify-center">
        <p className="text-brand-muted">Sem imagem disponível</p>
      </div>
    );
  }

  const mainImage = productHero(images[selectedIndex]);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
        <Image
          src={mainImage}
          alt={`${productName} — imagem ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => {
            const thumbUrl = productGallery(img);
            return (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedIndex
                    ? "border-brand-primary shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`Ver imagem ${index + 1} de ${productName}`}
              >
                <Image
                  src={thumbUrl}
                  alt={`${productName} — miniatura ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
