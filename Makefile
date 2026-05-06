PNPM ?= pnpm
PORT ?= 3000

.PHONY: help install dev build start lint typecheck check clean clean-install

help:
	@echo "Available targets:"
	@echo "  make install       Install dependencies"
	@echo "  make dev           Start Next.js dev server (PORT=$(PORT))"
	@echo "  make build         Build production app"
	@echo "  make start         Start production server (PORT=$(PORT))"
	@echo "  make lint          Run ESLint"
	@echo "  make typecheck     Run TypeScript type checks"
	@echo "  make check         Run lint + typecheck + build"
	@echo "  make clean         Remove build cache (.next)"
	@echo "  make clean-install Remove node_modules and lockfile state"

install:
	$(PNPM) install

dev:
	PORT=$(PORT) $(PNPM) dev

build:
	$(PNPM) build

start:
	PORT=$(PORT) $(PNPM) start

lint:
	$(PNPM) lint

typecheck:
	$(PNPM) exec tsc --noEmit

check: lint typecheck build

clean:
	rm -rf .next

clean-install:
	rm -rf node_modules
	$(PNPM) store prune
