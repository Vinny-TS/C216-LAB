from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.book import BookRepository
from app.schemas.book import Book, BookCreate, BookPatch, BookUpdate
from app.services.book import (
    BookAlreadyExistsError,
    BookNotFoundError,
    BookService,
)

router = APIRouter(prefix="/books", tags=["books"])

NOT_FOUND = "Livro não encontrado"
ALREADY_EXISTS = "Já existe um livro com esse título e autor"

BookId = Annotated[int, Path(gt=0, description="Book identifier")]


def get_book_service(db: Annotated[Session, Depends(get_db)]) -> BookService:
    return BookService(BookRepository(db))


ServiceDep = Annotated[BookService, Depends(get_book_service)]


@router.get("", response_model=list[Book])
def list_books(
    service: ServiceDep,
    author: Annotated[str | None, Query(min_length=1, description="Filter by author")] = None,
    limit: Annotated[int, Query(ge=1, le=100, description="Maximum number of books")] = 10,
) -> list[Book]:
    return service.list_books(author=author, limit=limit)


@router.get("/{book_id}", response_model=Book)
def get_book(book_id: BookId, service: ServiceDep) -> Book:
    try:
        return service.get_book(book_id)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None


@router.post("", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(data: BookCreate, service: ServiceDep) -> Book:
    try:
        return service.create_book(data)
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.put("/{book_id}", response_model=Book)
def replace_book(book_id: BookId, data: BookUpdate, service: ServiceDep) -> Book:
    try:
        return service.replace_book(book_id, data)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.patch("/{book_id}", response_model=Book)
def update_book(book_id: BookId, data: BookPatch, service: ServiceDep) -> Book:
    try:
        return service.update_book(book_id, data)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: BookId, service: ServiceDep) -> Response:
    try:
        service.delete_book(book_id)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)
