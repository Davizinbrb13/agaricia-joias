-- 0001: ciclo de vida da peça (disponivel | inativa | vendida)
alter table public.products
  add column if not exists status text not null default 'disponivel'
  check (status in ('disponivel', 'inativa', 'vendida'));

-- backfill a partir do campo available existente
update public.products
  set status = case when available then 'disponivel' else 'inativa' end;

create index if not exists products_status_idx on public.products (status);
