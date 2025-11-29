import { test, expect } from '@playwright/test';

test('applies theme preset from localStorage', async ({ page }) => {
  // set local storage before load so client reads the preset on mount
  await page.addInitScript(() => {
    localStorage.setItem('theme-preset', 'vibrant');
  });

  await page.goto('/');

  // ensure CSS variable is set to the vibrant primary value defined in ThemeSwitcher
  const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary'));
  expect(primary.trim()).toBe('200 80% 55%');
});
