// tests/admin.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

const VALID_USERNAME = process.env.USERNAME || 'admin';
const VALID_PASSWORD = process.env.PASSWORD || 'adminpass';
const TEST_FILE_PATH = path.resolve(__dirname, './test.pdf');


test.describe('Admin Page E2E Tests', () => {

  test('Valid Login and File Upload', async ({ page }) => {
    await page.goto('http://localhost:3001/loginPage');

    await page.getByPlaceholder('username').fill(VALID_USERNAME);
    await page.getByPlaceholder('password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('http://localhost:3001/uploadpage');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Select file').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_FILE_PATH);

    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.getByText('File uploaded successfully')).toBeVisible();
  });

  test('Invalid Login Attempt', async ({ page }) => {
    await page.goto('http://localhost:3001/loginPage');

    await page.getByPlaceholder('username').fill('wronguser');
    await page.getByPlaceholder('password').fill('wrongpass');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('http://localhost:3001/loginPage');
    await expect(page.getByText('Invalid Login')).toBeVisible();
  });

  test('Access Upload Page Without Login', async ({ page }) => {
    await page.goto('http://localhost:3001/uploadpage');

    await expect(page).toHaveURL('http://localhost:3001/loginPage');
  });

  test('Logout and Access Upload Page Again', async ({ page, request }) => {
    await page.goto('http://localhost:3001/loginPage');
    await page.getByPlaceholder('username').fill(VALID_USERNAME);
    await page.getByPlaceholder('password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://localhost:3001/uploadpage');

    await request.post('/api/logout');

    await page.goto('http://localhost:3001/uploadpage');
    await expect(page).toHaveURL('http://localhost:3001/loginPage');
  });

  test('Upload Without Selecting File', async ({ page }) => {
    await page.goto('http://localhost:3001/loginPage');
    await page.getByPlaceholder('username').fill(VALID_USERNAME);
    await page.getByPlaceholder('password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://localhost:3001/uploadpage');

    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.getByText('Please select a file first.')).toBeVisible();
  });

});
