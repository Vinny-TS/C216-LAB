import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookForm } from "../../src/components/BookForm";

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
    const onAdd = vi.fn();
    render(<BookForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText("Título"), "1984");
    await user.type(screen.getByLabelText("Autor"), "George Orwell");
    await user.type(screen.getByLabelText("Gênero"), "Dystopia");
    await user.type(screen.getByLabelText("Ano"), "1949");
    await user.type(screen.getByLabelText("Páginas"), "328");
    await user.type(screen.getByLabelText("Preço (R$)"), "49.90");

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

    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(screen.getByLabelText("Autor")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
