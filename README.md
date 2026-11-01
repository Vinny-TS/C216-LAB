# C216 - Sistemas Distribuídos

Repositório estruturado para o desenvolvimento das atividades práticas da unidade curricular C216 (Sistemas Distribuídos) do INATEL.

O projeto consiste num ecossistema moderno contendo:
- **Backend**: construído com **FastAPI** e conteinerizado via **Docker e Docker Compose**, dispondo de persistência com **PostgreSQL**, migrations com **Alembic**, suíte de testes unitários e de integração com **Pytest** e automação com **GNU Make**.
- **Frontend**: construído com **React**, empacotado com **Vite**, estilizado via **Tailwind CSS v4**, padronizado com **Biome**, coberto por testes em três níveis (**Vitest**, **React Testing Library** e **Playwright**) e integrado continuamente através do **GitHub Actions**.

## Estrutura do Repositório

```text
.
├── .github/
│   └── workflows/
│       ├── ci-backend.yml
│       └── ci-frontend.yml
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
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookForm.jsx
│   │   │   └── BookList.jsx
│   │   ├── App.jsx
│   │   ├── validation.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tests/
│   │   ├── setup.js
│   │   ├── unit/
│   │   │   ├── validation.test.js
│   │   │   ├── BookForm.test.jsx
│   │   │   └── BookList.test.jsx
│   │   ├── integration/
│   │   │   └── App.test.jsx
│   │   └── e2e/
│   │       └── books.spec.js
│   ├── .gitignore
│   ├── biome.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.js
│   └── vite.config.js
├── docs/
│   └── postgresql-sqlalchemy-migrations.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

## Tecnologias e Ferramentas

### Backend
- **Python 3.11 / 3.12**: Linguagem de programação base do serviço de backend.
- **Poetry**: Gestor de dependências e ambientes virtuais.
- **FastAPI**: Framework web assíncrono para a construção da API.
- **Uvicorn**: Servidor ASGI para execução do FastAPI.
- **SQLAlchemy 2.0**: ORM moderno para mapeamento objeto-relacional com tipagem estática (`Mapped`, `mapped_column`).
- **Alembic**: Ferramenta de versionamento de esquemas de banco de dados e migrações estruturadas.
- **Psycopg 3**: Driver nativo de alta performance para PostgreSQL.
- **Docker & Docker Compose**: Conteinerização do serviço e orquestração de múltiplos contêineres em rede isolada.
- **PostgreSQL 16-Alpine**: Sistema de gestão de bases de dados relacional persistente.
- **Pytest**: Framework para testes automatizados unitários e de integração.

### Frontend
- **Node.js 22 LTS**: Ambiente de execução JavaScript.
- **React 19**: Biblioteca para construção de interfaces reativas baseadas em componentes.
- **Vite 6 / 8**: Ferramenta moderna de build e servidor de desenvolvimento ultrarrápido.
- **Tailwind CSS v4**: Framework CSS utilitário integrado nativamente ao Vite via `@tailwindcss/vite`.
- **Biome**: Linter e formatador de código de alto desempenho (equivalente unificado de Ruff/ESLint/Prettier).
- **Vitest & React Testing Library**: Execução de testes unitários e de integração rápidos em ambiente DOM virtualizado (`jsdom`).
- **Playwright**: Execução de testes ponta a ponta (E2E) simulando a interação do usuário no navegador Chromium real.

### DevOps & Qualidade
- **GitHub Actions**: Automação de CI com pipelines segregados e otimizados por caminhos (`paths`).
- **GNU Make**: Utilitário para automação padronizada de comandos de desenvolvimento, teste e verificação.

---

## Escopo das Práticas Implementadas

### Prática 1: Git/GitHub, Poetry e Makefile
- **Padronização de Repositório**: Criação de labels para gestão visual do fluxo de desenvolvimento e branches de entrega baseadas na branch `aulas`.
- **Configuração de Dependências**: Inicialização do Poetry no diretório `backend/` com as bibliotecas `fastapi` e `uvicorn`.
- **Automação Base**: Criação do `Makefile` na raiz do projeto contendo `.PHONY`, variáveis e as regras `help`, `install`, `run` e `clean`.
- **Proteção de Ambiente**: Criação do ficheiro `.gitignore` para impedir o versionamento de caches de compiladores, ambientes virtuais e arquivos de configuração.

### Prática 2: Conteinerização com Docker e Docker Compose
- **Dockerfile Backend**: Criação do ficheiro `backend/Dockerfile` utilizando a imagem `python:3.11-slim`, desativação de ambientes virtuais redundantes no Poetry e configuração do processo principal com Uvicorn (`app.main:app`).
- **Isolamento de Contexto**: Criação de `backend/.dockerignore` para evitar o envio de artefatos locais e caches para o daemon de build.
- **Orquestração de Infraestrutura**: Configuração de `docker-compose.yml` na raiz do projeto com os serviços `backend` e `db` (PostgreSQL 16), volume nomeado para persistência de dados (`postgres_data`) e comunicação por DNS interno.
- **Expansão do Makefile**: Adição de comandos de orquestração: `make up`, `make down`, `make restart`, `make logs` e `make ps`.

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

### Prática 6: Frontend Moderno com React, Tailwind CSS, Biome, Vitest e Playwright
- **Frontend Independente em Memória**: Criação da aplicação React em `frontend/` com gerenciamento de estado local (`useState`), sem acoplamento direto com a API (preparado para consumo na Prática 7).
- **Domínio Alinhado a Livros**:
  - `validation.js`: Função pura `validateBook` com validação de regras de negócio espelhando o schema Pydantic (`title`, `author`, `year`, `pages`, `genre`, `price`).
  - `BookForm.jsx`: Formulário responsivo com acessibilidade (`aria-invalid`, `aria-describedby`, mensagens de erro em `role="alert"`), limpeza de estado pós-submissão e tipagem de campos numéricos.
  - `BookList.jsx`: Exibição de cards estilizados com Tailwind CSS e estado vazio amigável (`"Nenhum livro cadastrado."`).
  - `App.jsx`: Componente raiz que centraliza o estado dos livros cadastrados.
- **Qualidade de Código com Biome**: Configuração do `biome.json` com regras recomendadas de lint, organização automática de imports e formatação estrita de arquivos.
- **Pirâmide de Testes Completa**:
  - **Unitários (`tests/unit/`)**: Validação exaustiva da função `validateBook` e renderização isolada de `BookForm` e `BookList`.
  - **Integração (`tests/integration/`)**: Teste de renderização do `App` validando interação do formulário com a listagem através do `@testing-library/user-event`.
  - **E2E (`tests/e2e/`)**: Testes ponta a ponta com **Playwright** no Chromium real, inicializando o servidor Vite via `webServer` e validando o fluxo completo do usuário.
- **Pipeline de CI Segregado**: Criação de `.github/workflows/ci-frontend.yml` com validação automatizada de Biome, Vitest, build Vite e Playwright, com filtros de caminho (`paths`) para otimização do CI.

---

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

---

## Instruções de Instalação e Execução

### Pré-requisitos
- Git instalado e configurado no sistema.
- Node.js 22 LTS ou superior e npm.
- Python 3.11+ e Poetry para o backend local.
- Docker e Docker Compose instalados e em execução.
- GNU Make configurado no PATH do sistema.

### Execução do Frontend
Para rodar a interface em modo de desenvolvimento:

```bash
make frontend-install   # ou: cd frontend && npm ci
make frontend-dev       # ou: cd frontend && npm run dev
```

Acesse no navegador: `http://localhost:5173`.

