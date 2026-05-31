-- 0004: Row Level Security

-- Modelo de admin: NÃO há checagem de role. Qualquer usuário autenticado é
-- tratado como admin. Isso só é seguro porque o cadastro de novos usuários
-- está DESABILITADO no painel do Supabase (Authentication → Providers →
-- "Allow new users to sign up" = OFF) e existe apenas a conta da dona da loja.
-- Se um dia houver signup público, troque "to authenticated using(true)" por
-- uma checagem de claim (ex.: auth.jwt() ->> 'role' = 'admin').

-- PRODUCTS: leitura pública, escrita só autenticado (admin)
alter table public.products enable row level security;

-- Remove a policy antiga do seed (using available = true). Mantê-la criaria
-- duas policies de SELECT em OR. A leitura pública agora é "using (true)"
-- de propósito: o link de carrinho precisa ler peças por id mesmo quando
-- ficaram inativas/vendidas (para exibir "não disponível").
drop policy if exists "Public read available products" on public.products;

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
