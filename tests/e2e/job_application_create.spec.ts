import crypto from "node:crypto";
import { expect, test } from "@playwright/test";
import database from "@/api/database";

const companyId = crypto.randomUUID();
test.beforeAll(() => {
  database
    .prepare("INSERT INTO companies(name, url) VALUES (?, ?)")
    .run(companyId, `https://${companyId}.com`);
});
test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:${process.env.PORT}/job_application/create`);
});

test.describe("Job Application Creation", () => {
  test("Can load the page", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: "Role" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Status" })).toBeVisible();
  });
  test("Fails to create when missing attributes", async ({ page }) => {
    // company
    await page.getByRole("combobox", { name: "Company" }).selectOption(companyId);
    // status
    await page.getByRole("combobox", { name: "Status" }).selectOption("Rejected");
    // date
    await page.getByLabel("Application Submitted At:").fill("2025-01-01T12:00");

    await page.getByRole("button", { name: "Create!" }).click();

    // Currently button is disabled, so will not even trigger?
    // await expect(page.getByText('Please fill out this field.')).toBeVisible();
    expect(page).toHaveURL(`http://localhost:${process.env.PORT}/job_application/create`);
  });

  test("Can create a job application", async ({ page }) => {
    const jobTitle = crypto.randomUUID();
    await page.getByRole("textbox", { name: "Role" }).fill(jobTitle);
    await page.getByRole("combobox", { name: "Company" }).selectOption(companyId);
    await page.getByRole("combobox", { name: "Status" }).selectOption("Applied");
    await page.getByLabel("Application Submitted At:").fill("2025-01-01T12:00");

    await page.getByRole("button", { name: "Create!" }).click();
    await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();

    const record = database
      .prepare(
        "SELECT ja.* FROM job_applications ja INNER JOIN companies c ON c.id = ja.company_id WHERE ja.title = ? AND c.name = ?",
      )
      .get(jobTitle, companyId);
    await expect(page).toHaveURL(
      `http://localhost:${process.env.PORT}/job_application/${record.id}`,
    );
  });
});
