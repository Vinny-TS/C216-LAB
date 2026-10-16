import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.repositories.book import BookRepository
from app.schemas.book import BookCreate, BookPatch, BookUpdate
from app.services.book import (
    NEW_BOOK_ID,
    SAMPLE_BOOKS,
    BookAlreadyExistsError,
    BookNotFoundError,
    BookService,
    seed_sample_books,
)


@pytest.fixture
def service() -> BookService:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine, autoflush=False)
    session = TestingSession()
    seed_sample_books(session)
    repo = BookRepository(session)
    return BookService(repo)


@pytest.fixture
def data() -> dict:
    return {
        "title": "Vidas Secas",
        "author": "Graciliano Ramos",
        "year": 1938,
        "pages": 176,
        "genre": "Romance",
        "price": 29.9,
    }


def test_list_books_without_filter_returns_all(service: BookService) -> None:
    books = service.list_books()
    assert len(books) == len(SAMPLE_BOOKS)
    assert [b.title for b in books] == [b.title for b in SAMPLE_BOOKS]


def test_list_books_filters_author_case_insensitively(service: BookService) -> None:
    books = service.list_books(author="george orwell")
    assert [book.title for book in books] == ["1984"]


@pytest.mark.parametrize("limit", [1, 2, 3])
def test_list_books_applies_limit(service: BookService, limit: int) -> None:
    assert len(service.list_books(limit=limit)) == limit


def test_get_book_returns_book_with_given_id(service: BookService) -> None:
    book = service.get_book(1)
    assert book.id == 1
    assert book.title == "Dom Casmurro"


def test_get_missing_book_raises_error(service: BookService) -> None:
    with pytest.raises(BookNotFoundError):
        service.get_book(999)


def test_create_book_assigns_new_id(service: BookService, data: dict) -> None:
    book = service.create_book(BookCreate(**data))
    assert book.id == NEW_BOOK_ID
    assert book.title == data["title"]
    assert book.author == data["author"]


def test_create_duplicate_book_raises_error(service: BookService) -> None:
    with pytest.raises(BookAlreadyExistsError):
        service.create_book(
            BookCreate(
                title="Dom Casmurro",
                author="Machado de Assis",
                year=1899,
                pages=256,
                genre="Romance",
                price=39.9,
            )
        )


def test_replace_book_uses_all_data(service: BookService, data: dict) -> None:
    book = service.replace_book(1, BookUpdate(**data))
    assert book.id == 1
    assert book.title == data["title"]
    assert book.author == data["author"]


def test_replace_missing_book_raises_error(service: BookService, data: dict) -> None:
    with pytest.raises(BookNotFoundError):
        service.replace_book(999, BookUpdate(**data))


def test_update_book_changes_only_sent_fields(service: BookService) -> None:
    original = service.get_book(2)
    original_title = original.title

    book = service.update_book(2, BookPatch(price=19.9))
    assert book.price == 19.9
    assert book.title == original_title


def test_update_book_ignores_null_fields(service: BookService) -> None:
    original = service.get_book(2)
    original_price = original.price

    updated = service.update_book(2, BookPatch(price=None))
    assert updated.price == original_price


def test_update_missing_book_raises_error(service: BookService) -> None:
    with pytest.raises(BookNotFoundError):
        service.update_book(999, BookPatch(price=19.9))


def test_delete_book_removes_book(service: BookService) -> None:
    service.delete_book(1)
    with pytest.raises(BookNotFoundError):
        service.get_book(1)


def test_delete_missing_book_raises_error(service: BookService) -> None:
    with pytest.raises(BookNotFoundError):
        service.delete_book(999)
