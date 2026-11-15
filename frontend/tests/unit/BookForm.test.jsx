import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookForm } from "../../src/components/BookForm";

async function fillValidBook(user) {
  await user.type(screen.getByLabelText("Título"), "1984");
  await user.type(screen.getByLabelText("Autor"), "George Orwell");
  await user.type(screen.getByLabelText("Gênero"), "Dystopia");
  await user.type(screen.getByLabelText("Ano"), "1949");
  await user.type(screen.getByLabelText("Páginas"), "328");
  await user.type(screen.getByLabelText("Preço (R$)"), "49.90");
}

describe("BookForm", () => {
  it("mostra mensagens de erro e não chama onAdd ao submeter vazio", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<BookForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(screen.getByText("O título é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("O autor é obrigatório.")).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("submete com sucesso chamando onAdd e limpando os campos", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<BookForm onAdd={onAdd} />);

    await fillValidBook(user);
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      title: "1984",
      author: "George Orwell",
      genre: "Dystopia",
      year: 1949,
      pages: 328,
      price: 49.9,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Título")).toHaveValue("");
      expect(screen.getByLabelText("Autor")).toHaveValue("");
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("exibe erro da API, mantém os campos preenchidos e desabilita o botão enquanto envia", async () => {
    const user = userEvent.setup();
    let rejectPromise;
    const onAdd = vi.fn(
      () =>
        new Promise((_, reject) => {
          rejectPromise = reject;
        }),
    );
    render(<BookForm onAdd={onAdd} />);

    await fillValidBook(user);
    const submitButton = screen.getByRole("button", { name: "Adicionar" });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    rejectPromise(new Error("Já existe um livro com esse título e autor"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Já existe um livro com esse título e autor",
    );
    expect(screen.getByLabelText("Título")).toHaveValue("1984");
    expect(screen.getByLabelText("Autor")).toHaveValue("George Orwell");
    expect(submitButton).toBeEnabled();
  });
});