### Execução do Backend via Docker Compose (Recomendado)
Para inicializar a API e a base de dados PostgreSQL:

```bash
make up
make ps
make logs
make down
```

---

## Execução dos Testes Automatizados

### 1. Testes do Frontend
Via Makefile (a partir da raiz):
```bash
make frontend-test       # Executa testes unitários e de integração (Vitest)
make frontend-test-e2e   # Executa testes ponta a ponta (Playwright)
```

Ou diretamente no diretório `frontend`:
```bash
cd frontend
npm run test            # Vitest modo CI
npm run test:watch      # Vitest modo interativo
npm run test:e2e        # Playwright E2E
```

### 2. Testes do Backend
```bash
make test              # Executa toda a suite do backend (unitários + integração)
make test-unit         # Apenas testes unitários do backend
make test-integration  # Apenas testes de integração do backend
```

### 3. Verificação Completa do Repositório
```bash
make check-all         # Executa lint, format check, testes e builds do frontend
```

---

## Tabela de Comandos do Makefile

| Comando | Descrição |
|---|---|
| `make help` | Exibe o menu com a lista de todos os comandos documentados no Makefile. |
| `make install` | Instala as dependências declaradas no Poetry dentro da pasta `backend`. |
| `make run` | Inicia o servidor Uvicorn da API localmente fora de contêineres (`app.main:app`). |
| `make test` | Executa toda a suíte de testes automatizados do backend via Poetry. |
| `make test-unit` | Executa exclusivamente a suíte de testes unitários do backend (`tests/unit`). |
| `make test-integration` | Executa exclusivamente a suíte de testes de integração do backend (`tests/integration`). |
| `make clean` | Remove pastas de cache Python, relatórios de testes e builds temporários do frontend. |
| `make up` | Constrói as imagens e inicia os contêineres do Docker Compose em segundo plano. |
| `make down` | Para e remove os contêineres, redes e volumes gerados pelo Compose. |
| `make restart` | Reinicia a execução dos contêineres em atividade. |
| `make logs` | Exibe a saída de logs agregados dos contêineres em tempo real. |
| `make ps` | Lista os contêineres do projeto, estados de integridade e portas ativas. |
| `make db-upgrade` | Aplica as migrations pendentes no PostgreSQL via Alembic. |
| `make db-downgrade` | Reverte a última migration aplicada no banco de dados. |
| `make db-current` | Exibe o identificador da migration atual do banco de dados. |
| `make db-history` | Lista a linha do tempo e histórico de revisões de migrations. |
| `make db-migration MSG="desc"` | Gera uma nova migration baseada nas alterações dos models (`--autogenerate`). |
| `make db-psql` | Abre um terminal interativo `psql` conectado ao container PostgreSQL. |
| `make frontend-install` | Instala as dependências do frontend (`npm ci`). |
| `make frontend-dev` | Inicia o servidor de desenvolvimento do Vite (`http://localhost:5173`). |
| `make frontend-lint` | Executa análise estática de código com o Biome no frontend. |
| `make frontend-format` | Aplica formatação automática de código com o Biome no frontend. |
| `make frontend-check` | Verifica lint e formatação com o Biome sem alterar arquivos. |
| `make frontend-test` | Executa os testes unitários e de integração com Vitest. |
| `make frontend-test-e2e` | Executa os testes de ponta a ponta no Chromium com Playwright. |
| `make frontend-build` | Gera o build de produção estático na pasta `frontend/dist`. |
| `make check-all` | Executa a verificação completa de qualidade e testes do frontend. |

---

## Integração Contínua (CI)

A integração contínua é gerenciada por dois workflows especializados no GitHub Actions:

1. **`ci-backend.yml`**: disparado quando há alterações em `backend/**` ou no próprio workflow. Executa instalação do Poetry, testes unitários e testes de integração com banco SQLite em memória.
2. **`ci-frontend.yml`**: disparado quando há alterações em `frontend/**` ou no próprio workflow. Executa verificação com Biome (`lint` e `format:check`), testes unitários e de integração com Vitest, build de produção Vite e testes ponta a ponta com Playwright no Chromium real (com upload de artefatos de relatório em caso de falha).

Ambos os pipelines monitoram eventos de `push` e `pull_request` nas branches `main`, `aulas` e branches de atividades (`pratica-*`).
