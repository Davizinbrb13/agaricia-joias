import { describe, it, expect } from "vitest";
import { addId, removeId } from "./cart-storage";

describe("cart-storage transforms", () => {
  it("adiciona um id novo", () => {
    expect(addId(["a"], "b")).toEqual(["a", "b"]);
  });

  it("não duplica id existente", () => {
    expect(addId(["a", "b"], "b")).toEqual(["a", "b"]);
  });

  it("remove um id", () => {
    expect(removeId(["a", "b"], "a")).toEqual(["b"]);
  });

  it("remover id inexistente não altera", () => {
    expect(removeId(["a"], "z")).toEqual(["a"]);
  });
});
