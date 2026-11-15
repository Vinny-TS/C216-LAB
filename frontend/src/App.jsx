import { useEffect, useState } from "react";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";
import { createBook, listBooks } from "./services/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listBooks()
      .then(setBooks)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function addBook(bookData) {
    const created = await createBook(bookData);
    setBooks((current) => [...current, created]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Gerenciador de Livros
        </h1>
        <p className="text-sm text-slate-600">
          Cadastre e visualize o catálogo de livros.
        </p>
      </header>

      <BookForm onAdd={addBook} />

      <section aria-labelledby="books-heading" className="space-y-3">
        <h2 id="books-heading" className="text-xl font-semibold text-slate-900">
          Livros cadastrados
        </h2>
        {loading ? (
          <p className="text-slate-600">Carregando livros...</p>
        ) : loadError ? (
          <p role="alert" className="text-sm text-red-700">
            {loadError}
          </p>
        ) : (
          <BookList books={books} />
        )}
      </section>
    </main>
  );
}
