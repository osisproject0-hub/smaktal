import { test, expect } from '@playwright/test';

test('homepage shows brand and login', async ({ page, baseURL }) => {
  await page.goto('/');
  await expect(page.locator('text=Smart Digital Campus')).toBeVisible();
  await expect(page.locator('text=Masuk dengan Google')).toBeVisible();
});
