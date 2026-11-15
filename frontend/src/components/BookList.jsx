export function BookList({ books = [] }) {
  if (books.length === 0) {
    return <p className="text-slate-600">Nenhum livro cadastrado.</p>;
  }

  return (
    <ul className="space-y-3">
      {books.map((book) => (
        <li
          key={book.id}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-1"
        >
          <p className="font-semibold text-lg text-slate-900">{book.title}</p>
          <p className="text-sm text-slate-600">
            Autor:{" "}
            <span className="font-medium text-slate-800">{book.author}</span>
          </p>
          <p className="text-sm text-slate-600">
            Gênero:{" "}
            <span className="font-medium text-slate-800">{book.genre}</span>
          </p>
          <p className="text-sm text-slate-600">
            Ano: <span className="font-medium text-slate-800">{book.year}</span>{" "}
            &bull; Páginas:{" "}
            <span className="font-medium text-slate-800">{book.pages}</span>
          </p>
          <p className="text-sm font-semibold text-blue-600">
            R$ {Number(book.price).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}
