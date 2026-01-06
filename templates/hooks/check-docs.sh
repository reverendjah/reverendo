#!/bin/bash
# check-docs.sh - Verifica se documentação precisa atualização
# Este hook roda no final de cada turno do Claude Code

# Arquivos de código modificados (staged + unstaged)
CODE_CHANGES=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx|py|go|rs)$' | wc -l)

# Arquivos de docs modificados
DOC_CHANGES=$(git diff --name-only HEAD 2>/dev/null | grep -E '(CLAUDE\.md|README\.md|docs/)' | wc -l)

# Se código mudou mas docs não
if [ "$CODE_CHANGES" -gt 0 ] && [ "$DOC_CHANGES" -eq 0 ]; then
  echo "Code changed but no documentation updated." >&2
  echo "Run rev-documenter agent or update docs manually." >&2
  exit 2  # Força Claude a responder
fi

exit 0
