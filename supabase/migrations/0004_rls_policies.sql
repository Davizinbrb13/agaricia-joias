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
