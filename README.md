# C216 - Sistemas Distribuídos

Repositório estruturado para o desenvolvimento das atividades práticas da unidade curricular C216 (Sistemas Distribuídos) do INATEL.

O projeto consiste numa aplicação construída com **FastAPI** e conteinerizada via **Docker e Docker Compose**, dispondo de persistência com **PostgreSQL**, automação de tarefas com **GNU Make**, suíte de testes unitários e de integração com **Pytest** e integração contínua (CI) automatizada através do **GitHub Actions**.

## Estrutura do Repositório

```text
.
├── .github/
│   └── workflows/
│       └── ci-backend.yml
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── c1a2b3d4e5f6_cria_tabela_books.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── books.py
│   │   │       └── health.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── database/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── book.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   └── book.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── book.py
│   │   └── services/
│   │       ├── __init__.py
│   │       └── book.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── unit/
│   │   │   ├── __init__.py
│   │   │   ├── test_book_schema.py
│   │   │   ├── test_book_service.py
│   │   │   └── test_services.py
│   │   └── integration/
│   │       ├── __init__.py
│   │       ├── conftest.py
│   │       ├── test_books_api.py
│   │       └── test_health_api.py
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── poetry.lock
│   └── services.py
├── docs/
│   └── postgresql-sqlalchemy-migrations.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

## Tecnologias e Ferramentas

- **Python 3.11 / 3.12**: Linguagem de programação base do serviço de backend.
- **Poetry**: Gestor de dependências e ambientes virtuais.
- **FastAPI**: Framework web assíncrono para a construção da API.
- **Uvicorn**: Servidor ASGI para execução do FastAPI.
- **SQLAlchemy 2.0**: ORM moderno para mapeamento objeto-relacional com tipagem estática (`Mapped`, `mapped_column`).
- **Alembic**: Ferramenta de versionamento de esquemas de banco de dados e migrações estruturadas.
- **Psycopg 3**: Driver nativo de alta performance para PostgreSQL.
- **Docker & Docker Compose**: Conteinerização do serviço e orquestração de múltiplos contêineres em rede isolada.
- **PostgreSQL 16-Alpine**: Sistema de gestão de bases de dados relacional persistente.
- **Pytest**: Framework para estruturação e execução de testes automatizados unitários e de integração.
- **GitHub Actions**: Plataforma de integração contínua para validação de testes a cada push e pull request.
- **GNU Make**: Utilitário para automação de rotinas de desenvolvimento e operações.

## Escopo das Práticas Implementadas

### Prática 1: Git/GitHub, Poetry e Makefile

- **Padronização de Repositório**: Criação de labels para gestão visual do fluxo de desenvolvimento e branches de entrega baseadas na branch `aulas`.
- **Configuração de Dependências**: Inicialização do Poetry no diretório `backend/` com as bibliotecas `fastapi` e `uvicorn`.
- **Automação Base**: Criação do `Makefile` na raiz do projeto contendo `.PHONY`, variáveis e as regras `help`, `install`, `run` e `clean`.
- **Proteção de Ambiente**: Criação do ficheiro `.gitignore` para impedir o versionamento de caches de compiladores, ambientes virtuais e ficheiros de configuração do sistema operativo.

### Prática 2: Conteinerização com Docker e Docker Compose

- **Dockerfile Backend**: Criação do ficheiro `backend/Dockerfile` utilizando a imagem `python:3.11-slim`, desativação de ambientes virtuais redundantes no Poetry e configuração do processo principal com Uvicorn (`app.main:app`).
- **Isolamento de Contexto**: Criação de `backend/.dockerignore` para evitar o envio de artefactos locais e caches para o daemon de build.
- **Orquestração de Infraestrutura**: Configuração de `docker-compose.yml` na raiz do projeto com os serviços `backend` e `db` (PostgreSQL 16), volume nomeado para persistência de dados (`postgres_data`) e comunicação por DNS interno.
- **Expansão do Makefile**: Adição de 5 comandos de orquestração: `make up`, `make down`, `make restart`, `make logs` e `make ps`.

### Prática 3: Testes Automatizados e Integração Contínua (CI)

- **Dependências de Desenvolvimento**: Inclusão do `pytest` no grupo `dev` do Poetry.
- **Suíte de Testes Unitários**: Criação de testes unitários com cobertura de asserções, cenários de erro via captura de exceções, parametrização de testes (`@pytest.mark.parametrize`) e isolamento de instâncias através de fixtures.
- **Automação de Testes**: Integração do comando `make test` ao `Makefile`.
- **Pipeline de CI**: Configuração do fluxo `.github/workflows/ci-backend.yml` acionado em eventos de `push` e `pull_request`.

### Prática 4: Arquitetura em Camadas e Recurso de Livros

- **Organização Modular (`backend/app/`)**: Estruturação em camadas bem definidas: `api/routes` (endpoints HTTP), `schemas` (modelos de validação Pydantic) e `services` (regras de negócio desacopladas da camada de transporte).
- **Recurso de Livros (`/books`)**: Implementação de operações CRUD com métodos HTTP GET, POST, PUT, PATCH e DELETE, com validação de parâmetros de rota (`book_id`) e consulta (`author`, `limit`).
- **Segregação de Testes**: Reestruturação das suítes de teste em `tests/unit/` (validação de schemas e services sem camada HTTP) e `tests/integration/` (chamadas de endpoints via `TestClient`).
- **Enforcement de Suítes via Hook Pytest**: Hook `pytest_collection_modifyitems` no `conftest.py` raiz que aplica markers automáticos e assegura que nenhum teste seja executado fora das pastas designadas.
- **Expansão de CI e Automação**: Adição dos comandos `make test-unit` e `make test-integration` e separação das suítes no fluxo do GitHub Actions.

### Prática 5: Persistência com PostgreSQL, SQLAlchemy & Migrations

- **Camada de Repositório (`repositories/book.py`)**: Centralização do acesso aos dados e abstração do ORM, separando persistência das regras de negócio.
- **Modelos ORM (`models/book.py`)**: Mapeamento objeto-relacional com SQLAlchemy 2.0 (`Base`, `Mapped`, `mapped_column`), mantendo schemas Pydantic separados dos modelos ORM de banco.
- **Regras de Negócio e Unicidade**: Validação de duplicidade na criação e atualização (`BookAlreadyExistsError` mapeado para `409 Conflict`) e de existência (`BookNotFoundError` mapeado para `404 Not Found`).
- **Gerenciamento de Sessão e Configuração**: Engine configurada via variável de ambiente `DATABASE_URL` (`postgresql+psycopg://...`), com injeção de dependência FastAPI (`get_db` e `get_book_service`).
- **Migrations com Alembic (`backend/alembic/`)**: Versionamento automatizado do banco de dados relacional com migration inicial para criação da tabela `books`.
- **Testes com Banco Isolado**: Fixtures de integração em `conftest.py` com SQLite em memória (`StaticPool`), permitindo execução autônoma sem dependência externa no CI e na máquina local.
- **Automação de Banco no Makefile**: Novos comandos para aplicar migrations (`db-upgrade`), desfazê-las (`db-downgrade`), inspecionar status (`db-current`, `db-history`), gerar novas migrations (`db-migration`) e acessar terminal interativo (`db-psql`).

