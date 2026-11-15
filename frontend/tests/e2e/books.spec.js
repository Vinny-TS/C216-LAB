import { expect, test } from "@playwright/test";

function uniqueTitle(prefix) {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function fillBook(page, title, author = "Machado de Assis") {
  await page.getByLabel("Título").fill(title);
  await page.getByLabel("Autor").fill(author);
  await page.getByLabel("Gênero").fill("Romance");
  await page.getByLabel("Ano").fill("1899");
  await page.getByLabel("Páginas").fill("256");
  await page.getByLabel("Preço (R$)").fill("39.90");
}

test.describe("Fluxo de Gerenciamento de Livros", () => {
  test("carrega a interface e finaliza o carregamento", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Gerenciador de Livros" }),
    ).toBeVisible();
    await expect(page.getByText("Carregando livros...")).toBeHidden();
  });

  test("impede cadastro com campos em branco e exibe alerta", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Adicionar" }).click();

    await expect(page.getByText("O título é obrigatório.")).toBeVisible();
    await expect(page.getByText("O autor é obrigatório.")).toBeVisible();
  });

  test("cadastra um livro e ele persiste após recarregar a página", async ({
    page,
  }) => {
    const title = uniqueTitle("Dom Casmurro");
    await page.goto("/");

    await fillBook(page, title);
    await page.getByRole("button", { name: "Adicionar" }).click();

    const item = page.getByRole("listitem").filter({ hasText: title });
    await expect(item).toBeVisible();
    await expect(item).toContainText("Machado de Assis");
    await expect(item).toContainText("Romance");
    await expect(item).toContainText("R$ 39.90");

    await page.reload();
    await expect(item).toBeVisible();
  });

  test("exibe erro ao tentar cadastrar livro duplicado", async ({ page }) => {
    const title = uniqueTitle("Memórias Póstumas");
    await page.goto("/");

    await fillBook(page, title);
    await page.getByRole("button", { name: "Adicionar" }).click();
    await expect(
      page.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();

    await fillBook(page, title);
    await page.getByRole("button", { name: "Adicionar" }).click();

    await expect(page.getByRole("alert")).toContainText(
      "Já existe um livro com esse título e autor",
    );
  });
});
