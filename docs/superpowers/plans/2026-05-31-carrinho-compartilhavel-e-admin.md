# Carrinho Compartilhável + Painel Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que clientes montem um carrinho anônimo no catálogo e gerem um link compartilhável (enviado via WhatsApp), e dar à dona da loja um painel `/admin` (link direto, com login) para gerir o ciclo de vida das peças e registrar/exportar vendas do mês.

**Architecture:** O carrinho é "preguiçoso" — vive no `localStorage` do navegador enquanto a cliente navega e só toca o Supabase **uma vez** (uma gravação na tabela `carts`) quando ela gera o link. A leitura do link é uma única consulta direta navegador→Supabase. O painel admin é client-side, protegido por login do Supabase Auth (a segurança real é RLS no banco). Peças nunca são apagadas: ganham um `status` (`disponivel` | `inativa` | `vendida`); cada venda é um **evento** gravado na tabela `sales` (a peça é reutilizável, a venda é permanente), o que mantém o balanço mensal correto mesmo após reativação. O catálogo continua estático/ISR (`revalidate = 60`), então mudanças do admin aparecem em até 1 minuto sem revalidação manual.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Supabase (Postgres + Auth + RLS), Cloudinary (upload unsigned do navegador), Vitest (testes de lógica pura).

---

## Pré-requisitos (configuração manual antes de codar)

Estes passos são feitos **fora do código**, uma vez, e o plano assume que estão prontos:

1. **Cloudinary — upload preset unsigned:** no painel Cloudinary → Settings → Upload → Add upload preset → Signing Mode: **Unsigned** → anote o nome (ex.: `agaricia_admin`). Isso permite o navegador subir imagem sem expor segredo.
2. **Supabase Auth — conta da dona:** no painel Supabase → Authentication → Users → Add user → email + senha da sua mãe. Em Authentication → Providers/Settings, **desabilite "Allow new users to sign up"** (só essa conta deve existir).
3. **Bot (n8n):** o bot deve escrever no Supabase usando a **service_role key** (que ignora RLS). Se hoje ele usa a anon key, ele vai parar de inserir depois que a RLS for ligada na Task 1 — você disse que conserta o bot depois; este plano não mexe nele.
4. **Variáveis de ambiente** — adicionar ao `.env.local` (e na Vercel):
   ```
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=agaricia_admin
   ```
   As demais (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER`) já existem.

---

## Sobre as migrations do Supabase

O projeto **não usa o Supabase CLI** hoje (não há pasta `supabase/`). Este plano cria arquivos `.sql` versionados em `supabase/migrations/` e você os aplica de uma destas formas:

- **Forma simples (recomendada):** abra o **SQL Editor** no painel do Supabase, cole o conteúdo de cada arquivo na ordem (`0001` → `0004`) e clique em **Run**. Cada script é idempotente (`if not exists` / `drop policy if exists`), então rodar de novo não quebra.
- **Forma CLI (opcional):** se instalar o Supabase CLI, `supabase link` no projeto e `supabase db push` aplica a pasta `supabase/migrations/`.

Ordem obrigatória: **0001** (status na peça) → **0002** (carts) → **0003** (sales) → **0004** (RLS). A RLS vem por último para não bloquear nada antes das tabelas existirem.

> ⚠️ **Atenção produção:** a migration 0004 liga RLS em `products`. Reads públicos continuam funcionando (policy de SELECT para `anon`), mas **inserts via anon key param de funcionar** — por isso o bot precisa usar a service_role key (ver pré-requisito 3).

---

## File Structure

**Migrations (novos):**
- `supabase/migrations/0001_add_product_status.sql` — adiciona `status` em `products` + backfill
- `supabase/migrations/0002_create_carts.sql` — tabela de carrinhos compartilhados
- `supabase/migrations/0003_create_sales.sql` — tabela de eventos de venda
- `supabase/migrations/0004_rls_policies.sql` — RLS de products/carts/sales

**Tipos (modificar/criar):**
- `types/product.ts` — adicionar `ProductStatus` e campo `status`
- `types/cart.ts` — interface `Cart` (nova)
- `types/sale.ts` — interfaces `Sale` / `SaleWithProduct` (nova)

**Lógica pura (nova, com testes):**
- `lib/cart-storage.ts` + `lib/cart-storage.test.ts`
- `lib/cart-code.ts` + `lib/cart-code.test.ts`
- `lib/slug.ts` + `lib/slug.test.ts`
- `lib/sales-export.ts` + `lib/sales-export.test.ts`

**Integração / dados (novo/modificar):**
- `lib/queries.ts` — filtrar por `status`; novas funções `getProductsByIds`, `getCartByCode`, `createCart`
- `lib/cloudinary-upload.ts` — upload unsigned do navegador (novo)
- `lib/admin-queries.ts` — leituras/escritas do admin (novo)

**Carrinho (UI, novo):**
- `components/cart/CartContext.tsx` — provider + hook `useCart`
- `components/cart/AddToCartButton.tsx`
- `components/cart/CartBar.tsx`
- `app/carrinho/page.tsx` — carrinho local + gerar link
- `app/carrinho/[code]/page.tsx` — visão do link compartilhado (server)
- `app/layout.tsx` — montar `<CartProvider>` e `<CartBar/>` (modificar)
- `app/catalogo/[slug]/page.tsx` — inserir `<AddToCartButton/>` (modificar)

**Admin (UI, novo):**
- `app/admin/login/page.tsx`
- `app/admin/page.tsx`
- `components/admin/AdminDashboard.tsx`
- `components/admin/ProductRow.tsx`
- `components/admin/NewProductForm.tsx`
- `components/admin/SellModal.tsx`
- `components/admin/SalesPanel.tsx`

**Infra de teste (novo/modificar):**
- `vitest.config.ts` (novo)
- `package.json` (modificar: devDeps + scripts)

---

## Task 1: Migrations do Supabase (status, carts, sales, RLS)

**Files:**
- Create: `supabase/migrations/0001_add_product_status.sql`
- Create: `supabase/migrations/0002_create_carts.sql`
- Create: `supabase/migrations/0003_create_sales.sql`
- Create: `supabase/migrations/0004_rls_policies.sql`

- [ ] **Step 1: Criar `0001_add_product_status.sql`**

```sql
-- 0001: ciclo de vida da peça (disponivel | inativa | vendida)
alter table public.products
  add column if not exists status text not null default 'disponivel'
  check (status in ('disponivel', 'inativa', 'vendida'));

-- backfill a partir do campo available existente
update public.products
  set status = case when available then 'disponivel' else 'inativa' end;

create index if not exists products_status_idx on public.products (status);
```

- [ ] **Step 2: Criar `0002_create_carts.sql`**

```sql
-- 0002: carrinhos compartilháveis (anônimos)
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists carts_code_idx on public.carts (code);
```

- [ ] **Step 3: Criar `0003_create_sales.sql`**

```sql
-- 0003: vendas como eventos (uma linha por venda; peça nunca é apagada)
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  sold_at timestamptz not null default now(),
  description varchar(150),
  created_at timestamptz not null default now()
);

