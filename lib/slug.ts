/** Converte um nome em slug seguro para URL. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug + sufixo aleatório para garantir unicidade sem consultar o banco. */
export function uniqueSlug(name: string, suffix: string): string {
  const base = slugify(name) || "peca";
  return `${base}-${suffix}`;
}
