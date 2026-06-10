SHELL       := /bin/bash
.SHELLFLAGS := -euo pipefail -c
.ONESHELL:
.DEFAULT_GOAL := help

FROM    ?= develop
VERSION ?=

BOLD  := \033[1m
DIM   := \033[2m
RED   := \033[31m
GREEN := \033[32m
CYAN  := \033[36m
RESET := \033[0m

.PHONY: help install lint test test-e2e android release

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / \
	  { printf "  $(CYAN)$(BOLD)%-18s$(RESET) %s\n", $$1, $$2 }' \
	  $(MAKEFILE_LIST)
	@printf "\n  $(DIM)Variables:$(RESET)\n"
	@printf "  $(DIM)  FROM     rama origen para release  (default: develop)$(RESET)\n"
	@printf "  $(DIM)  VERSION  versión del tag            (ej: v0.1.0)$(RESET)\n\n"

android:
	@npx expo run:android

install:
	@printf "$(CYAN)$(BOLD)▶$(RESET) Instalando dependencias…\n"
	npm ci
	printf "$(GREEN)$(BOLD)✓$(RESET) Dependencias instaladas\n"

lint:
	@printf "$(CYAN)$(BOLD)▶$(RESET) Lint…\n"
	npm run lint
	printf "$(GREEN)$(BOLD)✓$(RESET) Lint OK\n"

test:
	@printf "$(CYAN)$(BOLD)▶$(RESET) Unit tests…\n"
	npm test -- --passWithNoTests
	printf "$(GREEN)$(BOLD)✓$(RESET) Tests OK\n"

test-e2e:
	@FLOW="${FLOW:-e2e/}"
	if ! command -v maestro >/dev/null 2>&1; then
		printf "$(RED)$(BOLD)✗  maestro no encontrado$(RESET)\n"
		printf "   Instala con: $(BOLD)curl -Ls 'https://get.maestro.mobile.dev' | bash$(RESET)\n\n"
		exit 1
	fi
	printf "$(CYAN)$(BOLD)▶$(RESET) E2E tests  $(DIM)($$FLOW)$(RESET)\n"
	maestro test "$$FLOW"
	printf "$(GREEN)$(BOLD)✓$(RESET) E2E OK\n"

release:
	if [[ -z "$(VERSION)" ]]; then
		printf "$(RED)$(BOLD)✗  VERSION es requerido$(RESET)\n"
		printf "   Uso: $(BOLD)make release VERSION=v0.1.0$(RESET)\n\n"
		exit 1
	fi
	if ! [[ "$(VERSION)" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$$ ]]; then
		printf "$(RED)$(BOLD)✗  Versión inválida:$(RESET) '$(VERSION)'\n"
		printf "   Debe seguir el formato $(BOLD)vX.Y.Z$(RESET)  (ej: v1.2.3)\n\n"
		exit 1
	fi
	if ! git diff --quiet || ! git diff --cached --quiet; then
		printf "$(RED)$(BOLD)✗  Hay cambios sin commitear$(RESET)\n"
		printf "   Commitea o descarta los cambios antes de hacer release.\n\n"
		exit 1
	fi
	if git rev-parse "$(VERSION)" >/dev/null 2>&1; then
		printf "$(RED)$(BOLD)✗  El tag $(VERSION) ya existe$(RESET)\n\n"
		exit 1
	fi

	printf "\n$(BOLD)  Raices — Release $(VERSION)$(RESET)  $(DIM)(desde $(FROM))$(RESET)\n"
	printf "$(DIM)  ──────────────────────────────────────────────$(RESET)\n\n"

	printf "$(CYAN)  [1/6]$(RESET)  checkout main\n"
	git checkout main

	printf "$(CYAN)  [2/6]$(RESET)  pull origin main\n"
	git pull origin main

	printf "$(CYAN)  [3/6]$(RESET)  merge $(FROM) → main\n"
	git merge --no-ff $(FROM) -m "chore(release): merge $(FROM) for $(VERSION)"

	printf "$(CYAN)  [4/6]$(RESET)  bump version en package.json\n"
	node scripts/bump-version.js $(VERSION)
	git add package.json
	git commit -m "chore(release): bump version to $(VERSION)"

	printf "$(CYAN)  [5/6]$(RESET)  push main\n"
	git push origin main

	printf "$(CYAN)  [6/6]$(RESET)  tag $(VERSION) y push\n"
	git tag $(VERSION)
	git push origin $(VERSION)

	printf "\n$(GREEN)$(BOLD)  ✓  Release $(VERSION) lanzado$(RESET)\n"
	printf "$(DIM)     GitHub Actions construira el APK y creara el release automaticamente.$(RESET)\n\n"