create index if not exists sales_sold_at_idx on public.sales (sold_at);
create index if not exists sales_product_id_idx on public.sales (product_id);
```

- [ ] **Step 4: Criar `0004_rls_policies.sql`**

```sql
-- 0004: Row Level Security

-- PRODUCTS: leitura pública, escrita só autenticado (admin)
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- CARTS: qualquer um cria e lê (pelo code); ninguém edita/apaga
alter table public.carts enable row level security;

drop policy if exists "carts_anon_insert" on public.carts;
create policy "carts_anon_insert"
  on public.carts for insert
  to anon, authenticated
  with check (true);

drop policy if exists "carts_public_read" on public.carts;
create policy "carts_public_read"
  on public.carts for select
  to anon, authenticated
  using (true);

-- SALES: só admin (autenticado) lê e escreve
alter table public.sales enable row level security;

drop policy if exists "sales_admin_all" on public.sales;
create policy "sales_admin_all"
  on public.sales for all
  to authenticated
  using (true)
  with check (true);
```

- [ ] **Step 5: Aplicar as migrations no Supabase**

Abra o SQL Editor no painel do Supabase e rode o conteúdo de `0001`, `0002`, `0003`, `0004` **nessa ordem** (um por vez, clicando Run).

Expected: cada execução retorna "Success. No rows returned" (ou contagem do backfill no 0001). Verifique em Table Editor que `products` tem a coluna `status` e que as tabelas `carts` e `sales` existem.

- [ ] **Step 6: Verificar reads públicos ainda funcionam**

Run: `npm run dev` e abra `http://localhost:3000/catalogo`
Expected: o catálogo carrega as peças normalmente (a query ainda usa `available` neste ponto — será trocada na Task 4; aqui só confirmamos que ligar a RLS não quebrou a leitura anon).

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations
git commit -m "feat(db): add product status, carts and sales tables with RLS"
```

---

## Task 2: Infra de testes (Vitest)

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Instalar dependências de teste**

```bash
npm install -D vitest vite-tsconfig-paths
```

Expected: `vitest` e `vite-tsconfig-paths` aparecem em `devDependencies`.

- [ ] **Step 2: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
```

- [ ] **Step 3: Adicionar scripts em `package.json`**

No bloco `"scripts"`, adicionar as linhas `test` e `test:watch`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 4: Verificar que o runner roda (sem testes ainda)**

Run: `npm test`
Expected: Vitest inicia e termina com "No test files found" (ou similar) — sem erro de configuração.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest test infrastructure"
```

---

## Task 3: Tipos (status, Cart, Sale)

**Files:**
- Modify: `types/product.ts:1-19`
- Create: `types/cart.ts`
- Create: `types/sale.ts`

- [ ] **Step 1: Adicionar `status` e `ProductStatus` em `types/product.ts`**

Substituir a interface `Product` (linhas 1-19) por esta versão (adiciona `status`; mantém `available` para compatibilidade com o bot):

```ts
export type ProductStatus = "disponivel" | "inativa" | "vendida";

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
  status: ProductStatus;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  ring_size: string | null;
}
```

- [ ] **Step 2: Criar `types/cart.ts`**

```ts
export interface Cart {
  id: string;
  code: string;
  product_ids: string[];
  created_at: string;
}
```

- [ ] **Step 3: Criar `types/sale.ts`**

```ts
import type { Product } from "./product";

