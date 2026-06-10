#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
FROM="${2:-develop}"

BOLD=$'\033[1m'
DIM=$'\033[2m'
RED=$'\033[31m'
GREEN=$'\033[32m'
CYAN=$'\033[36m'
RESET=$'\033[0m'

if [[ -z "$VERSION" ]]; then
  printf "%s\n" "${RED}${BOLD}✗  VERSION es requerido${RESET}"
  printf "   Uso: %s\n\n" "${BOLD}make release VERSION=v0.1.0${RESET}"
  exit 1
fi

if ! [[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  printf "%s\n" "${RED}${BOLD}✗  Versión inválida: '${VERSION}'${RESET}"
  printf "   Debe seguir el formato %s\n\n" "${BOLD}vX.Y.Z${RESET}  (ej: v1.2.3)"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  printf "%s\n" "${RED}${BOLD}✗  Hay cambios sin commitear${RESET}"
  printf "   Commitea o descarta los cambios antes de hacer release.\n\n"
  exit 1
fi

if git rev-parse "$VERSION" >/dev/null 2>&1; then
  printf "%s\n\n" "${RED}${BOLD}✗  El tag ${VERSION} ya existe${RESET}"
  exit 1
fi

printf "\n%s\n" "${BOLD}  Raices — Release ${VERSION}${RESET}  ${DIM}(desde ${FROM})${RESET}"
printf "%s\n\n" "${DIM}  ──────────────────────────────────────────────${RESET}"

printf "%s  checkout main\n" "${CYAN}  [1/6]${RESET}"
git checkout main

printf "%s  pull origin main\n" "${CYAN}  [2/6]${RESET}"
git pull origin main

printf "%s  merge %s → main\n" "${CYAN}  [3/6]${RESET}" "$FROM"
git merge --no-ff "$FROM" -m "chore(release): merge ${FROM} for ${VERSION}"

printf "%s  bump version en package.json\n" "${CYAN}  [4/6]${RESET}"
node "$(dirname "$0")/bump-version.js" "$VERSION"
git add package.json
git commit -m "chore(release): bump version to ${VERSION}"

printf "%s  push main\n" "${CYAN}  [5/6]${RESET}"
git push origin main

printf "%s  tag %s y push\n" "${CYAN}  [6/6]${RESET}" "$VERSION"
git tag "$VERSION"
git push origin "$VERSION"

printf "\n%s\n" "${GREEN}${BOLD}  ✓  Release ${VERSION} lanzado${RESET}"
printf "%s\n\n" "${DIM}     GitHub Actions construira el APK y creara el release automaticamente.${RESET}"
