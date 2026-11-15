import { afterEach, describe, expect, it, vi } from "vitest";
import { API_URL, createBook, listBooks } from "../../../src/services/books";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("services/books", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("listBooks retorna os livros da API", async () => {
    const books = [{ id: 1, title: "1984", author: "George Orwell" }];
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(books));
    vi.stubGlobal("fetch", fetchMock);

    const result = await listBooks();

    expect(result).toEqual(books);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/books`, undefined);
  });

  it("listBooks lança erro de conexão quando fetch falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(listBooks()).rejects.toThrow(
      "Não foi possível conectar à API.",
    );
  });

  it("listBooks usa mensagem padrão quando resposta de erro não tem detail", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 500)));

    await expect(listBooks()).rejects.toThrow("Erro ao carregar os livros.");
  });

  it("createBook envia POST JSON e propaga detail em caso de 409", async () => {
    const payload = {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      genre: "Romance",
      year: 1899,
      pages: 256,
      price: 39.9,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: 1, ...payload }, 201))
      .mockResolvedValueOnce(
        jsonResponse(
          { detail: "Já existe um livro com esse título e autor" },
          409,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const created = await createBook(payload);
    expect(created).toEqual({ id: 1, ...payload });
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await expect(createBook(payload)).rejects.toThrow(
      "Já existe um livro com esse título e autor",
    );
  });
});