export interface Sale {
  id: string;
  product_id: string;
  sold_at: string;
  description: string | null;
  created_at: string;
}

/** Venda com os dados da peça embutidos (para o painel e o CSV). */
export interface SaleWithProduct extends Sale {
  product: Pick<Product, "name" | "category"> | null;
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros (o código existente já compila; só adicionamos campos/arquivos).

- [ ] **Step 5: Commit**

```bash
git add types/product.ts types/cart.ts types/sale.ts
git commit -m "feat(types): add product status, Cart and Sale types"
```

---

## Task 4: Queries — filtrar por status e funções do carrinho

**Files:**
- Modify: `lib/queries.ts`

- [ ] **Step 1: Trocar `available` por `status` em todas as queries do catálogo**

Em `lib/queries.ts`, substituir **todas** as ocorrências de `.eq("available", true)` por `.eq("status", "disponivel")`. São 4 ocorrências: `getProducts`, `getFeaturedProducts`, `getProductBySlug`, `getRelatedProducts`, e mais uma em `getAllSlugs`. Use replace-all para `.eq("available", true)` → `.eq("status", "disponivel")`.

- [ ] **Step 2: Adicionar imports de tipos no topo de `lib/queries.ts`**

A linha 3 hoje é `import type { Product } from "@/types/product";`. Substituir por:

```ts
import type { Product } from "@/types/product";
import type { Cart } from "@/types/cart";
```

- [ ] **Step 3: Adicionar as funções do carrinho ao final de `lib/queries.ts`**

```ts
/** Busca peças por uma lista de IDs — SEM filtrar status (o carrinho mostra
 *  peças mesmo se ficaram indisponíveis). Reordena para casar com a ordem dos ids. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Erro ao buscar peças do carrinho:", error);
    return [];
  }

  const byId = new Map((data as Product[]).map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

/** Busca um carrinho pelo código do link compartilhado. */
export async function getCartByCode(code: string): Promise<Cart | null> {
  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("code", code)
    .single();

  if (error) {
    return null;
  }

  return data as Cart;
}

/** Cria um carrinho compartilhável (1 gravação). Retorna o cart criado. */
export async function createCart(
  productIds: string[],
  code: string
): Promise<Cart | null> {
  const { data, error } = await supabase
    .from("carts")
    .insert({ code, product_ids: productIds })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar carrinho:", error);
    return null;
  }

  return data as Cart;
}
```

- [ ] **Step 4: Verificar build e catálogo**

Run: `npx tsc --noEmit` e depois `npm run dev`, abrir `/catalogo`
Expected: tipos OK; catálogo carrega só peças com `status = 'disponivel'`.

- [ ] **Step 5: Commit**

```bash
git add lib/queries.ts
git commit -m "feat(queries): filter by status and add cart queries"
```

---

## Task 5: `lib/cart-storage.ts` (TDD)

**Files:**
- Create: `lib/cart-storage.ts`
- Test: `lib/cart-storage.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

Run: `npm test -- cart-storage`
Expected: FAIL com "Failed to resolve import './cart-storage'" ou "addId is not a function".

- [ ] **Step 3: Implementar `lib/cart-storage.ts`**

```ts
const KEY = "agaricia_cart";

/** Transforms puros (testáveis). */
export function addId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids : [...ids, id];
}

export function removeId(ids: string[], id: string): string[] {
  return ids.filter((x) => x !== id);
}

/** IO no localStorage (no-op no servidor). */
export function readCart(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ids));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

Run: `npm test -- cart-storage`
Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
git add lib/cart-storage.ts lib/cart-storage.test.ts
git commit -m "feat(cart): add localStorage cart storage with pure transforms"
```

---

## Task 6: `lib/cart-code.ts` (TDD)

**Files:**
- Create: `lib/cart-code.ts`
- Test: `lib/cart-code.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- cart-code`
Expected: FAIL com "Failed to resolve import './cart-code'".

- [ ] **Step 3: Implementar `lib/cart-code.ts`**

```ts
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Código aleatório curto para a URL do carrinho (ex.: "a8f3x2"). */
export function generateCartCode(length = 6): string {
  const cryptoObj =
    typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

  let out = "";
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(length);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      out += ALPHABET[bytes[i] % ALPHABET.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }
  return out;
}
```

- [ ] **Step 4: Rodar para confirmar passa**

Run: `npm test -- cart-code`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add lib/cart-code.ts lib/cart-code.test.ts
git commit -m "feat(cart): add random cart code generator"
```

---

## Task 7: `lib/slug.ts` (TDD)

**Files:**
- Create: `lib/slug.ts`
- Test: `lib/slug.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- slug`
Expected: FAIL com "Failed to resolve import './slug'".

- [ ] **Step 3: Implementar `lib/slug.ts`**

```ts
/** Converte um nome em slug seguro para URL. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
```

- [ ] **Step 4: Rodar para confirmar passa**

