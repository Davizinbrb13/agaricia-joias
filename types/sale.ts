import type { Product } from "./product";

export interface Sale {
  id: string;
  product_id: string;
  sold_at: string;
  description: string | null;
  created_at: string;
}

/** Venda com os dados da peça embutidos (para o painel e o CSV). */
export interface SaleWithProduct extends Sale {
  product: Pick<Product, "name" | "category"> | null;
}
