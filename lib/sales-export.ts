import type { SaleWithProduct } from "@/types/sale";
import { CATEGORIES } from "@/types/product";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Formata uma data ISO como dd/mm/aaaa (pt-BR), em UTC para ser estável. */
export function formatSaleDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/** Gera o CSV do balanço mensal a partir das vendas. */
export function salesToCsv(sales: SaleWithProduct[]): string {
  const header = ["Peça", "Categoria", "Data da venda", "Descrição"].join(",");
  const lines = [header];

  for (const s of sales) {
    const name = s.product?.name ?? "(peça removida)";
    const catValue = s.product?.category ?? "";
    const catLabel =
      CATEGORIES.find((c) => c.value === catValue)?.label ?? catValue;
    const row = [
      csvEscape(name),
      csvEscape(catLabel),
      csvEscape(formatSaleDate(s.sold_at)),
      csvEscape(s.description ?? ""),
    ].join(",");
    lines.push(row);
  }

  return lines.join("\n");
}
