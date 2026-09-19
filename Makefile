# Variáveis
POETRY = poetry
BACKEND_DIR = backend
COMPOSE = docker compose

# O .PHONY declara quais targets não são arquivos físicos, mas sim comandos
.PHONY: help install run clean up down restart logs ps test

# O target 'help' lista os comandos disponíveis no terminal
help:
	@echo "Comandos disponiveis:"
	@echo "  make help    - Exibe esta mensagem de ajuda"
	@echo "  make install - Instala as dependencias usando o Poetry"
	@echo "  make run     - Inicia o servidor FastAPI (Uvicorn)"
	@echo "  make clean   - Limpa caches e arquivos temporários"
	@echo "  make up      - Inicia os containers do Docker"
	@echo "  make down    - Para os containers do Docker"
	@echo "  make restart - Reinicia os containers do Docker"
	@echo "  make logs    - Exibe os logs dos containers do Docker"
	@echo "  make ps      - Exibe o status dos containers do Docker"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	cd $(BACKEND_DIR) && $(POETRY) run pytest -v

run:
	cd $(BACKEND_DIR) && $(POETRY) run uvicorn main:app --reload

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