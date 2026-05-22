const { test, expect } = require('@playwright/test');

async function seedCoffeeData(page, { shots = [] } = {}) {
  await page.evaluate(seed => {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    localStorage.setItem('coffee_beans', JSON.stringify([{
      id: 'bean-1',
      name: 'Ethiopia Guji',
      roaster: 'Demo Roaster',
      roastDate: todayStr,
      rating: null,
      notes: '',
      isArchived: false,
      optimalGrindSize: 5,
      optimalDoseIn: 18,
      optimalYieldOut: 36,
      optimalExtractionTime: 27,
      createdAt: new Date().toISOString()
    }]));
    localStorage.setItem('coffee_shots', JSON.stringify(seed.shots.map(shot => ({
      id: shot.id,
      beanId: 'bean-1',
      grindSize: 5,
      doseIn: 18,
      yieldOut: 36,
      extractionTime: 27,
      rating: 'great',
      notes: shot.notes || '',
      shotDate: todayStr,
      createdAt: new Date().toISOString()
    }))));
  }, { shots });
}

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
  await expect(tabBar.getByRole('button', { name: /Stats/ })).toBeVisible();
  await tabBar.getByRole('button', { name: /Stats/ }).click();
  await expect(page.getByText('No stats yet')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('backup panel opens with valid quick-step copy', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Backup' }).click();

  await expect(page.getByRole('heading', { name: 'Backup & Restore' })).toBeVisible();
  await expect(page.getByText('A file like `coffee-journal-backup-YYYY-MM-DD.json` should download to your device.')).toBeVisible();
  await expect(page.getByText('device.p>')).toHaveCount(0);
});

test('shot visualizer and assessment chips render in daily log and shot form', async ({ page }) => {
  await page.goto('/');
  await seedCoffeeData(page, { shots: [{ id: 'shot-1', notes: 'Sweet and balanced' }] });
  await page.reload();

  const dailyShot = page.locator('.today-shot-item').first();
  await expect(dailyShot.locator('.shot-visualizer-fill')).toHaveCount(2);
  await expect(dailyShot.locator('.shot-visualizer-point')).toHaveCount(2);
  await expect(dailyShot.locator('.shot-visualizer-point').first()).toHaveAttribute('style', /left: /);
  await expect(dailyShot.locator('.shot-assessment-chip')).toContainText('Well-extracted');

  await page.locator('.bean-picker-trigger').click();
  await page.locator('.bean-picker-option').filter({ hasText: 'Ethiopia Guji' }).first().click();

  const guidanceCard = page.locator('.daily-guidance-card');
  await expect(guidanceCard).toContainText('Last shot');
  await expect(guidanceCard).toContainText('Ethiopia Guji');
  await expect(guidanceCard.locator('.shot-assessment-chip')).toContainText('Well-extracted');
  await guidanceCard.getByRole('button', { name: 'Log Shot' }).click();

  const shotForm = page.locator('.panel');
  await expect(shotForm.getByRole('heading', { name: 'Log Shot' })).toBeVisible();
  await expect(shotForm.locator('.shot-visualizer-fill')).toHaveCount(2);
  await expect(shotForm.locator('.shot-visualizer-point')).toHaveCount(2);
  await expect(shotForm.locator('.shot-assessment-chip')).toContainText('Well-extracted');
});

for (const testPage of ['tests.html', 'test-e2e.html']) {
  test(`${testPage} reports zero failures`, async ({ page }) => {
    await page.goto(`/${testPage}`);

    await expect(page.locator('#summary')).toContainText(/0 failed/);
  });
}
