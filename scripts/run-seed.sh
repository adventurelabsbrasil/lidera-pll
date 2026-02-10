#!/usr/bin/env bash
# Executa o seed SQL no banco remoto do Supabase via psql.
#
# Uso:
#   DATABASE_URL="postgresql://postgres.[ref]:[SENHA]@aws-0-[regiao].pooler.supabase.com:6543/postgres" ./scripts/run-seed.sh
#   ./scripts/run-seed.sh "postgresql://..."
#
# Obter a connection string: Supabase Dashboard → projeto → Settings → Database → Connection string (URI).
# Use a senha do banco (não a anon key). No URI, substitua [YOUR-PASSWORD] pela senha.

set -e
cd "$(dirname "$0")/.."

DB_URL="${1:-$DATABASE_URL}"
SEED_FILE="${2:-supabase/seed_usuarios_niveis.sql}"

if [ -z "$DB_URL" ]; then
  echo "Uso: DATABASE_URL=... ./scripts/run-seed.sh"
  echo "Ou:  ./scripts/run-seed.sh \"postgresql://postgres.[ref]:[SENHA]@...\""
  echo ""
  echo "Connection string: Supabase Dashboard → Settings → Database → Connection string (URI)"
  exit 1
fi

if [ ! -f "$SEED_FILE" ]; then
  echo "Arquivo não encontrado: $SEED_FILE"
  exit 1
fi

command -v psql >/dev/null 2>&1 || {
  echo "psql não encontrado. Instale o cliente PostgreSQL (brew install libpq ou Postgres.app)."
  exit 1
}

echo "Executando $SEED_FILE no banco remoto..."
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$SEED_FILE"
echo "Concluído."
