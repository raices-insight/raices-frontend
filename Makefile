SHELL       := /bin/bash
.SHELLFLAGS := -euo pipefail -c
.DEFAULT_GOAL := help

FROM    ?= develop
VERSION ?=

BOLD  := \033[1m
DIM   := \033[2m
RED   := \033[31m
GREEN := \033[32m
CYAN  := \033[36m
RESET := \033[0m

.PHONY: help android install lint test test-e2e release

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / { printf "  $(CYAN)$(BOLD)%-18s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf "\n  $(DIM)Variables:$(RESET)\n"
	@printf "  $(DIM)  FROM     rama origen para release  (default: develop)$(RESET)\n"
	@printf "  $(DIM)  VERSION  version del tag            (ej: v0.1.0)$(RESET)\n\n"

android: ## Compila y lanza la app en Android
	@npx expo run:android

install: ## Instala dependencias (npm ci)
	@printf "$(CYAN)$(BOLD)▶$(RESET) Instalando dependencias...\n"
	@npm ci
	@printf "$(GREEN)$(BOLD)✓$(RESET) Dependencias instaladas\n"

lint: ## Ejecuta ESLint
	@printf "$(CYAN)$(BOLD)▶$(RESET) Lint...\n"
	@npm run lint
	@printf "$(GREEN)$(BOLD)✓$(RESET) Lint OK\n"

test: ## Ejecuta unit tests (Jest)
	@printf "$(CYAN)$(BOLD)▶$(RESET) Unit tests...\n"
	@npm test -- --passWithNoTests
	@printf "$(GREEN)$(BOLD)✓$(RESET) Tests OK\n"

test-e2e: ## Ejecuta E2E con Maestro  [FLOW=e2e/] (requiere dispositivo conectado)
	@command -v maestro >/dev/null 2>&1 || { printf "$(RED)$(BOLD)✗  maestro no encontrado$(RESET)\n   Instala con: $(BOLD)curl -Ls 'https://get.maestro.mobile.dev' | bash$(RESET)\n\n"; exit 1; }
	@printf "$(CYAN)$(BOLD)▶$(RESET) E2E tests  $(DIM)(${FLOW:-e2e/})$(RESET)\n"
	@maestro test "${FLOW:-e2e/}"
	@printf "$(GREEN)$(BOLD)✓$(RESET) E2E OK\n"

release: ## Merge FROM->main, crea tag y pushea  [VERSION=vX.Y.Z] [FROM=develop]
	@bash scripts/release.sh "$(VERSION)" "$(FROM)"
