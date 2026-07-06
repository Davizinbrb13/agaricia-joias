"use client";

import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { has, add, remove } = useCart();
  const inCart = has(productId);

  return (
    <button
      type="button"
      className={`btn ${inCart ? "btn-ghost" : "btn-primary"}`}
      onClick={() => (inCart ? remove(productId) : add(productId))}
      aria-pressed={inCart}
    >
      {inCart ? "✓ Na sacola — remover" : "Adicionar à sacola"}
    </button>
  );
}
