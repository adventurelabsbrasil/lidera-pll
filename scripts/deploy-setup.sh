#!/bin/bash
# Execute na pasta raiz do projeto: ./scripts/deploy-setup.sh
# Antes: supabase login e vercel login (uma vez, no seu terminal)

set -e
cd "$(dirname "$0")/.."

echo "=== Supabase: link + db push ==="
npx supabase link --project-ref pnqpzutnanotzbefxxid
npx supabase db push

echo ""
echo "=== Vercel: deploy preview ==="
npx vercel

echo ""
echo "Deploy produção: npx vercel --prod"
echo "Variáveis: npx vercel env add NEXT_PUBLIC_SUPABASE_URL"
