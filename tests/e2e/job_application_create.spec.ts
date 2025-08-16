import crypto from 'node:crypto';
import { test, expect } from '@playwright/test';
import database from '@/api/database';

const companyId = crypto.randomUUID();
test.beforeAll(() => {
  database.prepare('INSERT INTO companies(name, url) VALUES (?, ?)')
          .run(companyId, `https://${companyId}.com`);
});
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/job_application/create');
});

test.describe('Job Application Creation', () => {
  test('Can load the page', async ({ page }) => {
    expect(await page.getByRole('textbox', { name: 'Role' })).toBeVisible();
    expect(await page.getByRole('combobox', { name: 'Status' })).toBeVisible();
  });
  test('Fails to create when missing attributes', async ({ page }) => {
    // company
    await page.getByRole('combobox', { name: 'Company' }).click();
    await page.getByText(companyId).click();
    // status
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByText('Rejected').click();
    // date
    await page.getByLabel('Application Submitted At:').fill('2025-01-01T12:00');
    
    await page.getByText('Create!').click();
    
    await expect(page.getByText('Please fill out this field.')).toBeVisible();
    expect(page).toHaveURL('http://localhost:3000/job_application/create');
  });

});