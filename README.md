# PLL - Área de Membros

PWA multitenancy para área de membros do **Programa Lucro e Liberdade (PLL)**.

**Próximos passos (projeto já vinculado ao lidera-pll na Vercel):** ver **[CONTINUIDADE.md](CONTINUIDADE.md)** — variáveis, deploy, migrations e primeiro uso.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Supabase** (auth, database, RLS por tenant)
- **Tailwind CSS**
- **Deploy:** Vercel | **Domínio:** `lidera.adventurelabs.com.br/[clientId]`

## Setup

1. **Variáveis de ambiente**

   Crie `.env.local` (use `.env.local.example` como base):

   - `NEXT_PUBLIC_SUPABASE_URL` – URL do projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – chave anon do projeto

2. **Banco de dados**

   No Supabase (projeto `pnqpzutnanotzbefxxid`), execute as migrations em ordem:

   - `supabase/migrations/20250209000001_initial_schema.sql`
   - `supabase/migrations/20250209000002_rls.sql`

3. **Instalação e execução**

   ```bash
   npm install
   npm run dev
   ```

4. **Primeiro uso**

   - **Super Admin (Adventure Labs):** defina manualmente no Supabase (`profiles`) um usuário com `role = 'super_admin'`.
   - Em **Super Admin** crie um **tenant** (ex: Lidera) e **clientes** (slug = trecho da URL, ex: `demo-cliente` → `/[clientId]` = `/demo-cliente`).
   - Em **Admin** (Lidera) crie **conteúdos** (grupos + aulas), depois em **Acessos** vincule cada cliente aos conteúdos que ele pode ver.

## Estrutura de rotas

- **Público:** `/` (landing), `/demo` (redireciona para área demo).
- **Membro:** `/[clientId]` (boas-vindas), `/[clientId]/login`, `/[clientId]/perfil`, `/[clientId]/conteudo`, `/[clientId]/conteudos-adquiridos`, `/[clientId]/conteudo/[groupSlug]/[itemSlug]` (aula).
- **Admin (Lidera):** `/admin` (dashboard, conteúdos, acessos).
- **Super Admin:** `/super-admin` (tenants, clientes).

## PWA

- Manifest em `app/manifest.ts`.
- Service worker em `public/sw.js` (registrado pelo cliente).
- Ícones: configurar em `app/manifest.ts` e adicionar arquivos em `public/` (ex.: `icon-192.png`, `icon-512.png`).

## Tema

- Preferência de tema (claro/escuro/sistema) é salva em `user_preferences` e em `localStorage` (`pll-theme`).
- Alteração em **Perfil e preferências** na área do membro.
