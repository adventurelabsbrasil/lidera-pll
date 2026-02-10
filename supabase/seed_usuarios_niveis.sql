-- PLL: Criar tenant, cliente e usuários por nível (super_admin, tenant_admin, end_user)
-- Executar: Supabase → SQL Editor OU via CLI com psql (ver scripts/run-seed.sh e scripts/README-deploy.md)
--
-- OPÇÃO A: Você já criou os 3 usuários no Dashboard (Authentication → Add user)?
--   Use os e-mails: super@pll.local, admin@lidera.local, usuario@demo.local (senha: TrocarSenha123!)
--   Então execute só as seções 1 e 3 abaixo (pule a seção 2).
--
-- OPÇÃO B: Tentar criar os usuários via SQL (pode falhar em alguns projetos Supabase).
--   Execute o script inteiro; se a seção 2 der erro, crie os usuários no Dashboard e execute de novo só 1 e 3.

-- Habilitar extensão para hash de senha (se for usar a seção 2)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========== 1. Tenant e Cliente ==========
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

-- ========== 2. (Opcional) Usuários em auth.users ==========
-- Se der erro: crie no Dashboard Authentication → Add user (super@pll.local, admin@lidera.local, usuario@demo.local) e execute só a seção 3.
DO $$
DECLARE
  uid_super UUID := 'c0000001-0000-4000-8000-000000000001';
  uid_tenant UUID := 'c0000002-0000-4000-8000-000000000002';
  uid_user  UUID := 'c0000003-0000-4000-8000-000000000003';
  pwd TEXT := crypt('TrocarSenha123!', gen_salt('bf'));
  instance_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES
    (uid_super, instance_id, 'super@pll.local', pwd, now(), now(), now(), '{"provider":"email"}', '{"full_name":"Super Admin"}', 'authenticated', 'authenticated'),
    (uid_tenant, instance_id, 'admin@lidera.local', pwd, now(), now(), now(), '{"provider":"email"}', '{"full_name":"Admin Lidera"}', 'authenticated', 'authenticated'),
    (uid_user, instance_id, 'usuario@demo.local', pwd, now(), now(), now(), '{"provider":"email"}', '{"full_name":"Usuário Demo"}', 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seção 2 falhou (normal em alguns projetos). Crie os usuários no Dashboard e execute só a seção 3.';
END $$;

-- ========== 3. Perfis (roles e vínculos) ==========
-- Garante que existem linhas em profiles (trigger pode ter criado; senão criamos)
INSERT INTO public.profiles (id, email, full_name, role, tenant_id, client_id)
SELECT u.id, u.email, u.raw_user_meta_data->>'full_name', 'end_user', NULL, NULL
FROM auth.users u
WHERE u.email IN ('super@pll.local', 'admin@lidera.local', 'usuario@demo.local')
ON CONFLICT (id) DO NOTHING;

-- Super Admin (Adventure Labs)
UPDATE public.profiles
SET role = 'super_admin', tenant_id = NULL, client_id = NULL
WHERE id = (SELECT id FROM auth.users WHERE email = 'super@pll.local' LIMIT 1);

-- Tenant Admin (Lidera)
UPDATE public.profiles
SET role = 'tenant_admin', tenant_id = 'a0000001-0000-4000-8000-000000000001', client_id = NULL
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@lidera.local' LIMIT 1);

-- End User (cliente Demo)
UPDATE public.profiles
SET role = 'end_user', tenant_id = NULL, client_id = 'b0000001-0000-4000-8000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'usuario@demo.local' LIMIT 1);

-- ========== Resumo (para conferência) ==========
-- super@pll.local    → super_admin  → acessa /super-admin
-- admin@lidera.local → tenant_admin → acessa /admin (tenant Lidera)
-- usuario@demo.local → end_user     → acessa /demo (área do membro)
-- Senha padrão: TrocarSenha123!