## Endpoints de Livros (`/books`)

| Método | Rota | Parâmetros | Resposta | Descrição |
|---|---|---|---|---|
| `GET` | `/books` | query `author` (opcional), `limit` (1 a 100) | `200 OK` (lista de `Book`) | Lista livros cadastrados com suporte a filtros |
| `GET` | `/books/{book_id}` | path `book_id` (> 0) | `200 OK` (`Book`) | Recupera detalhes de um livro específico |
| `POST` | `/books` | body `BookCreate` | `201 Created` (`Book`) | Registra um novo livro |
| `PUT` | `/books/{book_id}` | path `book_id` + body `BookUpdate` | `200 OK` (`Book`) | Substitui completamente os dados de um livro |
| `PATCH` | `/books/{book_id}` | path `book_id` + body `BookPatch` | `200 OK` (`Book`) | Atualização parcial de campos específicos |
| `DELETE` | `/books/{book_id}` | path `book_id` (> 0) | `204 No Content` | Remove um livro do catálogo |

Documentação interativa do OpenAPI disponível em `http://localhost:8000/docs`.

## Instruções de Instalação e Execução

### Pré-requisitos

- Git instalado e configurado no sistema.
- Docker e Docker Compose instalados e em execução na máquina anfitriã.
- Python 3.11+ e Poetry instalados para desenvolvimento local fora de contêineres.
- GNU Make configurado no PATH do sistema.

