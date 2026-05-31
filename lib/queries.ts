import { cache } from "react";
import { supabase } from "./supabase";
import type { Product } from "@/types/product";
import type { Cart } from "@/types/cart";

/** Busca todos os produtos disponíveis — featured primeiro, depois por data */
export const getProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "disponivel")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return (data as Product[]) ?? [];
});

/** Busca produtos em destaque (featured = true) */
export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "disponivel")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Erro ao buscar destaques:", error);
    return [];
  }

  return (data as Product[]) ?? [];
});

/** Busca um produto pelo slug */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "disponivel")
      .single();

    if (error) {
      return null;
    }

    return data as Product;
  }
);

/** Busca produtos da mesma categoria (excluindo um ID específico) */
export const getRelatedProducts = cache(
  async (category: string, excludeId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "disponivel")
      .eq("category", category)
      .neq("id", excludeId)
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Erro ao buscar relacionados:", error);
      return [];
    }

    return (data as Product[]) ?? [];
  }
);

/** Busca todos os slugs para generateStaticParams */
export const getAllSlugs = cache(async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "disponivel");

  if (error) {
    console.error("Erro ao buscar slugs:", error);
    return [];
  }

  return data?.map((p) => p.slug) ?? [];
});

/** Busca peças por uma lista de IDs — SEM filtrar status (o carrinho mostra
 *  peças mesmo se ficaram indisponíveis). Reordena para casar com a ordem dos ids. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Erro ao buscar peças do carrinho:", error);
    return [];
  }

  const byId = new Map((data as Product[]).map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

/** Busca um carrinho pelo código do link compartilhado. */
export async function getCartByCode(code: string): Promise<Cart | null> {
  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("code", code)
    .single();

  if (error) {
    return null;
  }

  return data as Cart;
}

/** Cria um carrinho compartilhável (1 gravação). Retorna o cart criado. */
export async function createCart(
  productIds: string[],
  code: string
): Promise<Cart | null> {
  const { data, error } = await supabase
    .from("carts")
    .insert({ code, product_ids: productIds })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar carrinho:", error);
    return null;
  }

  return data as Cart;
}
