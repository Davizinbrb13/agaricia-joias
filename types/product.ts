export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  category: string;
  material: string | null;
  tags: string[] | null;
  images: string[];
  thumbnail: string | null;
  available: boolean;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  ring_size: string | null;
}

/** Categorias de produtos disponíveis */
export const CATEGORIES = [
  { value: "anel", label: "Anel" },
  { value: "colar", label: "Colar" },
  { value: "brinco", label: "Brinco" },
  { value: "pingente", label: "Pingente" },
  { value: "pulseira", label: "Pulseira" },
  { value: "tornozeleira", label: "Tornozeleira" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
