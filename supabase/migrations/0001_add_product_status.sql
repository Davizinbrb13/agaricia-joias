-- 0001: ciclo de vida da peça (disponivel | inativa | vendida)
alter table public.products
  add column if not exists status text not null default 'disponivel'
  check (status in ('disponivel', 'inativa', 'vendida'));

-- backfill a partir do campo available existente
-- (NULL-safe: available NULL/true => disponivel; somente false => inativa,
--  para nunca gravar NULL na coluna status que é NOT NULL)
update public.products
  set status = case when available is not distinct from false then 'inativa' else 'disponivel' end;

create index if not exists products_status_idx on public.products (status);
