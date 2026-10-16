#!/usr/bin/env bash
# Rebuilds the e2e database from scratch: Supabase stubs -> migrations -> registry import -> test accounts.
# Needs local Postgres (superuser via PGPASSWORD) and, afterwards, PostgREST reloaded (SIGUSR1) to refresh its schema cache.
set -euo pipefail
export PGPASSWORD="${PGPASSWORD:-pw}"; DB="${PGDB:-thlab3}"; P="psql -q -h localhost -U postgres -v ON_ERROR_STOP=1"
cd "$(dirname "$0")/../.."
$P -d postgres -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$DB' and pid <> pg_backend_pid()" >/dev/null
$P -d postgres -c "drop database if exists $DB" -c "create database $DB"
$P -d "$DB" -f scripts/e2e-accounts/stubs.sql
for f in supabase/migrations/*.sql; do $P -d "$DB" -f "$f"; done
DATABASE_URL="postgresql://postgres:$PGPASSWORD@localhost:5432/$DB" npx tsx --tsconfig scripts/tsconfig.health.json scripts/db/import.ts --apply >/dev/null
$P -d "$DB" -f scripts/e2e-accounts/seed-users.sql
pkill -USR1 -x postgrest 2>/dev/null || true   # reload PostgREST's schema cache
echo "e2e database reset"
