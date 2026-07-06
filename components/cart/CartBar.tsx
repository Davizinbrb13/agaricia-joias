"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import BagIcon from "@/components/ui/BagIcon";

export default function CartBar() {
  const { count } = useCart();
  if (count === 0) return null;

  return (
    <Link
      href="/carrinho"
      aria-label={`Ver sacola com ${count} peças`}
      style={{
        position: "fixed",
        left: "50%",
        bottom: 20,
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 22px",
        borderRadius: 999,
        background: "var(--ink, #0f2444)",
        color: "var(--sand, #f4ebd8)",
        textDecoration: "none",
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(15,36,68,0.35)",
      }}
    >
      <BagIcon size={18} strokeWidth={1.7} />
      <span>Ver sacola</span>
      <span
        style={{
          minWidth: 24,
          height: 24,
          borderRadius: 999,
          background: "var(--sand, #f4ebd8)",
          color: "var(--ink, #0f2444)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          padding: "0 6px",
        }}
      >
        {count}
      </span>
    </Link>
  );
}
