import { useState } from "react";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";

export default function App() {
  const [books, setBooks] = useState([]);

  // Na Prática 7, esta função passará a chamar a API (POST /books).
  function addBook(bookData) {
    setBooks((current) => [
      ...current,
      { id: crypto.randomUUID(), ...bookData },
    ]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Gerenciador de Livros
        </h1>
        <p className="text-sm text-slate-600">
          Cadastre e visualize o catálogo de livros em memória.
        </p>
      </header>

      <BookForm onAdd={addBook} />

      <section aria-labelledby="books-heading" className="space-y-3">
        <h2 id="books-heading" className="text-xl font-semibold text-slate-900">
          Livros cadastrados
        </h2>
        <BookList books={books} />
      </section>
    </main>
  );
}