Run: `npm test -- slug`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add lib/slug.ts lib/slug.test.ts
git commit -m "feat: add slug helpers for admin product creation"
```

---

## Task 8: `lib/sales-export.ts` (TDD)

**Files:**
- Create: `lib/sales-export.ts`
- Test: `lib/sales-export.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- sales-export`
Expected: FAIL com "Failed to resolve import './sales-export'".

- [ ] **Step 3: Implementar `lib/sales-export.ts`**

```ts
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
```

- [ ] **Step 4: Rodar para confirmar passa**

Run: `npm test -- sales-export`
Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
git add lib/sales-export.ts lib/sales-export.test.ts
git commit -m "feat(admin): add sales CSV export builder"
```

---

## Task 9: Upload de imagem para o Cloudinary

**Files:**
- Create: `lib/cloudinary-upload.ts`

- [ ] **Step 1: Implementar `lib/cloudinary-upload.ts`**

```ts
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Sobe uma imagem direto do navegador para o Cloudinary (upload unsigned).
 * Retorna o `public_id` (preferível ao secure_url, pois permite as
 * transformações de `lib/cloudinary.ts`, ex.: thumbnail 400x400).
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!CLOUD || !PRESET) {
    throw new Error(
      "Cloudinary não configurado: defina NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    throw new Error("Falha no upload da imagem para o Cloudinary.");
  }

  const data = (await res.json()) as {
    public_id?: string;
    secure_url?: string;
  };

  const id = data.public_id ?? data.secure_url;
  if (!id) {
    throw new Error("Cloudinary não retornou identificador da imagem.");
  }
  return id;
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add lib/cloudinary-upload.ts
git commit -m "feat(admin): add unsigned Cloudinary image upload"
```

---

## Task 10: Contexto do carrinho (provider + hook)

**Files:**
- Create: `components/cart/CartContext.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Criar `components/cart/CartContext.tsx`**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addId,
  removeId,
  readCart,
  writeCart,
  clearCart as clearStorage,
} from "@/lib/cart-storage";

interface CartContextValue {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  // hidrata do localStorage no cliente
  useEffect(() => {
    setIds(readCart());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    writeCart(next);
  }, []);

  const add = useCallback(
    (id: string) => persist(addId(readCart(), id)),
    [persist]
  );
  const remove = useCallback(
    (id: string) => persist(removeId(readCart(), id)),
    [persist]
  );
  const clear = useCallback(() => {
    clearStorage();
    setIds([]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <CartContext.Provider
      value={{ ids, count: ids.length, has, add, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
```

- [ ] **Step 2: Montar o provider no `app/layout.tsx`**

Importar o provider e o `CartBar` (criado na Task 11) no topo do arquivo:

```tsx
import { CartProvider } from "@/components/cart/CartContext";
import CartBar from "@/components/cart/CartBar";
```

Envolver o conteúdo do `<body>` com `<CartProvider>` e adicionar `<CartBar/>` logo antes do fechamento. Exemplo do trecho dentro do `<body>`:

```tsx
        <CartProvider>
          {/* ...conteúdo existente do body (Header, children, Footer, etc.)... */}
          <CartBar />
        </CartProvider>
```

> Nota: mantenha tudo o que já existe dentro do `<body>` (Header, `{children}`, Footer, OceanBackground, WhatsAppButton, Analytics). Só envolva com `<CartProvider>` e acrescente `<CartBar />`.

- [ ] **Step 3: Verificar (após Task 11 o build fecha)**

Como `CartBar` é criado na Task 11, este passo é validado no final da Task 11. Por ora:
Run: `npx tsc --noEmit`
Expected: pode falhar só por `CartBar` ainda não existir — siga para a Task 11 e valide lá.

- [ ] **Step 4: Commit**

```bash
git add components/cart/CartContext.tsx app/layout.tsx
git commit -m "feat(cart): add CartProvider context and useCart hook"
```

---

## Task 11: Botão "adicionar ao carrinho" + barra flutuante

**Files:**
- Create: `components/cart/AddToCartButton.tsx`
- Create: `components/cart/CartBar.tsx`
- Modify: `app/catalogo/[slug]/page.tsx`

- [ ] **Step 1: Criar `components/cart/AddToCartButton.tsx`**

```tsx
"use client";

import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { has, add, remove } = useCart();
  const inCart = has(productId);

  return (
    <button
      type="button"
      className={`btn ${inCart ? "btn-ghost" : "btn-primary"}`}
      onClick={() => (inCart ? remove(productId) : add(productId))}
      aria-pressed={inCart}
    >
      {inCart ? "✓ No carrinho — remover" : "Adicionar ao carrinho"}
    </button>
  );
}
```

- [ ] **Step 2: Criar `components/cart/CartBar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

export default function CartBar() {
  const { count } = useCart();
  if (count === 0) return null;

  return (
    <Link
      href="/carrinho"
      aria-label={`Ver carrinho com ${count} peças`}
      style={{
        position: "fixed",
        left: "50%",
        bottom: 20,
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 22px",
        borderRadius: 999,
        background: "var(--ink, #0f2444)",
        color: "var(--sand, #f4ebd8)",
        textDecoration: "none",
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(15,36,68,0.35)",
      }}
    >
      <span>Ver carrinho</span>
      <span
        style={{
          minWidth: 24,
          height: 24,
          borderRadius: 999,
          background: "var(--sand, #f4ebd8)",
          color: "var(--ink, #0f2444)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          padding: "0 6px",
        }}
      >
        {count}
      </span>
    </Link>
  );
}
```

