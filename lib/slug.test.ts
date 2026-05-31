import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("normaliza acentos e espaços", () => {
    expect(slugify("Anel Coração de Prata")).toBe("anel-coracao-de-prata");
  });

  it("remove símbolos", () => {
    expect(slugify("Brinco 925 (novo)!")).toBe("brinco-925-novo");
  });

  it("colapsa hifens e apara as pontas", () => {
    expect(slugify("  --Colar -- Lua--  ")).toBe("colar-lua");
  });
});

describe("uniqueSlug", () => {
  it("anexa o sufixo ao slug base", () => {
    expect(uniqueSlug("Anel Sol", "a8f3")).toBe("anel-sol-a8f3");
  });

  it("usa 'peca' quando o nome vira string vazia", () => {
    expect(uniqueSlug("!!!", "x1")).toBe("peca-x1");
  });
});
