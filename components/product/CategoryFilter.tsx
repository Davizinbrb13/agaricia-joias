"use client";

import { useState } from "react";
import { CATEGORIES } from "@/types/product";
import type { Product } from "@/types/product";
import CatalogCard from "./CatalogCard";

interface CategoryFilterProps {
  products: Product[];
}

export default function CategoryFilter({ products }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) => {
            const dbCat = (p.category || "").toLowerCase().trim();
            return (
              dbCat === activeCategory ||
              dbCat === activeCategory + "s" ||
              dbCat === activeCategory + "es" ||
              (activeCategory === "anel" && dbCat === "aneis") ||
              (activeCategory === "pingente" && dbCat === "pingentes") ||
              (activeCategory === "pulseira" && (dbCat === "bracelete" || dbCat === "braceletes"))
            );
          }
        );

  return (
    <>
      <div className="cat-controls">
        <div className="cat-filters">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`cat-filter ${activeCategory === "all" ? "on" : ""}`}
          >
            Tudo
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`cat-filter ${activeCategory === cat.value ? "on" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="cat-count">
          <span>{String(filteredProducts.length).padStart(2, "0")}</span>
          {filteredProducts.length === 1 ? "peça" : "peças"}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="cat-empty">
          <p>Nenhuma peça encontrada nesta categoria.</p>
        </div>
      ) : (
        <div className="cat-grid">
          {filteredProducts.map((product, i) => (
            <CatalogCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
