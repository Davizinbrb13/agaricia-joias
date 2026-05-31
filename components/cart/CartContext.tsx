"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addId,
  removeId,
  readCart,
  writeCart,
  clearCart as clearStorage,
} from "@/lib/cart-storage";

interface CartContextValue {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  // hidrata do localStorage no cliente
  useEffect(() => {
    setIds(readCart());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    writeCart(next);
  }, []);

  const add = useCallback(
    (id: string) => persist(addId(readCart(), id)),
    [persist]
  );
  const remove = useCallback(
    (id: string) => persist(removeId(readCart(), id)),
    [persist]
  );
  const clear = useCallback(() => {
    clearStorage();
    setIds([]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <CartContext.Provider
      value={{ ids, count: ids.length, has, add, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
