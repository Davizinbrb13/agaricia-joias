"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/types/product";
import type { Product } from "@/types/product";
import CatalogCard from "./CatalogCard";

interface CategoryFilterProps {
  products: Product[];
}

export default function CategoryFilter({ products }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeRingSize, setActiveRingSize] = useState<string>("all");

  const ringSizes = useMemo(() => {
    return Array.from(
      new Set(
        products
          .filter((product) => isRing(product) && product.ring_size)
          .map((product) => product.ring_size as string)
      )
    ).sort((a, b) => {
      const numericA = Number(a.replace(",", "."));
      const numericB = Number(b.replace(",", "."));

      if (!Number.isNaN(numericA) && !Number.isNaN(numericB)) {
        return numericA - numericB;
      }

      return a.localeCompare(b, "pt-BR", { numeric: true });
    });
  }, [products]);

  useEffect(() => {
    if (activeCategory !== "anel") {
      setActiveRingSize("all");
    }
  }, [activeCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || categoryMatches(product, activeCategory);
    const matchesRingSize =
      activeRingSize === "all" ||
      (isRing(product) && product.ring_size === activeRingSize);

    return matchesCategory && matchesRingSize;
  });

  const showRingSizes = ringSizes.length > 0 && activeCategory === "anel";

  return (
    <>
      <div className="cat-controls-shell">
        <div className="cat-controls">
          <div className="cat-filters" aria-label="Filtrar por categoria">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`cat-filter ${activeCategory === "all" ? "on" : ""}`}
              aria-pressed={activeCategory === "all"}
            >
              Tudo
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`cat-filter ${activeCategory === cat.value ? "on" : ""}`}
                aria-pressed={activeCategory === cat.value}
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

        {showRingSizes && (
          <div className="cat-ring-filter" aria-label="Filtrar aneis por numero">
            <div className="cat-ring-filter-head">
              <span>Numero do anel</span>
              <strong>{activeRingSize === "all" ? "todos" : activeRingSize}</strong>
            </div>
            <div className="cat-ring-sizes">
              <button
                type="button"
                onClick={() => setActiveRingSize("all")}
                className={`cat-ring-size ${activeRingSize === "all" ? "on" : ""}`}
                aria-pressed={activeRingSize === "all"}
              >
                Todos
              </button>
              {ringSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setActiveCategory("anel");
                    setActiveRingSize(size);
                  }}
                  className={`cat-ring-size ${activeRingSize === size ? "on" : ""}`}
                  aria-label={`Filtrar aneis numero ${size}`}
                  aria-pressed={activeRingSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="cat-empty">
          <p>Nenhuma peça encontrada com esses filtros.</p>
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

function categoryMatches(product: Product, activeCategory: string) {
  const dbCat = (product.category || "").toLowerCase().trim();

  return (
    dbCat === activeCategory ||
    dbCat === activeCategory + "s" ||
    dbCat === activeCategory + "es" ||
    (activeCategory === "anel" && dbCat === "aneis") ||
    (activeCategory === "pingente" && dbCat === "pingentes") ||
    (activeCategory === "pulseira" &&
      (dbCat === "bracelete" || dbCat === "braceletes"))
  );
}

function isRing(product: Product) {
  return categoryMatches(product, "anel");
}
