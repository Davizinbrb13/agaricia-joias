-- ===========================================
-- Seed de Produtos — Agaricia Jóias
-- Execute este SQL no painel do Supabase
-- ===========================================

-- Primeiro, crie a tabela (se ainda não existir)
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  name          text not null,
  slug          text not null unique,
  description   text,
  price         numeric(10,2),
  category      text not null,
  material      text default 'Prata 925',
  tags          text[],
  images        text[] not null,
  thumbnail     text,
  available     boolean default true,
  featured      boolean default false,
  meta_title    text,
  meta_description text
);

-- Row Level Security
alter table public.products enable row level security;

-- Política: leitura pública apenas de produtos disponíveis
create policy "Public read available products"
  on public.products for select
  using (available = true);

-- Índices para performance
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_featured on public.products (featured) where featured = true;
create index if not exists idx_products_slug on public.products (slug);

-- ===========================================
-- Dados fictícios para desenvolvimento
-- Substitua os Cloudinary public IDs pelos seus reais
-- ===========================================

INSERT INTO public.products (name, slug, description, price, category, material, tags, images, thumbnail, available, featured) VALUES

-- ANÉIS
('Anel Solitário Cravejado', 'anel-solitario-cravejado',
 'Anel solitário em prata 925 com zircônia central e microcravação lateral. Ideal para noivados e ocasiões especiais.',
 189.90, 'aneis', 'Prata 925 com Zircônia',
 ARRAY['presente', 'noivado', 'delicado'],
 ARRAY['agaricia/anel-solitario-1', 'agaricia/anel-solitario-2'],
 'agaricia/anel-solitario-1', true, true),

('Anel Meia Aliança', 'anel-meia-alianca',
 'Meia aliança em prata 925 com fileira de zircônias. Elegância discreta para o dia a dia.',
 159.90, 'aneis', 'Prata 925 com Zircônia',
 ARRAY['dia-a-dia', 'elegante', 'delicado'],
 ARRAY['agaricia/anel-meia-alianca-1'],
 'agaricia/anel-meia-alianca-1', true, false),

-- COLARES
('Colar Ponto de Luz', 'colar-ponto-de-luz',
 'Colar com pingente ponto de luz em prata 925 e zircônia brilhante. A delicadeza perfeita para qualquer look.',
 219.90, 'colares', 'Prata 925 com Zircônia',
 ARRAY['presente', 'delicado', 'dia-a-dia'],
 ARRAY['agaricia/colar-ponto-luz-1', 'agaricia/colar-ponto-luz-2'],
 'agaricia/colar-ponto-luz-1', true, true),

('Colar Gota Cristal', 'colar-gota-cristal',
 'Colar com pingente em formato de gota, cristal incolor engastado em prata 925. Sofisticação em cada detalhe.',
 279.90, 'colares', 'Prata 925 com Cristal',
 ARRAY['festa', 'sofisticado', 'presente'],
 ARRAY['agaricia/colar-gota-1'],
 'agaricia/colar-gota-1', true, false),

-- BRINCOS
('Brinco Argola Cravejada', 'brinco-argola-cravejada',
 'Argola média em prata 925 cravejada com zircônias. Brilho e elegância em um único par.',
 149.90, 'brincos', 'Prata 925 com Zircônia',
 ARRAY['elegante', 'festa', 'dia-a-dia'],
 ARRAY['agaricia/brinco-argola-1', 'agaricia/brinco-argola-2'],
 'agaricia/brinco-argola-1', true, true),

('Brinco Gota Pendurada', 'brinco-gota-pendurada',
 'Brinco pendurado com gota de zircônia em prata 925. Perfeito para eventos especiais.',
 179.90, 'brincos', 'Prata 925 com Zircônia',
 ARRAY['festa', 'casamento', 'presente'],
 ARRAY['agaricia/brinco-gota-1'],
 'agaricia/brinco-gota-1', true, false),

-- PULSEIRAS
('Pulseira Riviera', 'pulseira-riviera',
 'Pulseira riviera em prata 925 com zircônias redondas ao redor. Um clássico que não sai de moda.',
 249.90, 'pulseiras', 'Prata 925 com Zircônia',
 ARRAY['classico', 'presente', 'elegante'],
 ARRAY['agaricia/pulseira-riviera-1', 'agaricia/pulseira-riviera-2'],
 'agaricia/pulseira-riviera-1', true, true),

-- CONJUNTOS
('Conjunto Infinito', 'conjunto-infinito',
 'Conjunto colar + brinco com símbolo do infinito em prata 925. Presente perfeito para quem você ama.',
 329.90, 'conjuntos', 'Prata 925',
 ARRAY['presente', 'romantico', 'conjunto'],
 ARRAY['agaricia/conjunto-infinito-1', 'agaricia/conjunto-infinito-2'],
 'agaricia/conjunto-infinito-1', true, false);
