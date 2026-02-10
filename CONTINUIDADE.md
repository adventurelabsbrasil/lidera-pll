# Continuidade: colocar o PLL no ar

## Estado atual (para retomar depois)

**Já feito:**
- App PLL implementado (Next.js 15.2.8, Supabase, área membro + admin + super-admin, PWA, tema).
- Projeto vinculado ao **lidera-pll** na Vercel.
- Deploy em produção: **https://lidera-pll-gamma.vercel.app**
- Next.js atualizado para versão segura (15.2.8).

**Modo teste (login desativado):** Para testar o app sem login, foram feitas:
- RLS: políticas de SELECT público em `content_groups`, `content_items`, `client_content_access` (migration `20250209110000_rls_test_public_read.sql`).
- Páginas da área do membro (`/[clientId]`, `/conteudo`, `/conteudo/.../aula`, `/conteudos-adquiridos`) não redirecionam mais para login; perfil continua exigindo login.
- **Quando for configurar acessos:** reverter essas políticas (ou criar migration que as remova), descomentar os `redirect` nas páginas acima e fazer novo deploy.

**Próximos passos (quando voltar):**
1. Confirmar variáveis no lidera-pll (Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`.
2. ~~Rodar migrations no Supabase~~ — **feito** (`supabase db push` já aplicado).
3. No Supabase, marcar um perfil como `role = super_admin` — ver **[PRIMEIRO-USO.md](PRIMEIRO-USO.md)**.
4. Acessar https://lidera-pll-gamma.vercel.app → login → /super-admin → criar tenant e cliente.
5. (Opcional) Domínio lidera.adventurelabs.com.br e conteúdo em /admin.
6. **Reativar bloqueios de login** (ver "Modo teste" acima).

**Pasta do projeto:** `"/Users/ribasrodrigo91/Documents/GitHub/Adventure Labs/Sem Título"`

---

Projeto já vinculado ao **lidera-pll** na Vercel. Seguir na ordem:

---

## 1. Variáveis no projeto lidera-pll (Vercel)

1. Abra: [vercel.com](https://vercel.com) → projeto **lidera-pll** → **Settings** → **Environment Variables**.
2. Adicione (se ainda não existir):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pnqpzutnanotzbefxxid.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave **anon** do Supabase (Settings → API no projeto) |
   | `NEXT_PUBLIC_APP_URL` | `https://lidera-pll-gamma.vercel.app` (ou lidera.adventurelabs.com.br quando configurar) |

   Marque para **Production**, **Preview** e **Development**.

3. Salve. **Importante:** variáveis só valem após um **novo deploy**. Faça **Redeploy** (Deployments → ⋮ → Redeploy) ou `npx vercel --prod`. Se ver Error 500 após adicionar variáveis, é quase sempre porque o deploy anterior não tinha as variáveis — redeploy resolve.

---

## 2. Deploy

Na pasta do projeto:

```bash
cd "/Users/ribasrodrigo91/Documents/GitHub/Adventure Labs/Sem Título"
npx vercel --prod
```

Ou: no dashboard da Vercel, **Deployments** → **Redeploy** no último deploy (com “Use existing Build Cache” desmarcado se você acabou de mudar variáveis).

---

## 3. Supabase: migrations

Se ainda não rodou as migrations no projeto `pnqpzutnanotzbefxxid`:

```bash
npx supabase link --project-ref pnqpzutnanotzbefxxid
npx supabase db push
```

Ou no dashboard: Supabase → **SQL Editor** → colar e executar na ordem:
- `supabase/migrations/20250209000001_initial_schema.sql`
- `supabase/migrations/20250209000002_rls.sql`

---

## 4. Primeiro uso no Supabase

1. **Super Admin**  
   No Supabase: **Table Editor** → **profiles** → localize seu usuário (pelo e-mail em **auth.users**) e edite:
   - `role` = `super_admin`
   - Salve.

2. **Tenant e cliente**  
   Acesse o app em produção: **https://lidera-pll-gamma.vercel.app** e faça login com esse usuário.  
   Vá em **/super-admin** e crie:
   - Um **tenant** (ex.: nome “Lidera”, slug “lidera”).
   - Um **cliente** (ex.: nome “Demo”, slug “demo”; a área do membro será `/[slug]` = `/demo`).

3. **Perfil do Lidera (tenant admin)**  
   No Supabase, em **profiles**, edite o perfil do usuário que será o admin do Lidera:
   - `role` = `tenant_admin`
   - `tenant_id` = id do tenant que você criou (copie da tabela **tenants**).

4. **Conteúdo e acesso**  
   Com esse usuário, entre em **/admin**, crie um **conteúdo** (grupo + aulas) e em **Acessos** vincule o cliente ao conteúdo.  
   Usuários finais com `role` = `end_user` e `client_id` preenchido acessam `/[slug-do-cliente]` (ex.: `/demo`) e veem só o que foi atribuído.

---

## 5. Domínio (opcional)

No Vercel: **lidera-pll** → **Settings** → **Domains** → **Add** → `lidera.adventurelabs.com.br`.  
Configure no seu provedor de DNS o registro apontando para a Vercel (CNAME ou A conforme a instrução da Vercel).  
Depois atualize `NEXT_PUBLIC_APP_URL` para `https://lidera.adventurelabs.com.br` e faça um novo deploy.

---

## Checklist rápido

- [ ] Variáveis no lidera-pll (Vercel)
- [x] Deploy (`npx vercel --prod` ou Redeploy) — **feito**
- [x] Migrations no Supabase — **feito** (`db push` aplicado)
- [ ] Um perfil com `role = super_admin` (ver PRIMEIRO-USO.md)
- [ ] Tenant e cliente criados em /super-admin
- [ ] (Opcional) Perfil tenant_admin e conteúdo + acesso em /admin
- [ ] (Opcional) Domínio lidera.adventurelabs.com.br
