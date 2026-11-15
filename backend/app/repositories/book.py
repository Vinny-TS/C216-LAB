from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.book import Book


class BookRepository:
    """Único ponto da aplicação que conversa com o banco sobre livros."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields) -> Book:
        book = Book(**fields)
        self.db.add(book)
        self.db.commit()
        self.db.refresh(book)
        return book

    def get_by_id(self, book_id: int) -> Book | None:
        return self.db.get(Book, book_id)

    def get_by_title_and_author(self, title: str, author: str) -> Book | None:
        statement = select(Book).where(
            func.lower(Book.title) == title.lower(),
            func.lower(Book.author) == author.lower(),
        )
        return self.db.scalar(statement)

    def list(self, author: str | None = None, limit: int = 100) -> list[Book]:
        statement = select(Book).order_by(Book.id)
        if author is not None:
            statement = statement.where(func.lower(Book.author) == author.lower())
        statement = statement.limit(limit)
        return list(self.db.scalars(statement))

    def update(self, book: Book, changes: dict) -> Book:
        for field, value in changes.items():
            setattr(book, field, value)
        self.db.commit()
        self.db.refresh(book)
        return book

    def delete(self, book: Book) -> None:
        self.db.delete(book)
        self.db.commit()

