import { supabase } from "./supabase";
import { uniqueSlug } from "./slug";
import { generateCartCode } from "./cart-code";
import type { Product, ProductStatus } from "@/types/product";
import type { SaleWithProduct } from "@/types/sale";

/** Lista TODAS as peças (qualquer status) para o painel. */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar peças (admin):", error);
    return [];
  }
  return (data as Product[]) ?? [];
}

/** Muda o status de uma peça (sem registrar venda). */
export async function setProductStatus(
  id: string,
  status: ProductStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id);
  if (error) console.error("Erro ao mudar status:", error);
  return !error;
}

/** Marca como vendida E registra o evento de venda (com descrição opcional). */
export async function recordSale(
  productId: string,
  description: string | null
): Promise<boolean> {
  const { error: saleError } = await supabase
    .from("sales")
    .insert({ product_id: productId, description: description || null });
  if (saleError) {
    console.error("Erro ao registrar venda:", saleError);
    return false;
  }
  return setProductStatus(productId, "vendida");
}

export interface NewProductInput {
  name: string;
  price: number | null;
  category: string;
  material: string | null;
  ring_size: string | null;
  description: string | null;
  imageId: string; // public_id do Cloudinary
  featured: boolean;
}

/** Cria uma peça nova (entra como disponível). */
export async function createProduct(input: NewProductInput): Promise<boolean> {
  const slug = uniqueSlug(input.name, generateCartCode(4));
  const { error } = await supabase.from("products").insert({
    name: input.name,
    slug,
    price: input.price,
    category: input.category,
    material: input.material,
    ring_size: input.ring_size,
    description: input.description,
    thumbnail: input.imageId,
    images: [input.imageId],
    featured: input.featured,
    status: "disponivel",
    available: true,
  });
  if (error) console.error("Erro ao criar peça:", error);
  return !error;
}

/** Vendas de um mês (1-12) para o balanço. */
export async function getSalesForMonth(
  year: number,
  month: number
): Promise<SaleWithProduct[]> {
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const end = new Date(Date.UTC(year, month, 1)).toISOString();

  const { data, error } = await supabase
    .from("sales")
    .select("*, product:products(name,category)")
    .gte("sold_at", start)
    .lt("sold_at", end)
    .order("sold_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar vendas do mês:", error);
    return [];
  }
  return (data as SaleWithProduct[]) ?? [];
}
