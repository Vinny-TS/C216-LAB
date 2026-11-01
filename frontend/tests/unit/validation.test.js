import { describe, expect, it } from "vitest";
import {
  AUTHOR_MAX_LENGTH,
  GENRE_MAX_LENGTH,
  MAX_YEAR,
  MIN_YEAR,
  TITLE_MAX_LENGTH,
  validateBook,
} from "../../src/validation";

describe("validateBook", () => {
  const validBook = {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    year: "1899",
    pages: "256",
    price: "39.90",
  };

  it("retorna valores normalizados e sem erros para dados válidos", () => {
    const { errors, values } = validateBook(validBook);

    expect(Object.keys(errors)).toHaveLength(0);
    expect(values).toEqual({
      title: "Dom Casmurro",
      author: "Machado de Assis",
      genre: "Romance",
      year: 1899,
      pages: 256,
      price: 39.9,
    });
  });

  it("rejeita campos vazios ou contendo apenas espaços", () => {
    const { errors } = validateBook({
      title: "   ",
      author: "   ",
      genre: "   ",
      year: "   ",
      pages: "   ",
      price: "   ",
    });

    expect(errors.title).toBe("O título é obrigatório.");
    expect(errors.author).toBe("O autor é obrigatório.");
    expect(errors.genre).toBe("O gênero é obrigatório.");
    expect(errors.year).toBe("O ano é obrigatório.");
    expect(errors.pages).toBe("O número de páginas é obrigatório.");
    expect(errors.price).toBe("O preço é obrigatório.");
  });

  it("rejeita textos acima dos limites de tamanho máximo", () => {
    const { errors } = validateBook({
      ...validBook,
      title: "a".repeat(TITLE_MAX_LENGTH + 1),
      author: "b".repeat(AUTHOR_MAX_LENGTH + 1),
      genre: "c".repeat(GENRE_MAX_LENGTH + 1),
    });

    expect(errors.title).toContain(`máximo ${TITLE_MAX_LENGTH}`);
    expect(errors.author).toContain(`máximo ${AUTHOR_MAX_LENGTH}`);
    expect(errors.genre).toContain(`máximo ${GENRE_MAX_LENGTH}`);
  });

  it("rejeita anos fora do intervalo ou não inteiros", () => {
    expect(
      validateBook({ ...validBook, year: MIN_YEAR - 1 }).errors.year,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, year: MAX_YEAR + 1 }).errors.year,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, year: "2000.5" }).errors.year,
    ).toBeDefined();
  });

  it("rejeita páginas menores ou iguais a zero ou não inteiras", () => {
    expect(
      validateBook({ ...validBook, pages: "0" }).errors.pages,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, pages: "-10" }).errors.pages,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, pages: "120.5" }).errors.pages,
    ).toBeDefined();
  });

  it("rejeita preços menores ou iguais a zero ou inválidos", () => {
    expect(
      validateBook({ ...validBook, price: "0" }).errors.price,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, price: "-5" }).errors.price,
    ).toBeDefined();
    expect(
      validateBook({ ...validBook, price: "gratis" }).errors.price,
    ).toBeDefined();
  });
});
