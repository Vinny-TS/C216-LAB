import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("Integração: App", () => {
  it("cadastra um livro pelo formulário e o exibe na lista de livros", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Nenhum livro cadastrado.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Título"), "Dom Casmurro");
    await user.type(screen.getByLabelText("Autor"), "Machado de Assis");
    await user.type(screen.getByLabelText("Gênero"), "Romance");
    await user.type(screen.getByLabelText("Ano"), "1899");
    await user.type(screen.getByLabelText("Páginas"), "256");
    await user.type(screen.getByLabelText("Preço (R$)"), "39.90");

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Dom Casmurro")).toBeInTheDocument();
    expect(screen.getByText("Machado de Assis")).toBeInTheDocument();
    expect(screen.getByText("Romance")).toBeInTheDocument();
    expect(screen.getByText("R$ 39.90")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum livro cadastrado."),
    ).not.toBeInTheDocument();
  });
});
