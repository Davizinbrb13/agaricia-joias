import { cache } from "react";
import { supabase } from "./supabase";
import type { Product } from "@/types/product";

/** Busca todos os produtos disponíveis — featured primeiro, depois por data */
export const getProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
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
    .eq("available", true)
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
      .eq("available", true)
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
      .eq("available", true)
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
    .eq("available", true);

  if (error) {
    console.error("Erro ao buscar slugs:", error);
    return [];
  }

  return data?.map((p) => p.slug) ?? [];
});