- [ ] **Step 3: Inserir o botão na página de produto**

Em `app/catalogo/[slug]/page.tsx`, adicionar o import no topo (junto dos outros imports de componentes):

```tsx
import AddToCartButton from "@/components/cart/AddToCartButton";
```

Dentro de `.produto-actions` (hoje linhas ~125-137), adicionar o botão como primeiro filho, antes do link "Quero saber mais":

```tsx
              <div className="produto-actions">
                <AddToCartButton productId={product.id} />
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Quero saber mais
                </a>
                <Link href="/catalogo" className="btn btn-ghost">
                  Ver catálogo
                </Link>
              </div>
```

- [ ] **Step 4: Verificar build e fluxo**

Run: `npx tsc --noEmit` e `npm run dev`
Expected: tipos OK. Abrir uma peça em `/catalogo/<slug>`, clicar "Adicionar ao carrinho" → a barra flutuante aparece com contagem; recarregar a página mantém a contagem (localStorage).

- [ ] **Step 5: Commit**

```bash
git add components/cart/AddToCartButton.tsx components/cart/CartBar.tsx "app/catalogo/[slug]/page.tsx"
git commit -m "feat(cart): add to-cart button and floating cart bar"
```

---

## Task 12: Página `/carrinho` — seleção local + gerar link

**Files:**
- Create: `app/carrinho/page.tsx`

- [ ] **Step 1: Criar `app/carrinho/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { getProductsByIds, createCart } from "@/lib/queries";
import { generateCartCode } from "@/lib/cart-code";
import { productThumbnail } from "@/lib/cloudinary";
import type { Product } from "@/types/product";

export default function CarrinhoPage() {
  const { ids, remove } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductsByIds(ids).then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [ids]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    const code = generateCartCode();
    const cart = await createCart(ids, code);
    setGenerating(false);
    if (!cart) {
      setError("Não consegui gerar o link agora. Tente de novo em instantes.");
      return;
    }
    setLink(`${window.location.origin}/carrinho/${cart.code}`);
  }

  if (loading) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "60px 0" }}>
          <p>Carregando seu carrinho…</p>
        </div>
      </section>
    );
  }

  if (ids.length === 0) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "60px 0", textAlign: "center" }}>
          <h1 className="produto-name">Seu carrinho está vazio</h1>
          <p>Volte ao catálogo e separe as peças que você quer experimentar.</p>
          <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: 16 }}>
            Ver catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="ag-container" style={{ padding: "48px 0" }}>
        <h1 className="produto-name">Minhas peças favoritas</h1>
        <p style={{ marginBottom: 24 }}>
          Separe as peças e gere um link para enviar no WhatsApp. A gente leva
          exatamente essas peças até você.
        </p>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {products.map((p) => {
            const img = p.thumbnail
              ? productThumbnail(p.thumbnail)
              : p.images[0]
                ? productThumbnail(p.images[0])
                : "/placeholder-product.jpg";
            return (
              <li
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 12,
                  border: "1px solid rgba(15,36,68,0.15)",
                  borderRadius: 12,
                }}
              >
                <Image src={img} alt={p.name} width={64} height={64} style={{ borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <strong>{p.name}</strong>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => remove(p.id)}>
                  Remover
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 32 }}>
          {link ? (
            <div
              style={{
                padding: 20,
                border: "1px solid rgba(15,36,68,0.2)",
                borderRadius: 12,
              }}
            >
              <p style={{ marginBottom: 12 }}>
                <strong>Pronto!</strong> Copie e envie este link no WhatsApp:
              </p>
              <input
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                style={{ width: "100%", padding: 10, borderRadius: 8, marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigator.clipboard?.writeText(link)}
                >
                  Copiar link
                </button>
                <a
                  className="btn btn-primary"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Oi! Separei minhas peças favoritas: ${link}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? "Gerando…" : "Gerar link para enviar"}
              </button>
              {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar fluxo completo**

Run: `npm run dev`, adicionar 2 peças, ir em `/carrinho`, clicar "Gerar link"
Expected: aparece um link `/carrinho/xxxxxx`; conferir no Supabase (Table Editor → `carts`) que uma linha foi criada com `product_ids` e `code`.

- [ ] **Step 3: Commit**

```bash
git add app/carrinho/page.tsx
git commit -m "feat(cart): add cart page with shareable link generation"
```

---

## Task 13: Página `/carrinho/[code]` — visão do link compartilhado

**Files:**
- Create: `app/carrinho/[code]/page.tsx`

- [ ] **Step 1: Criar `app/carrinho/[code]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartByCode, getProductsByIds } from "@/lib/queries";
import { productThumbnail } from "@/lib/cloudinary";
import { CATEGORIES } from "@/types/product";

export const metadata: Metadata = {
  title: "Carrinho compartilhado",
  robots: { index: false, follow: false },
};

// sempre dinâmico: cada link é único e raramente acessado
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

