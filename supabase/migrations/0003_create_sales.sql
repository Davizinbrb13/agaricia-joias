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
