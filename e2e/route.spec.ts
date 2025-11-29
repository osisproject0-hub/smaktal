import { test, expect } from '@playwright/test';

test('dashboard redirect when unauthenticated', async ({ page }) => {
  // visiting dashboard without auth should redirect to home (client-side redirect happens)
  await page.goto('/dashboard');

  // app should redirect unauthenticated users to the homepage
  await expect(page).toHaveURL('/');
});
