import { useState } from "react";
import { validateBook } from "../validation";

export function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [pages, setPages] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateBook({ title, author, year, pages, genre, price });
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;

    onAdd(result.values);
    setTitle("");
    setAuthor("");
    setYear("");
    setPages("");
    setGenre("");
    setPrice("");
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label
            htmlFor="book-title"
            className="block text-sm font-medium text-slate-700"
          >
            Título
          </label>
          <input
            id="book-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "book-title-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.title && (
            <p
              id="book-title-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="book-author"
            className="block text-sm font-medium text-slate-700"
          >
            Autor
          </label>
          <input
            id="book-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-invalid={errors.author ? "true" : "false"}
            aria-describedby={errors.author ? "book-author-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.author && (
            <p
              id="book-author-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.author}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="book-genre"
            className="block text-sm font-medium text-slate-700"
          >
            Gênero
          </label>
          <input
            id="book-genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-invalid={errors.genre ? "true" : "false"}
            aria-describedby={errors.genre ? "book-genre-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.genre && (
            <p
              id="book-genre-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.genre}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="book-year"
            className="block text-sm font-medium text-slate-700"
          >
            Ano
          </label>
          <input
            id="book-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            aria-invalid={errors.year ? "true" : "false"}
            aria-describedby={errors.year ? "book-year-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.year && (
            <p
              id="book-year-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.year}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="book-pages"
            className="block text-sm font-medium text-slate-700"
          >
            Páginas
          </label>
          <input
            id="book-pages"
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            aria-invalid={errors.pages ? "true" : "false"}
            aria-describedby={errors.pages ? "book-pages-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.pages && (
            <p
              id="book-pages-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.pages}
            </p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label
            htmlFor="book-price"
            className="block text-sm font-medium text-slate-700"
          >
            Preço (R$)
          </label>
          <input
            id="book-price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-invalid={errors.price ? "true" : "false"}
            aria-describedby={errors.price ? "book-price-error" : undefined}
            className="w-full rounded border border-slate-300 p-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.price && (
            <p
              id="book-price-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.price}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
      >
        Adicionar
      </button>
    </form>
  );
}
