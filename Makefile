# Variáveis
POETRY = poetry
BACKEND_DIR = backend
FRONTEND_DIR = frontend
COMPOSE = docker compose

# O .PHONY declara quais targets não são arquivos físicos, mas sim comandos
.PHONY: help install run clean up down restart logs ps test test-unit test-integration \
	db-upgrade db-downgrade db-current db-history db-migration db-psql \
	frontend-install frontend-dev frontend-lint frontend-format frontend-check \
	frontend-test frontend-test-e2e frontend-build check-all

# O target 'help' lista os comandos disponíveis no terminal
help:
	@echo "Comandos disponiveis:"
	@echo "  make help              - Exibe esta mensagem de ajuda"
	@echo "  make install           - Instala as dependencias usando o Poetry"
	@echo "  make run               - Inicia o servidor FastAPI (Uvicorn)"
	@echo "  make test              - Executa toda a suite de testes automatizados"
	@echo "  make test-unit         - Executa apenas os testes unitarios"
	@echo "  make test-integration  - Executa apenas os testes de integracao"
	@echo "  make clean             - Limpa caches e arquivos temporários"
	@echo "  make up                - Inicia os containers do Docker"
	@echo "  make down              - Para os containers do Docker"
	@echo "  make restart           - Reinicia os containers do Docker"
	@echo "  make logs              - Exibe os logs dos containers do Docker"
	@echo "  make ps                - Exibe o status dos containers do Docker"
	@echo "  make db-upgrade        - Aplica as migrations pendentes (Alembic)"
	@echo "  make db-downgrade      - Desfaz a última migration"
	@echo "  make db-current        - Mostra a versão atual do banco"
	@echo "  make db-history        - Lista o histórico de migrations"
	@echo "  make db-migration MSG=\"desc\" - Gera uma nova migration"
	@echo "  make db-psql           - Abre o psql no container do PostgreSQL"
	@echo "  make frontend-install  - Instala dependencias do frontend (npm ci)"
	@echo "  make frontend-dev      - Inicia servidor de desenvolvimento Vite"
	@echo "  make frontend-lint     - Executa lint do frontend (Biome)"
	@echo "  make frontend-format   - Aplica formatacao no frontend (Biome)"
	@echo "  make frontend-check    - Valida lint e formatacao no frontend (Biome)"
	@echo "  make frontend-test     - Executa testes unitarios e de integracao (Vitest)"
	@echo "  make frontend-test-e2e - Executa testes E2E (Playwright)"
	@echo "  make frontend-build    - Gera build de producao do frontend"
	@echo "  make check-all         - Executa validacoes completas (backend + frontend)"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	cd $(BACKEND_DIR) && $(POETRY) run pytest -v

test-unit:
	cd $(BACKEND_DIR) && $(POETRY) run pytest -v tests/unit

test-integration:
	cd $(BACKEND_DIR) && $(POETRY) run pytest -v tests/integration

run:
	cd $(BACKEND_DIR) && $(POETRY) run uvicorn app.main:app --reload

clean:
	@echo "Limpando caches e arquivos temporários..."
	rm -rf $(BACKEND_DIR)/__pycache__
	rm -rf $(BACKEND_DIR)/.pytest_cache
	rm -rf $(BACKEND_DIR)/.mypy_cache
	rm -rf $(BACKEND_DIR)/.ruff_cache
	rm -rf $(BACKEND_DIR)/build
	rm -rf $(BACKEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/playwright-report
	rm -rf $(FRONTEND_DIR)/test-results

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

db-upgrade:
	$(COMPOSE) exec backend alembic upgrade head

db-downgrade:
	$(COMPOSE) exec backend alembic downgrade -1

db-current:
	$(COMPOSE) exec backend alembic current

db-history:
	$(COMPOSE) exec backend alembic history

db-migration:
	@test -n "$(MSG)$(msg)" || (echo "Uso: make db-migration MSG=\"descricao\"" && exit 1)
	$(COMPOSE) run --rm -v "$(CURDIR)/backend/alembic/versions:/app/alembic/versions" backend alembic revision --autogenerate -m "$(if $(MSG),$(MSG),$(msg))"

db-psql:
	$(COMPOSE) exec db sh -c 'psql -U $${POSTGRES_USER:-user} -d $${POSTGRES_DB:-c216_db}'

frontend-install:
	npm --prefix $(FRONTEND_DIR) ci

frontend-dev:
	npm --prefix $(FRONTEND_DIR) run dev

frontend-lint:
	npm --prefix $(FRONTEND_DIR) run lint

frontend-format:
	npm --prefix $(FRONTEND_DIR) run format

frontend-check:
	npm --prefix $(FRONTEND_DIR) run check

frontend-test:
	npm --prefix $(FRONTEND_DIR) run test

frontend-test-e2e:
	npm --prefix $(FRONTEND_DIR) run test:e2e

frontend-build:
	npm --prefix $(FRONTEND_DIR) run build

check-all: frontend-check frontend-test frontend-build frontend-test-e2e
