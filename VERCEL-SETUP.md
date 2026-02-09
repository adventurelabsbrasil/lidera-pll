# Configurar Vercel para o PLL (projeto dedicado + variáveis)

Se o deploy foi feito em um projeto Vercel existente (ou sem commit), a Vercel pode não ter detectado o Next.js nem pedido as variáveis. Segue como criar um **projeto novo só para o PLL** e configurar as variáveis.

---

## 1. Projeto novo na Vercel (recomendado)

Assim as variáveis e o domínio ficam só para o PLL, sem misturar com outros projetos.

### Opção A: Pelo dashboard (mais controle)

1. **Commit e push** do código (se ainda não fez):
   ```bash
   git add .
   git commit -m "feat: área de membros PLL"
   git push origin main
   ```

2. Acesse [vercel.com/new](https://vercel.com/new).

3. **Import** do repositório:
   - Se o repo for **monorepo** ou a pasta do app não for a raiz: em "Root Directory" coloque a pasta onde está o `package.json` do PLL (ex.: `Sem Título` ou o nome da pasta do repo).
   - Framework Preset: **Next.js** (deve detectar sozinho).
   - Build Command: `npm run build` (padrão).
   - Output Directory: deixe padrão.

4. **Environment Variables** (antes de dar Deploy):
   - Clique em "Environment Variables" e adicione:

   | Name | Value | Environments |
   |------|--------|---------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pnqpzutnanotzbefxxid.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(chave anon do Supabase)* | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | `https://seu-dominio.vercel.app` (ou `https://lidera.adventurelabs.com.br`) | Production (opcional) |

   Onde pegar a **anon key**: Supabase Dashboard → projeto `pnqpzutnanotzbefxxid` → **Settings** → **API** → "Project API keys" → **anon** (public).

5. Deploy. Depois, em **Settings → Domains**, adicione `lidera.adventurelabs.com.br` se for usar esse domínio.

### Opção B: Pelo CLI (projeto novo)

1. Na pasta do projeto (raiz do Next.js):
   ```bash
   npx vercel login
   npx vercel
   ```
2. Quando perguntar:
   - "Set up and deploy?" → **Y**
   - "Which scope?" → sua conta/team
   - "Link to existing project?" → **N**
   - "What's your project's name?" → ex.: `pll-members` ou `lidera-pll`
   - "In which directory is your code located?" → `./` (se já está na pasta certa)

3. Depois do primeiro deploy, **adicione as variáveis**:
   - Pelo dashboard: Project → **Settings** → **Environment Variables**
   - Ou no terminal:
     ```bash
     npx vercel env add NEXT_PUBLIC_SUPABASE_URL
     # colar: https://pnqpzutnanotzbefxxid.supabase.co
     npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
     # colar a anon key do Supabase
     npx vercel env add NEXT_PUBLIC_APP_URL
     # colar a URL de produção, ex: https://pll-members.vercel.app
     ```

4. **Redeploy** para as variáveis valerem no build:
   ```bash
   npx vercel --prod
   ```

---

## 2. Variáveis que este projeto usa

| Variável | Obrigatória | Onde usar | Exemplo |
|----------|-------------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Supabase client (auth + DB) | `https://pnqpzutnanotzbefxxid.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Supabase client | Chave **anon** em Supabase → Settings → API |
| `NEXT_PUBLIC_APP_URL` | Não | Redirect após logout (senão usa localhost) | `https://lidera.adventurelabs.com.br` |

Todas com prefixo `NEXT_PUBLIC_` são expostas no front; não coloque a **service_role** do Supabase aqui.

---

## 3. Se continuar no projeto Vercel existente

1. Abra o projeto no dashboard da Vercel.
2. **Settings** → **Environment Variables**.
3. Adicione as três variáveis acima (com os mesmos nomes).
4. **Settings** → **General**:
   - Confirme que **Framework Preset** é **Next.js**.
   - Se o código do PLL está numa **subpasta**, defina **Root Directory** para essa pasta (ex.: `Sem Título`).
5. **Redeploy**: Deployments → ⋮ no último deploy → **Redeploy** (ou push novo commit).

---

## 4. Conferir se deu certo

- Build deve passar (log sem erro de "NEXT_PUBLIC_SUPABASE_URL is not defined" ou similar).
- Na URL de produção, abra uma rota que usa Supabase (ex.: `/[slug-do-cliente]/login`); não deve dar tela em branco ou erro de "Invalid API key".
- Opcional: em **Project → Settings → Environment Variables**, as variáveis devem aparecer para Production (e Preview se quiser).

Se algo falhar, confira **Root Directory** (quando o repo tem mais de uma pasta) e se as variáveis estão marcadas para o ambiente em que você está fazendo o deploy (Production / Preview).
