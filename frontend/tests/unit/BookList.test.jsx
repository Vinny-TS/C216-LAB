import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookList } from "../../src/components/BookList";

describe("BookList", () => {
  it("exibe mensagem de estado vazio quando não há livros", () => {
    render(<BookList books={[]} />);

    expect(screen.getByText("Nenhum livro cadastrado.")).toBeInTheDocument();
  });

  it("renderiza os livros fornecidos na lista", () => {
    const books = [
      {
        id: "1",
        title: "The Hobbit",
        author: "J. R. R. Tolkien",
        genre: "Fantasy",
        year: 1937,
        pages: 310,
        price: 59.9,
      },
    ];

    render(<BookList books={books} />);

    expect(screen.getByText("The Hobbit")).toBeInTheDocument();
    expect(screen.getByText("J. R. R. Tolkien")).toBeInTheDocument();
    expect(screen.getByText("Fantasy")).toBeInTheDocument();
    expect(screen.getByText(/1937/)).toBeInTheDocument();
    expect(screen.getByText(/310/)).toBeInTheDocument();
    expect(screen.getByText("R$ 59.90")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum livro cadastrado."),
    ).not.toBeInTheDocument();
  });
});
