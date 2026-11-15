import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import { API_URL } from "../../src/services/books";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillBookForm(user) {
  await user.type(screen.getByLabelText("Título"), "Dom Casmurro");
  await user.type(screen.getByLabelText("Autor"), "Machado de Assis");
  await user.type(screen.getByLabelText("Gênero"), "Romance");
  await user.type(screen.getByLabelText("Ano"), "1899");
  await user.type(screen.getByLabelText("Páginas"), "256");
  await user.type(screen.getByLabelText("Preço (R$)"), "39.90");
}

describe("Integração: App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exibe carregamento e depois estado vazio quando a API retorna lista vazia", async () => {
    let resolveFetch;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<App />);

    expect(screen.getByText("Carregando livros...")).toBeInTheDocument();

    resolveFetch(jsonResponse([]));

    expect(
      await screen.findByText("Nenhum livro cadastrado."),
    ).toBeInTheDocument();
  });

  it("renderiza os livros carregados da API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            id: 1,
            title: "The Hobbit",
            author: "J. R. R. Tolkien",
            genre: "Fantasy",
            year: 1937,
            pages: 310,
            price: 59.9,
          },
        ]),
      ),
    );

    render(<App />);

    expect(await screen.findByText("The Hobbit")).toBeInTheDocument();
    expect(screen.getByText("J. R. R. Tolkien")).toBeInTheDocument();
    expect(screen.getByText("R$ 59.90")).toBeInTheDocument();
  });

  it("exibe erro de conexão quando a API está inacessível", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível conectar à API.",
    );
  });

  it("cadastra um livro via POST e o exibe na lista", async () => {
    const user = userEvent.setup();
    const createdBook = {
      id: 1,
      title: "Dom Casmurro",
      author: "Machado de Assis",
      genre: "Romance",
      year: 1899,
      pages: 256,
      price: 39.9,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse(createdBook, 201));
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(
      await screen.findByText("Nenhum livro cadastrado."),
    ).toBeInTheDocument();

    await fillBookForm(user);
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(await screen.findByText("Dom Casmurro")).toBeInTheDocument();
    expect(screen.getByText("Machado de Assis")).toBeInTheDocument();
    expect(screen.getByText("Romance")).toBeInTheDocument();
    expect(screen.getByText("R$ 39.90")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum livro cadastrado."),
    ).not.toBeInTheDocument();

    expect(fetchMock).toHaveBeenNthCalledWith(2, `${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Dom Casmurro",
        author: "Machado de Assis",
        genre: "Romance",
        year: 1899,
        pages: 256,
        price: 39.9,
      }),
    });
  });

  it("exibe erro 409 da API e preserva os campos digitados", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse(
          { detail: "Já existe um livro com esse título e autor" },
          409,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);
    await screen.findByText("Nenhum livro cadastrado.");

    await fillBookForm(user);
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Já existe um livro com esse título e autor",
    );
    expect(screen.getByLabelText("Título")).toHaveValue("Dom Casmurro");
  });
});
