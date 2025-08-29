import crypto from "node:crypto";
import { expect, test } from "@playwright/test";
import database from "@/api/database";

test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:${process.env.PORT}/company/create`);
});

test.describe("Create Company", () => {
  test("Can load the page", async ({ page }) => {
    // Nav bar
    const navElements = [
      ["/Home", "/"],
      ["/Companies", "/company"],
    ];
    const links = await page.getByRole("link");
    await expect(links).toHaveCount(2);
    for (let i = 0; i < (await links.count()); i++) {
      expect(await links.nth(i).textContent()).toEqual(navElements[i][0]);
      await expect(links.nth(i)).toHaveAttribute("href", navElements[i][1]);
    }

    // Page
    await expect(page.getByRole("textbox")).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Create!" })).toBeTruthy();
  });
  test("Fails to create when missing a url", async ({ page }) => {
    await page.getByLabel("Company Name").fill("Company A");
    await page.getByRole("button", { name: "Create!" }).click();

    await expect(page).toHaveURL(`http://localhost:${process.env.PORT}/company/create`);
    await expect(page.getByText("Please fill out this field.")).toBeTruthy();
  });
  test("Can create a company", async ({ page }) => {
    const companyId = crypto.randomUUID();
    await page.getByLabel("Company Name").fill(companyId);
    await page.getByLabel("Company URL").fill(`https://${companyId}.com`);
    await page.getByRole("button", { name: "Create!" }).click();

    // assertions
    await expect(page).toHaveURL(/http:\/\/localhost:[0-9]+\/company\/[0-9]+/);
    const record = database
      .prepare("SELECT name, url FROM companies WHERE id = ?")
      .get(parseInt(page.url().match(/([0-9]+)$/)?.[1] || "", 10));

    expect(record?.name).toEqual(companyId);
    expect(record?.url).toEqual(`https://${companyId}.com`);
  });
});
