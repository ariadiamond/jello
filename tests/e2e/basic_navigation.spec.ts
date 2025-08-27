import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:${process.env.PORT}/`);
});

test.describe('Can Navigate', () => {
  test('Loads through to Job Applications Create', async ({ page }) => {
    page.getByText('Job Applications').click();
    await expect(page).toHaveURL(`http://localhost:${process.env.PORT}/job_application`);
    page.getByText('Create').click();
    await expect(page).toHaveURL(`http://localhost:${process.env.PORT}/job_application/create`);
  });

  test('Loads through to Company Create', async ({ page }) => {
    page.getByText('Companies').click();
    await expect(page).toHaveURL(`http://localhost:${process.env.PORT}/company`);
    page.getByText('Create').click();
    await expect(page).toHaveURL(`http://localhost:${process.env.PORT}/company/create`);
  });
});