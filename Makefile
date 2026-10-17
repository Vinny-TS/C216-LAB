# Variáveis
POETRY = poetry
BACKEND_DIR = backend
COMPOSE = docker compose

# O .PHONY declara quais targets não são arquivos físicos, mas sim comandos
.PHONY: help install run clean up down restart logs ps test test-unit test-integration db-upgrade db-downgrade db-current db-history db-migration db-psql

# O target 'help' lista os comandos disponíveis no terminal
help:
	@echo "Comandos disponiveis:"
	@echo "  make help             - Exibe esta mensagem de ajuda"
	@echo "  make install          - Instala as dependencias usando o Poetry"
	@echo "  make run              - Inicia o servidor FastAPI (Uvicorn)"
	@echo "  make test             - Executa toda a suite de testes automatizados"
	@echo "  make test-unit        - Executa apenas os testes unitarios"
	@echo "  make test-integration - Executa apenas os testes de integracao"
	@echo "  make clean            - Limpa caches e arquivos temporários"
	@echo "  make up               - Inicia os containers do Docker"
	@echo "  make down             - Para os containers do Docker"
	@echo "  make restart          - Reinicia os containers do Docker"
	@echo "  make logs             - Exibe os logs dos containers do Docker"
	@echo "  make ps               - Exibe o status dos containers do Docker"
	@echo "  make db-upgrade       - Aplica as migrations pendentes (Alembic)"
	@echo "  make db-downgrade     - Desfaz a última migration"
	@echo "  make db-current       - Mostra a versão atual do banco"
	@echo "  make db-history       - Lista o histórico de migrations"
	@echo "  make db-migration MSG=\"desc\" - Gera uma nova migration"
	@echo "  make db-psql          - Abre o psql no container do PostgreSQL"

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