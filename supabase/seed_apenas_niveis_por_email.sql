-- PLL: Apenas definir níveis (role) por e-mail
-- Use quando os usuários JÁ EXISTEM em auth.users (criados pelo app ou pelo Dashboard).
-- Troque os e-mails abaixo pelos e-mails reais dos seus usuários.

-- 1. Tenant e Cliente (para ter os IDs certos)
INSERT INTO public.tenants (id, name, slug)
VALUES (
  'a0000001-0000-4000-8000-000000000001',
  'Lidera',
  'lidera'
)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.clients (id, tenant_id, name, slug)
VALUES (
  'b0000001-0000-4000-8000-000000000001',
  'a0000001-0000-4000-8000-000000000001',
  'Demo',
  'demo'
)
ON CONFLICT (tenant_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 2. Atribuir níveis por e-mail (edite os e-mails)
-- Super Admin (acessa /super-admin)
UPDATE public.profiles
SET role = 'super_admin', tenant_id = NULL, client_id = NULL
WHERE id = (SELECT id FROM auth.users WHERE email = 'seu-email-super@exemplo.com' LIMIT 1);

-- Tenant Admin / Lidera (acessa /admin)
UPDATE public.profiles
SET role = 'tenant_admin', tenant_id = 'a0000001-0000-4000-8000-000000000001', client_id = NULL
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin-lidera@exemplo.com' LIMIT 1);

-- Usuário final / cliente Demo (acessa /demo)
UPDATE public.profiles
SET role = 'end_user', tenant_id = NULL, client_id = 'b0000001-0000-4000-8000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'usuario-demo@exemplo.com' LIMIT 1);
