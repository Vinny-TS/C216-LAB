from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.services.book import seed_sample_books


@pytest.fixture
def client() -> Iterator[TestClient]:
    """Client com banco SQLite em memória, novo e isolado a cada teste.

    Assim os testes não dependem do PostgreSQL (nem do Docker) para rodar,
    inclusive no CI.
    """
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine, autoflush=False)

    with TestingSession() as seed_session:
        seed_sample_books(seed_session)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    engine.dispose()


@pytest.fixture
def book_payload() -> dict:
    return {
        "title": "Grande Sertao: Veredas",
        "author": "Joao Guimaraes Rosa",
        "year": 1956,
        "pages": 624,
        "genre": "Romance",
        "price": 79.9,
    }
