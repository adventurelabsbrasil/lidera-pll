# Deploy via terminal (Supabase + Vercel)

## Pré-requisito: instalar os CLIs

```bash
npm install -g supabase vercel
```

Ou use `npx` sem instalar globalmente (ex.: `npx supabase ...`, `npx vercel ...`).

---

## Supabase

1. **Login** (abre o navegador na primeira vez):
   ```bash
   supabase login
   ```
   Em ambiente sem navegador (CI/SSH), use um token:
   - Crie em https://supabase.com/dashboard/account/tokens
   - `export SUPABASE_ACCESS_TOKEN=seu_token`
   - ou: `supabase login --token seu_token`

2. **Vincular ao projeto** (na pasta do projeto):
   ```bash
   supabase link --project-ref pnqpzutnanotzbefxxid
   ```

3. **Aplicar migrations**:
   ```bash
   supabase db push
   ```

4. **Rodar seed (usuários por nível) via CLI**  
   O Supabase CLI não tem comando para executar um `.sql` arbitrário no remoto. Use **psql** com a connection string do projeto:
   ```bash
   # Obter a URI: Dashboard → Settings → Database → Connection string (URI). Substitua [YOUR-PASSWORD] pela senha do banco.
   export DATABASE_URL="postgresql://postgres.pnqpzutnanotzbefxxid:[SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   chmod +x scripts/run-seed.sh
   ./scripts/run-seed.sh
   ```
   Ou executar outro arquivo: `./scripts/run-seed.sh "$DATABASE_URL" supabase/seed_apenas_niveis_por_email.sql`

---

## Vercel

1. **Login** (abre o navegador na primeira vez):
   ```bash
   vercel login
   ```

2. **Deploy** (na pasta do projeto, raiz do Next.js):
   ```bash
   vercel          # preview
   vercel --prod   # produção
   ```

3. **Variáveis de ambiente** (obrigatórias para o app funcionar):
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # valor: https://pnqpzutnanotzbefxxid.supabase.co
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # valor: anon key do Supabase (Settings → API)
   vercel env add NEXT_PUBLIC_APP_URL
   # valor: https://seu-dominio.vercel.app (opcional, para redirect após logout)
   ```
   Ou no dashboard: Project → Settings → Environment Variables.  
   **Se o deploy foi em projeto existente e as variáveis não foram criadas**, veja **[VERCEL-SETUP.md](../VERCEL-SETUP.md)** (projeto dedicado + lista exata de variáveis).

---

## Tudo em sequência (copiar e colar)

Na pasta do projeto:

```bash
# Supabase
supabase login
supabase link --project-ref pnqpzutnanotzbefxxid
supabase db push

# Vercel
vercel login
vercel
# depois, para produção:
vercel --prod
```

Se usar `npx`:

```bash
npx supabase login
npx supabase link --project-ref pnqpzutnanotzbefxxid
npx supabase db push

npx vercel login
npx vercel
npx vercel --prod
```
