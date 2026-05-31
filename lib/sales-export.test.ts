import { describe, it, expect } from "vitest";
import { salesToCsv } from "./sales-export";
import type { SaleWithProduct } from "@/types/sale";

function sale(partial: Partial<SaleWithProduct>): SaleWithProduct {
  return {
    id: "1",
    product_id: "p1",
    sold_at: "2026-05-10T12:00:00.000Z",
    description: null,
    created_at: "2026-05-10T12:00:00.000Z",
    product: { name: "Anel Sol", category: "anel" },
    ...partial,
  };
}

describe("salesToCsv", () => {
  it("inclui o cabeçalho", () => {
    const csv = salesToCsv([]);
    expect(csv).toBe("Peça,Categoria,Data da venda,Descrição");
  });

  it("usa o rótulo da categoria e data pt-BR", () => {
    const csv = salesToCsv([sale({})]);
    const lines = csv.split("\n");
    expect(lines[1]).toBe("Anel Sol,Anel,10/05/2026,");
  });

  it("escapa vírgulas e aspas na descrição", () => {
    const csv = salesToCsv([sale({ description: 'vendido a vista, com brinde "festa"' })]);
    expect(csv.split("\n")[1]).toContain('"vendido a vista, com brinde ""festa"""');
  });

  it("mostra placeholder se a peça sumiu", () => {
    const csv = salesToCsv([sale({ product: null })]);
    expect(csv.split("\n")[1]).toBe("(peça removida),,10/05/2026,");
  });
});
