const { test, expect } = require('@playwright/test');

test('app shell loads without runtime errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');

  await expect(page).toHaveTitle('Coffee Journal');
  await expect(page.locator('.app-shell')).toBeVisible();
  const tabBar = page.locator('.tab-bar');
  await expect(tabBar.getByRole('button', { name: /Today/ })).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Coffee/ })).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Calendar/ })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('backup panel opens with valid quick-step copy', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Backup' }).click();

  await expect(page.getByRole('heading', { name: 'Backup & Restore' })).toBeVisible();
  await expect(page.getByText('A file like `coffee-journal-backup-YYYY-MM-DD.json` should download to your device.')).toBeVisible();
  await expect(page.getByText('device.p>')).toHaveCount(0);
});

for (const testPage of ['tests.html', 'test-e2e.html']) {
  test(`${testPage} reports zero failures`, async ({ page }) => {
    await page.goto(`/${testPage}`);

    await expect(page.locator('#summary')).toContainText(/0 failed/);
  });
}
