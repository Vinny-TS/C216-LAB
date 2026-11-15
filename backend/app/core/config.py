import os

# Dentro do Docker Compose o host do PostgreSQL é "db" (nome do serviço).
# O valor padrão abaixo serve para execução local fora dos containers.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://user:password@localhost:5432/c216_db",
)

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

