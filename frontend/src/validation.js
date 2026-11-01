export const TITLE_MAX_LENGTH = 200;
export const AUTHOR_MAX_LENGTH = 100;
export const GENRE_MAX_LENGTH = 50;
export const MIN_YEAR = 1450;
export const MAX_YEAR = 2100;

export function validateBook({
  title = "",
  author = "",
  year = "",
  pages = "",
  genre = "",
  price = "",
} = {}) {
  const errors = {};
  const trimmedTitle = String(title ?? "").trim();
  const trimmedAuthor = String(author ?? "").trim();
  const trimmedGenre = String(genre ?? "").trim();

  if (!trimmedTitle) {
    errors.title = "O título é obrigatório.";
  } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    errors.title = `O título deve ter no máximo ${TITLE_MAX_LENGTH} caracteres.`;
  }

  if (!trimmedAuthor) {
    errors.author = "O autor é obrigatório.";
  } else if (trimmedAuthor.length > AUTHOR_MAX_LENGTH) {
    errors.author = `O autor deve ter no máximo ${AUTHOR_MAX_LENGTH} caracteres.`;
  }

  if (!trimmedGenre) {
    errors.genre = "O gênero é obrigatório.";
  } else if (trimmedGenre.length > GENRE_MAX_LENGTH) {
    errors.genre = `O gênero deve ter no máximo ${GENRE_MAX_LENGTH} caracteres.`;
  }

  const rawYear = String(year ?? "").trim();
  if (rawYear === "") {
    errors.year = "O ano é obrigatório.";
  } else {
    const numYear = Number(rawYear);
    if (
      !Number.isInteger(numYear) ||
      numYear < MIN_YEAR ||
      numYear > MAX_YEAR
    ) {
      errors.year = `O ano deve ser um número inteiro entre ${MIN_YEAR} e ${MAX_YEAR}.`;
    }
  }

  const rawPages = String(pages ?? "").trim();
  if (rawPages === "") {
    errors.pages = "O número de páginas é obrigatório.";
  } else {
    const numPages = Number(rawPages);
    if (!Number.isInteger(numPages) || numPages <= 0) {
      errors.pages =
        "O número de páginas deve ser um número inteiro maior que zero.";
    }
  }

  const rawPrice = String(price ?? "").trim();
  if (rawPrice === "") {
    errors.price = "O preço é obrigatório.";
  } else {
    const numPrice = Number(rawPrice);
    if (Number.isNaN(numPrice) || numPrice <= 0) {
      errors.price = "O preço deve ser maior que zero.";
    }
  }

  return {
    errors,
    values: {
      title: trimmedTitle,
      author: trimmedAuthor,
      genre: trimmedGenre,
      year: Number(rawYear),
      pages: Number(rawPages),
      price: Number(rawPrice),
    },
  };
}
