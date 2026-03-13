#!/usr/bin/env bash
set -euo pipefail

TARGET_BRANCH="${1:-main}"
REMOTE="${2:-origin}"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "❌ Este diretório não é um repositório git." >&2
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
  echo "⚠️ Você está na branch '$TARGET_BRANCH'. Troque para a branch do PR antes de continuar."
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "❌ Remote '$REMOTE' não encontrado. Configure o remote primeiro:"
  echo "   git remote add $REMOTE <url-do-repo>"
  exit 1
fi

echo "🔄 Buscando atualizações de $REMOTE/$TARGET_BRANCH..."
git fetch "$REMOTE" "$TARGET_BRANCH"

echo "🧪 Tentando merge de $REMOTE/$TARGET_BRANCH na branch '$CURRENT_BRANCH'..."
set +e
git merge "$REMOTE/$TARGET_BRANCH"
MERGE_STATUS=$?
set -e

if [ "$MERGE_STATUS" -eq 0 ]; then
  echo "✅ Merge concluído sem conflitos."
  echo "➡️ Agora rode: git push -u $REMOTE $CURRENT_BRANCH"
  exit 0
fi

echo "⚠️ Conflitos detectados."
echo "Arquivos em conflito:"
git diff --name-only --diff-filter=U || true

echo
echo "Próximos passos rápidos:"
echo "1) Resolver cada arquivo com marcador <<<<<<<, =======, >>>>>>>"
echo "2) git add <arquivos-resolvidos>"
echo "3) git commit -m 'resolve: merge conflicts with $TARGET_BRANCH'"
echo "4) git push -u $REMOTE $CURRENT_BRANCH"
