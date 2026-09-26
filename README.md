# C216 - Sistemas Distribuídos

Repositório estruturado para o desenvolvimento das atividades práticas da unidade curricular C216 (Sistemas Distribuídos) do INATEL.

O projeto consiste numa aplicação construída com **FastAPI** e conteinerizada via **Docker e Docker Compose**, dispondo de persistência com **PostgreSQL**, automação de tarefas com **GNU Make**, suíte de testes unitários com **Pytest** e integração contínua (CI) automatizada através do **GitHub Actions**.

## Estrutura do Repositório

```text
.
├── .github/
│   └── workflows/
│       └── ci-backend.yml
├── backend/
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_services.py
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── main.py
│   ├── pyproject.toml
│   ├── poetry.lock
│   └── services.py
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

## Tecnologias e Ferramentas

- **Python 3.11**: Linguagem de programação base do serviço de backend.
- **Poetry**: Gestor de dependências e ambientes virtuais.
- **FastAPI**: Framework web assíncrono para a construção da API.
- **Uvicorn**: Servidor ASGI para execução do FastAPI.
- **Docker & Docker Compose**: Conteinerização do serviço e orquestração de múltiplos contêineres em rede isolada.
- **PostgreSQL 16-Alpine**: Sistema de gestão de bases de dados relacional persistente.
- **Pytest**: Framework para estruturação e execução de testes automatizados.
- **GitHub Actions**: Plataforma de integração contínua para validação de testes a cada push e pull request.
- **GNU Make**: Utilitário para automação de rotinas de desenvolvimento e operações.

## Escopo das Práticas Implementadas

### Prática 1: Git/GitHub, Poetry e Makefile

- **Padronização de Repositório**: Criação de labels para gestão visual do fluxo de desenvolvimento e branches de entrega baseadas na branch `aulas`.
- **Configuração de Dependências**: Inicialização do Poetry no diretório `backend/` com as bibliotecas `fastapi` e `uvicorn`.
- **Automação Base**: Criação do `Makefile` na raiz do projeto contendo `.PHONY`, variáveis e as regras `help`, `install`, `run` e `clean`.
- **Proteção de Ambiente**: Criação do ficheiro `.gitignore` para impedir o versionamento de caches de compiladores, ambientes virtuais e ficheiros de configuração do sistema operativo.

### Prática 2: Conteinerização com Docker e Docker Compose

- **Dockerfile Backend**: Criação do ficheiro `backend/Dockerfile` utilizando a imagem `python:3.11-slim`, desativação de ambientes virtuais redundantes no Poetry e configuração do processo principal com Uvicorn.
- **Isolamento de Contexto**: Criação de `backend/.dockerignore` para evitar o envio de artefactos locais e caches para o daemon de build.
- **Orquestração de Infraestrutura**: Configuração de `docker-compose.yml` na raiz do projeto com os serviços `backend` e `db` (PostgreSQL 16), volume nomeado para persistência de dados (`postgres_data`) e comunicação por DNS interno.
- **Expansão do Makefile**: Adição de 5 comandos de orquestração: `make up`, `make down`, `make restart`, `make logs` e `make ps`.

### Prática 3: Testes Automatizados e Integração Contínua (CI)

- **Dependências de Desenvolvimento**: Inclusão do `pytest` no grupo `dev` do Poetry.
- **Suíte de Testes Unitários**: Criação de `backend/tests/test_services.py` com cobertura de asserções, cenários de erro via captura de exceções, parametrização de testes (`@pytest.mark.parametrize`) e isolamento de instâncias através de fixtures.
- **Automação de Testes**: Integração do comando `make test` ao `Makefile`.
- **Pipeline de CI**: Configuração do fluxo `.github/workflows/ci-backend.yml` acionado em eventos de `push` e `pull_request`, executando o setup de Python, resolução de dependências com Poetry e validação da suíte Pytest no runner Ubuntu.

## Instruções de Instalação e Execução

### Pré-requisitos

- Git instalado e configurado no sistema.
- Docker e Docker Compose instalados e em execução na máquina anfitriã.
- Python 3.11+ e Poetry instalados para desenvolvimento local fora de contêineres.
- GNU Make configurado no PATH do sistema.

### Execução via Docker Compose (Recomendado)

Para inicializar toda a pilha de serviços (API e base de dados PostgreSQL) em segundo plano, utilize o comando na raiz do repositório:

```bash
make up
```

Para monitorizar o estado de funcionamento dos contêineres e o mapeamento de portas:

```bash
make ps
```

Para acompanhar os registos de log emitidos pelos contêineres em tempo real:

```bash
make logs
```

Para encerrar a execução de todos os contêineres e redes criadas:

```bash
make down
```

## Execução dos Testes Automatizados

Os testes unitários da aplicação foram construídos com Pytest e podem ser executados de forma local através de duas abordagens.

### 1. Via Makefile

A partir da raiz do projeto:

```bash
make test
```

### 2. Diretamente via Poetry

Dentro da diretoria `backend`:

```bash
cd backend
poetry run pytest -v
```

## Tabela de Comandos do Makefile

| Comando | Descrição |
|---|---|
| `make help` | Exibe o menu com a lista de todos os comandos documentados no Makefile. |
| `make install` | Instala as dependências declaradas no Poetry dentro da pasta `backend`. |
| `make run` | Inicia o servidor Uvicorn da API localmente fora de contêineres. |
| `make clean` | Remove pastas de cache Python (`__pycache__`) e relatórios de testes. |
| `make test` | Executa a suíte de testes unitários do Pytest via Poetry. |
| `make up` | Constrói as imagens e inicia os contêineres do Docker Compose em segundo plano. |
| `make down` | Para e remove os contêineres, redes e recursos gerados pelo Compose. |
| `make restart` | Reinicia a execução dos contêineres em atividade. |
| `make logs` | Exibe a saída de logs agregados dos contêineres em tempo real. |
| `make ps` | Lista os contêineres do projeto, estados de integridade e portas ativas. |

## Integração Contínua (CI)

O fluxo de CI foi implementado no GitHub Actions através do ficheiro `.github/workflows/ci-backend.yml`.

O pipeline é disparado automaticamente nas seguintes condições:

- Eventos de `push` nas branches `aulas` e branches de atividades (`pratica-*`).
- Eventos de abertura ou sincronização de `pull_request` direcionados à branch `aulas`.

A execução ocorre num ambiente `ubuntu-latest` e segue a seguinte ordem de passos:

1. Checkout do código-fonte do repositório.
2. Configuração da versão 3.11 do runtime do Python.
3. Instalação e atualização do Poetry.
4. Instalação de todas as dependências de desenvolvimento e produção do backend.
5. Execução dos testes automatizados via `poetry run pytest -v`.