### Execução via Docker Compose (Recomendado)

Para inicializar toda a pilha de serviços (API e base de dados PostgreSQL) em segundo plano:

```bash
make up
```

Para monitorizar o estado de funcionamento dos contêineres e portas:

```bash
make ps
```

Para acompanhar os registos de log em tempo real:

```bash
make logs
```

Para encerrar a execução dos contêineres:

```bash
make down
```

## Execução dos Testes Automatizados

A suíte de testes está dividida em testes unitários e de integração:

### 1. Via Makefile

```bash
make test              # Executa toda a suite de testes (unitarios + integracao)
make test-unit         # Executa apenas os testes unitarios (tests/unit)
make test-integration  # Executa apenas os testes de integracao (tests/integration)
```

### 2. Diretamente via Poetry

Dentro do diretório `backend`:

```bash
cd backend
poetry run pytest -v                    # Suite completa
poetry run pytest -v tests/unit         # Testes unitarios
poetry run pytest -v tests/integration  # Testes de integracao
```

## Tabela de Comandos do Makefile

| Comando | Descrição |
|---|---|
| `make help` | Exibe o menu com a lista de todos os comandos documentados no Makefile. |
| `make install` | Instala as dependências declaradas no Poetry dentro da pasta `backend`. |
| `make run` | Inicia o servidor Uvicorn da API localmente fora de contêineres (`app.main:app`). |
| `make test` | Executa toda a suíte de testes automatizados via Poetry. |
| `make test-unit` | Executa exclusivamente a suíte de testes unitários (`tests/unit`). |
| `make test-integration` | Executa exclusivamente a suíte de testes de integração (`tests/integration`). |
| `make clean` | Remove pastas de cache Python (`__pycache__`) e relatórios de testes. |
| `make up` | Constrói as imagens e inicia os contêineres do Docker Compose em segundo plano. |
| `make down` | Para e remove os contêineres, redes e recursos gerados pelo Compose. |
| `make restart` | Reinicia a execução dos contêineres em atividade. |
| `make logs` | Exibe a saída de logs agregados dos contêineres em tempo real. |
| `make ps` | Lista os contêineres do projeto, estados de integridade e portas ativas. |
| `make db-upgrade` | Aplica as migrations pendentes no PostgreSQL via Alembic. |
| `make db-downgrade` | Reverte a última migration aplicada no banco. |
| `make db-current` | Exibe o identificador da migration atual do banco de dados. |
| `make db-history` | Lista a linha do tempo e histórico de revisões de migrations. |
| `make db-migration MSG="desc"` | Gera uma nova migration baseada nas alterações dos models (`--autogenerate`). |
| `make db-psql` | Abre um terminal interativo `psql` conectado ao container PostgreSQL. |

## Integração Contínua (CI)

O fluxo de CI foi implementado no GitHub Actions através do ficheiro `.github/workflows/ci-backend.yml`.

O pipeline é disparado automaticamente nas seguintes condições:

- Eventos de `push` nas branches `aulas` e branches de atividades (`pratica-*`).
- Eventos de abertura ou sincronização de `pull_request` direcionados à branch `aulas`.

A execução ocorre num ambiente `ubuntu-latest` e segue a seguinte ordem de passos:

1. Checkout do código-fonte do repositório.
2. Configuração da versão 3.11 do runtime do Python.
3. Instalação e atualização do Poetry.
4. Instalação de todas as dependências do backend.
5. Execução dos testes unitários via `poetry run pytest -v tests/unit`.
6. Execução dos testes de integração via `poetry run pytest -v tests/integration`.
