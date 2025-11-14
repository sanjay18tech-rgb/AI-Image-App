import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const fixturesDir = path.resolve(__dirname, '../fixtures');
const sampleImage = path.join(fixturesDir, 'sample.png');
const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

test.beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  if (!fs.existsSync(sampleImage)) {
    fs.writeFileSync(sampleImage, Buffer.from(samplePngBase64, 'base64'));
  }
});

test('signup, generate, view history, and restore', async ({ page }) => {
  const email = `playwright+${randomUUID()}@modelia.dev`;
  const password = 'Playwright!23';

  await page.goto('/');

  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign up/i }).click();

  await expect(page.getByRole('button', { name: /generate fashion design/i })).toBeVisible();

  await page.setInputFiles('input[type="file"]', sampleImage);
  await page.getByLabel('Write prompt').fill('A bold editorial streetwear look with neon lighting.');
  await page.getByRole('button', { name: /generate fashion design/i }).click();

  await expect(page.getByText(/generation completed successfully/i)).toBeVisible();
  await expect(page.getByText(/recent generations/i)).toBeVisible();

  const historyCard = page.getByText(/bold editorial streetwear/i).first();
  await historyCard.click();

  await expect(page.getByText(/generation restored/i)).toBeVisible();
});
