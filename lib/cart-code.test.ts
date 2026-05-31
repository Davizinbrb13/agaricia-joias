import { describe, it, expect } from "vitest";
import { generateCartCode } from "./cart-code";

describe("generateCartCode", () => {
  it("gera código do tamanho pedido", () => {
    expect(generateCartCode(6)).toHaveLength(6);
  });

  it("usa apenas letras minúsculas e dígitos", () => {
    expect(generateCartCode(20)).toMatch(/^[a-z0-9]+$/);
  });

  it("gera códigos diferentes em chamadas seguidas", () => {
    const a = generateCartCode();
    const b = generateCartCode();
    expect(a).not.toEqual(b);
  });
});
