import { expect, test } from "@playwright/test";

test("přepínač motivu přepne na světlý režim a zapamatuje si ho", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Přepnout na světlý režim" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("ukázka v hero se dá spustit a po předčasném klepnutí hlásí chybu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Začít ukázku Periferie" }).click();
  await expect(page.getByRole("status").first()).toContainText("Oči na křížek");
  await page.getByRole("button", { name: "Klepnout" }).click();
  await expect(page.getByRole("status").first()).toContainText("Moc brzo");
});

test("dokončená lekce přidá XP a posune lajnu", async ({ page }) => {
  await page.goto("/dnes/");
  const xpBefore = await page.getByTestId("xp-total").innerText();
  await page.getByRole("link", { name: /Začít trénink/ }).click();
  await page.getByRole("button", { name: "Jdeme na to" }).click();
  await page.getByRole("button", { name: "Přeskočit rozcvičku" }).click();
  await page.getByRole("button", { name: "Hotovo, jdu na minihru" }).click();
  await page.getByRole("button", { name: "Konec" }).click();
  await expect(page.getByText("Lekce hotová")).toBeVisible();
  await page.getByRole("link", { name: "Zpátky na Dnes" }).click();
  await expect(page.getByTestId("xp-total")).not.toHaveText(xpBefore);
});
