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
      <div className="produto-stage">
        <div className="produto-stage-img">
          <p style={{ color: "var(--silver-deep)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
            Sem imagem disponível
          </p>
        </div>
      </div>
    );
  }

  const mainImage = productHero(images[selectedIndex]);

  return (
    <div className="produto-viewer">
      <div className="produto-stage">
        <svg className="produto-halo" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <radialGradient id="prodHalo" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(191,212,229,0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="180" fill="url(#prodHalo)" />
        </svg>
        <div className="produto-stage-img">
          <Image
            src={mainImage}
            alt={`${productName} imagem ${selectedIndex + 1}`}
            width={800}
            height={800}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedIndex === 0}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="produto-thumbs">
          {images.map((img, index) => {
            const thumbUrl = productGallery(img);
            return (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`prod-thumb ${index === selectedIndex ? "on" : ""}`}
                aria-label={`Ver imagem ${index + 1} de ${productName}`}
              >
                <Image
                  src={thumbUrl}
                  alt={`${productName} miniatura ${index + 1}`}
                  width={72}
                  height={72}
                  sizes="72px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
