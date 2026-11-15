from sqlalchemy.orm import Session

from app.models.book import Book as BookModel
from app.repositories.book import BookRepository
from app.schemas.book import Book as BookSchema, BookCreate, BookPatch, BookUpdate

SAMPLE_BOOKS: tuple[BookSchema, ...] = (
    BookSchema(id=1, title="Dom Casmurro", author="Machado de Assis", year=1899, pages=256, genre="Romance", price=39.9),
    BookSchema(id=2, title="1984", author="George Orwell", year=1949, pages=328, genre="Dystopia", price=49.9),
    BookSchema(id=3, title="Memorias Postumas de Bras Cubas", author="Machado de Assis", year=1881, pages=208, genre="Romance", price=34.9),
    BookSchema(id=4, title="The Hobbit", author="J. R. R. Tolkien", year=1937, pages=310, genre="Fantasy", price=59.9),
)

NEW_BOOK_ID = len(SAMPLE_BOOKS) + 1


def seed_sample_books(db: Session) -> None:
    """Popula o banco com os dados iniciais de livros se ainda não existirem."""
    for book_data in SAMPLE_BOOKS:
        if db.get(BookModel, book_data.id) is None:
            book_dict = book_data.model_dump()
            db.add(BookModel(**book_dict))
    db.commit()


class BookNotFoundError(Exception):
    """Exceção levantada quando um livro não é encontrado."""


class BookAlreadyExistsError(Exception):
    """Exceção levantada quando já existe livro com mesmo título e autor."""


class BookService:
    """Regras de negócio dos livros. Não conhece HTTP nem SQL."""

    def __init__(self, repository: BookRepository):
        self.repository = repository

    def list_books(self, author: str | None = None, limit: int = 100) -> list[BookModel]:
        return self.repository.list(author=author, limit=limit)

    def get_book(self, book_id: int) -> BookModel:
        book = self.repository.get_by_id(book_id)
        if book is None:
            raise BookNotFoundError(book_id)
        return book

    def create_book(self, data: BookCreate) -> BookModel:
        if self.repository.get_by_title_and_author(data.title, data.author):
            raise BookAlreadyExistsError(f"Livro '{data.title}' de '{data.author}' já existe")
        return self.repository.create(**data.model_dump())

    def replace_book(self, book_id: int, data: BookUpdate) -> BookModel:
        book = self.get_book(book_id)
        existing = self.repository.get_by_title_and_author(data.title, data.author)
        if existing and existing.id != book_id:
            raise BookAlreadyExistsError(f"Livro '{data.title}' de '{data.author}' já existe")
        return self.repository.update(book, data.model_dump())

    def update_book(self, book_id: int, data: BookPatch) -> BookModel:
        book = self.get_book(book_id)
        changes = data.model_dump(exclude_unset=True, exclude_none=True)
        new_title = changes.get("title", book.title)
        new_author = changes.get("author", book.author)
        if new_title != book.title or new_author != book.author:
            existing = self.repository.get_by_title_and_author(new_title, new_author)
            if existing and existing.id != book_id:
                raise BookAlreadyExistsError(f"Livro '{new_title}' de '{new_author}' já existe")
        return self.repository.update(book, changes)

    def delete_book(self, book_id: int) -> None:
        book = self.get_book(book_id)
        self.repository.delete(book)
