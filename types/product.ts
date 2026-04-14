export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  category: string;
  material: string;
  tags: string[] | null;
  images: string[];
  thumbnail: string | null;
  available: boolean;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

/** Categorias de produtos disponíveis */
export const CATEGORIES = [
  { value: "aneis", label: "Anéis" },
  { value: "colares", label: "Colares" },
  { value: "brincos", label: "Brincos" },
  { value: "pulseiras", label: "Pulseiras" },
  { value: "conjuntos", label: "Conjuntos" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