export default async function SharedCartPage({ params }: Props) {
  const { code } = await params;
  const cart = await getCartByCode(code);

  if (!cart) {
    notFound();
  }

  const products = await getProductsByIds(cart.product_ids);

  return (
    <section>
      <div className="ag-container" style={{ padding: "48px 0" }}>
        <h1 className="produto-name">Peças selecionadas</h1>
        <p style={{ marginBottom: 24 }}>
          {products.length} {products.length === 1 ? "peça" : "peças"} neste carrinho.
        </p>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {products.map((p) => {
            const img = p.thumbnail
              ? productThumbnail(p.thumbnail)
              : p.images[0]
                ? productThumbnail(p.images[0])
                : "/placeholder-product.jpg";
            const categoryLabel =
              CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category;
            const unavailable = p.status !== "disponivel";
            return (
              <li
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 12,
                  border: "1px solid rgba(15,36,68,0.15)",
                  borderRadius: 12,
                  opacity: unavailable ? 0.6 : 1,
                }}
              >
                <Image src={img} alt={p.name} width={72} height={72} style={{ borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--tide, #3a6ea5)" }}>{categoryLabel}</div>
                  <strong>{p.name}</strong>
                  {p.ring_size && <div style={{ fontSize: 13 }}>Aro {p.ring_size}</div>}
                  {unavailable && (
                    <div style={{ fontSize: 13, color: "#b00020", marginTop: 4 }}>
                      Essa peça não está mais disponível
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 32 }}>
          <Link href="/catalogo" className="btn btn-ghost">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar visão compartilhada**

Run: `npm run dev`, abrir o link gerado na Task 12 (`/carrinho/xxxxxx`) numa aba anônima
Expected: as peças aparecem com nome/categoria/aro. Marque uma peça como `inativa` no Supabase e recarregue → aparece "Essa peça não está mais disponível".

- [ ] **Step 3: Verificar link inválido**

Run: abrir `/carrinho/naoexiste`
Expected: página 404 (not-found).

- [ ] **Step 4: Commit**

```bash
git add "app/carrinho/[code]/page.tsx"
git commit -m "feat(cart): add shared cart view page by code"
```

---

## Task 14: Login do admin

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Criar `app/admin/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <section>
      <div className="ag-container" style={{ maxWidth: 380, padding: "80px 0" }}>
        <h1 className="produto-name" style={{ marginBottom: 24 }}>
          Painel da Agaricia
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
          {error && <p style={{ color: "#b00020" }}>{error}</p>}
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar login**

Run: `npm run dev`, abrir `/admin/login`, entrar com o email/senha criados no pré-requisito 2
Expected: redireciona para `/admin` (que ainda é 404 até a Task 16 — ok por ora). Com senha errada, mostra "Email ou senha incorretos.".

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "feat(admin): add login page with Supabase auth"
```

---

## Task 15: Queries/ações do admin

**Files:**
- Create: `lib/admin-queries.ts`

- [ ] **Step 1: Criar `lib/admin-queries.ts`**

```ts
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
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add lib/admin-queries.ts
git commit -m "feat(admin): add admin data queries and mutations"
```

---

## Task 16: Dashboard do admin (guard + lista de gestão)

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/AdminDashboard.tsx`
- Create: `components/admin/ProductRow.tsx`

- [ ] **Step 1: Criar `app/admin/page.tsx` (guard de sessão)**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <section>
        <div className="ag-container" style={{ padding: "80px 0" }}>
          <p>Verificando acesso…</p>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}
```

- [ ] **Step 2: Criar `components/admin/ProductRow.tsx`**

```tsx
"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { productThumbnail } from "@/lib/cloudinary";

const STATUS_LABEL: Record<Product["status"], string> = {
  disponivel: "Disponível",
  inativa: "Inativa",
  vendida: "Vendida",
};

interface Props {
  product: Product;
  busy: boolean;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
  onSell: (product: Product) => void;
}

export default function ProductRow({
  product,
  busy,
  onDeactivate,
  onReactivate,
  onSell,
}: Props) {
  const img = product.thumbnail
    ? productThumbnail(product.thumbnail)
    : product.images[0]
      ? productThumbnail(product.images[0])
      : "/placeholder-product.jpg";

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 12,
        border: "1px solid rgba(15,36,68,0.15)",
        borderRadius: 12,
      }}
    >
      <Image src={img} alt={product.name} width={56} height={56} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ display: "block" }}>{product.name}</strong>
        <span style={{ fontSize: 13 }}>{STATUS_LABEL[product.status]}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {product.status === "disponivel" && (
          <>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => onDeactivate(product.id)}>
              Desativar
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onSell(product)}>
              Vendido
            </button>
          </>
        )}
        {product.status !== "disponivel" && (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onReactivate(product.id)}>
            Reativar
          </button>
        )}
      </div>
    </li>
  );
}
```

- [ ] **Step 3: Criar `components/admin/AdminDashboard.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  getAllProductsAdmin,
  setProductStatus,
  recordSale,
} from "@/lib/admin-queries";
import type { Product } from "@/types/product";
import ProductRow from "./ProductRow";
import NewProductForm from "./NewProductForm";
import SellModal from "./SellModal";
import SalesPanel from "./SalesPanel";

type Tab = "pecas" | "vendas";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pecas");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selling, setSelling] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setProducts(await getAllProductsAdmin());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeactivate(id: string) {
    setBusyId(id);
    await setProductStatus(id, "inativa");
    await load();
    setBusyId(null);
  }

  async function handleReactivate(id: string) {
    setBusyId(id);
    await setProductStatus(id, "disponivel");
    await load();
    setBusyId(null);
  }

  async function handleConfirmSale(description: string | null) {
    if (!selling) return;
    const id = selling.id;
    setBusyId(id);
    await recordSale(id, description);
    setSelling(null);
    await load();
    setBusyId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <section>
      <div className="ag-container" style={{ padding: "40px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 className="produto-name">Painel</h1>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button type="button" className={`btn ${tab === "pecas" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("pecas")}>
            Peças
          </button>
          <button type="button" className={`btn ${tab === "vendas" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("vendas")}>
            Balanço de vendas
          </button>
        </div>

        {tab === "pecas" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <button type="button" className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Fechar" : "+ Nova peça"}
              </button>
            </div>

            {showForm && (
              <NewProductForm
                onCreated={async () => {
                  setShowForm(false);
                  await load();
                }}
              />
            )}

            {loading ? (
              <p>Carregando peças…</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, marginTop: 20 }}>
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    busy={busyId === p.id}
                    onDeactivate={handleDeactivate}
                    onReactivate={handleReactivate}
                    onSell={setSelling}
                  />
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "vendas" && <SalesPanel />}
      </div>

      {selling && (
        <SellModal
          product={selling}
          onCancel={() => setSelling(null)}
          onConfirm={handleConfirmSale}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 4: Verificar (build fecha após Tasks 17-18)**

`NewProductForm`, `SellModal` e `SalesPanel` são criados nas próximas tasks. Por ora:
Run: `npx tsc --noEmit`
Expected: pode falhar só por esses 3 imports ainda não existirem — siga para as Tasks 17-18.

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx components/admin/AdminDashboard.tsx components/admin/ProductRow.tsx
git commit -m "feat(admin): add dashboard guard and product management list"
```

---

## Task 17: Modal de venda + formulário de nova peça

**Files:**
- Create: `components/admin/SellModal.tsx`
- Create: `components/admin/NewProductForm.tsx`

- [ ] **Step 1: Criar `components/admin/SellModal.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  onCancel: () => void;
  onConfirm: (description: string | null) => void;
}

const MAX = 150;

export default function SellModal({ product, onCancel, onConfirm }: Props) {
  const [description, setDescription] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,36,68,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        padding: 16,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420 }}>
        <h2 style={{ marginBottom: 8 }}>Registrar venda</h2>
        <p style={{ marginBottom: 16 }}>{product.name}</p>

        <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
          Descrição da venda (opcional)
        </label>
        <textarea
          value={description}
          maxLength={MAX}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Ex.: vendido à vista por 180, com brinde"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" }}
        />
        <div style={{ fontSize: 12, textAlign: "right", marginBottom: 16 }}>
          {description.length}/{MAX}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm(description.trim() || null)}
          >
            Confirmar venda
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Criar `components/admin/NewProductForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { CATEGORIES } from "@/types/product";
import { createProduct } from "@/lib/admin-queries";
import { uploadProductImage } from "@/lib/cloudinary-upload";

export default function NewProductForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].value);
  const [material, setMaterial] = useState("Prata 925");
  const [ringSize, setRingSize] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Escolha uma foto da peça.");
      return;
    }
    setSaving(true);
    try {
      const imageId = await uploadProductImage(file);
      const ok = await createProduct({
        name: name.trim(),
        price: price ? Number(price) : null,
        category,
        material: material.trim() || null,
        ring_size: category === "anel" && ringSize ? ringSize.trim() : null,
        description: description.trim() || null,
        imageId,
        featured,
      });
      if (!ok) throw new Error("Falha ao salvar a peça.");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar a peça.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)", width: "100%" } as const;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, padding: 20, border: "1px solid rgba(15,36,68,0.2)", borderRadius: 12, marginBottom: 20 }}
    >
      <input style={inputStyle} placeholder="Nome da peça" value={name} onChange={(e) => setName(e.target.value)} required />
      <input style={inputStyle} type="number" step="0.01" placeholder="Preço (opcional)" value={price} onChange={(e) => setPrice(e.target.value)} />
      <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input style={inputStyle} placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
      {category === "anel" && (
        <input style={inputStyle} placeholder="Número do aro (ex.: 16)" value={ringSize} onChange={(e) => setRingSize(e.target.value)} />
      )}
      <textarea style={inputStyle} rows={3} placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Destaque na home
      </label>
      <label style={{ fontSize: 14 }}>
        Foto da peça
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ display: "block", marginTop: 6 }} />
      </label>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Salvando…" : "Salvar peça"}
      </button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
    </form>
  );
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros (faltava só `SalesPanel`, criado na Task 18).

- [ ] **Step 4: Commit**

```bash
git add components/admin/SellModal.tsx components/admin/NewProductForm.tsx
git commit -m "feat(admin): add sell modal and new product form"
```

---

## Task 18: Painel de vendas + exportar balanço (CSV)

**Files:**
- Create: `components/admin/SalesPanel.tsx`

- [ ] **Step 1: Criar `components/admin/SalesPanel.tsx`**

```tsx
"use client";

import { useState } from "react";
import { getSalesForMonth } from "@/lib/admin-queries";
import { salesToCsv, formatSaleDate } from "@/lib/sales-export";
import type { SaleWithProduct } from "@/types/sale";
import { CATEGORIES } from "@/types/product";

const now = new Date();

export default function SalesPanel() {
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getSalesForMonth(year, month);
    setSales(data);
    setLoaded(true);
    setLoading(false);
  }

  function download() {
    const csv = salesToCsv(sales);
    // BOM para o Excel abrir acentos corretamente
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `balanco-${year}-${String(month).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputStyle = { padding: 10, borderRadius: 8, border: "1px solid rgba(15,36,68,0.25)" } as const;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        <input style={inputStyle} type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Mês" />
        <input style={inputStyle} type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Ano" />
        <button type="button" className="btn btn-primary" onClick={load} disabled={loading}>
          {loading ? "Buscando…" : "Buscar vendas"}
        </button>
        {loaded && sales.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={download}>
            Exportar planilha (CSV)
          </button>
        )}
      </div>

      {loaded && sales.length === 0 && <p>Nenhuma venda nesse mês.</p>}

      {sales.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {sales.map((s) => {
            const catLabel = CATEGORIES.find((c) => c.value === s.product?.category)?.label ?? s.product?.category ?? "";
            return (
              <li key={s.id} style={{ padding: 12, border: "1px solid rgba(15,36,68,0.15)", borderRadius: 12 }}>
                <strong>{s.product?.name ?? "(peça removida)"}</strong>
                <div style={{ fontSize: 13 }}>
                  {catLabel} · {formatSaleDate(s.sold_at)}
                </div>
                {s.description && <div style={{ fontSize: 13, marginTop: 4 }}>{s.description}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos e build completo**

Run: `npx tsc --noEmit` e `npm run build`
Expected: ambos passam sem erro (todos os imports resolvidos).

- [ ] **Step 3: Verificar fluxo admin de ponta a ponta**

Run: `npm run dev`, logar em `/admin`:
- Aba "Peças": desativar uma peça → some do `/catalogo` (em até 60s por ISR); reativar → volta.
- "Vendido" numa peça → abre modal, confirmar com descrição → peça vira "Vendida"; criar outra igual depois e marcar vendido de novo gera **duas** linhas em `sales`.
- "+ Nova peça": subir foto do celular → cria peça disponível com a imagem.
- Aba "Balanço de vendas": buscar mês atual → lista as vendas → "Exportar planilha" baixa o CSV.

Expected: todos os fluxos funcionam; conferir tabelas `products` e `sales` no Supabase.

- [ ] **Step 4: Rodar a suíte de testes completa**

Run: `npm test`
Expected: todos os testes (cart-storage, cart-code, slug, sales-export) PASS.

- [ ] **Step 5: Commit**

```bash
git add components/admin/SalesPanel.tsx
git commit -m "feat(admin): add sales balance panel with CSV export"
```

---

## Self-Review (cobertura do spec)

| Requisito do brainstorm | Task que entrega |
|---|---|
| Cliente monta carrinho sem conta, anônimo | Tasks 5, 10, 11 (localStorage) |
| Gerar link compartilhável (1 gravação) | Tasks 6, 12 (`createCart`) |
| Enviar link no WhatsApp / você abre e vê as peças | Tasks 12, 13 |
| Peça indisponível aparece como "não disponível" no link | Task 13 (`status !== 'disponivel'`) |
| Otimizado p/ plano grátis (carrinho preguiçoso, sem revalidação manual) | Arquitetura + ISR 60s (sem código extra) |
| `status`: disponível / inativa / vendida, peça nunca apagada | Tasks 1, 3 |
| Desativar peça (sem venda) | Tasks 15, 16 (`setProductStatus`) |
| Marcar vendido = desativa + vai p/ lista de vendidos | Tasks 15, 17 (`recordSale`) |
| Venda como evento (reativar e vender de novo sem perder histórico) | Tasks 1, 15 (tabela `sales`) |
| Reativar peça | Tasks 15, 16 |
| Descrição da venda, máx 150, opcional | Tasks 1 (varchar 150), 17 (modal) |
| Exportar planilha do mês | Tasks 8, 18 (CSV) |
| Cadastro de peça (1 foto, sobe do celular p/ Cloudinary) | Tasks 9, 17 |
| Admin só p/ sua mãe, sem botão no site, link direto com login | Tasks 14, 16 (guard) + RLS Task 1 |
| Migrations do Supabase documentadas | Seção "Sobre as migrations" + Task 1 |
| Não quebrar o bot | Default `status='disponivel'` + nota service_role (Task 1) |

**Consistência de tipos:** `createCart(productIds, code)`, `getCartByCode(code)`, `getProductsByIds(ids)`, `recordSale(productId, description)`, `setProductStatus(id, status)`, `createProduct(NewProductInput com imageId)`, `salesToCsv(SaleWithProduct[])` — assinaturas batem entre as tasks que as definem e as que as consomem.

**Notas de segurança/escala:** a proteção real do admin é a RLS (Task 1); o guard client-side (Task 16) é só UX. Carrinho e vendas custam ~2 operações de banco por uso — folgadíssimo no plano grátis para ~20 links/mês e ~100 peças.
