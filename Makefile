# Variáveis
POETRY = poetry
BACKEND_DIR = backend

# O .PHONY declara quais targets não são arquivos físicos, mas sim comandos
.PHONY: help install run clean

# O target 'help' lista os comandos disponíveis no terminal
help:
	@echo "Comandos disponiveis:"
	@echo "  make help    - Exibe esta mensagem de ajuda"
	@echo "  make install - Instala as dependencias usando o Poetry"
	@echo "  make run     - Inicia o servidor FastAPI (Uvicorn)"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

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