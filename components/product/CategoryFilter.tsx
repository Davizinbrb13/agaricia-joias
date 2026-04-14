"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/types/product";
import type { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

interface CategoryFilterProps {
  products: Product[];
}

export default function CategoryFilter({ products }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Only show categories that have products
  const availableCategories = CATEGORIES.filter((cat) =>
    products.some((p) => p.category === cat.value)
  );

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 min-h-[44px]",
            activeCategory === "all"
              ? "bg-brand-primary text-white shadow-md"
              : "bg-brand-secondary/20 text-brand-dark hover:bg-brand-secondary/40"
          )}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 min-h-[44px]",
              activeCategory === cat.value
                ? "bg-brand-primary text-white shadow-md"
                : "bg-brand-secondary/20 text-brand-dark hover:bg-brand-secondary/40"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-brand-muted mb-6 text-center">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>

      {/* Product grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
