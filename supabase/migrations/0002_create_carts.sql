-- 0002: carrinhos compartilháveis (anônimos)
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists carts_code_idx on public.carts (code);
