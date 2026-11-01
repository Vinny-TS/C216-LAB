import { expect, test } from "@playwright/test";

test.describe("Fluxo de Gerenciamento de Livros", () => {
  test("carrega a interface e exibe o estado inicial", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Gerenciador de Livros" }),
    ).toBeVisible();
    await expect(page.getByText("Nenhum livro cadastrado.")).toBeVisible();
  });

  test("impede cadastro com campos em branco e exibe alerta", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Adicionar" }).click();

    await expect(page.getByText("O título é obrigatório.")).toBeVisible();
    await expect(page.getByText("O autor é obrigatório.")).toBeVisible();
    await expect(page.getByText("Nenhum livro cadastrado.")).toBeVisible();
  });

  test("cadastra um livro e o exibe na listagem", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Título").fill("Dom Casmurro");
    await page.getByLabel("Autor").fill("Machado de Assis");
    await page.getByLabel("Gênero").fill("Romance");
    await page.getByLabel("Ano").fill("1899");
    await page.getByLabel("Páginas").fill("256");
    await page.getByLabel("Preço (R$)").fill("39.90");

    await page.getByRole("button", { name: "Adicionar" }).click();

    const listItem = page.getByRole("listitem");
    await expect(listItem).toBeVisible();
    await expect(listItem).toContainText("Dom Casmurro");
    await expect(listItem).toContainText("Machado de Assis");
    await expect(listItem).toContainText("Romance");
    await expect(listItem).toContainText("R$ 39.90");

    await expect(page.getByText("Nenhum livro cadastrado.")).toBeHidden();
  });
});
