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
      createdAt: new Date().toISOString()
    }]));
    localStorage.setItem('coffee_shots', JSON.stringify(seed.shots.map(shot => ({
      id: shot.id,
      beanId: shot.beanId || 'bean-1',
      grindSize: 5,
      doseIn: 18,
      yieldOut: 36,
      extractionTime: 27,
      rating: 'great',
      notes: shot.notes || '',
      shotDate: shot.shotDate || todayStr,
      createdAt: shot.createdAt || new Date().toISOString()
    }))));
    localStorage.setItem('coffee_portafilters', '[]');
  }, { shots });
}

async function seedBeanCollections(page, { active = 1, archived = 1 } = {}) {
  await page.evaluate(({ activeCount, archivedCount }) => {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const beans = [];
    for (let index = 0; index < activeCount; index++) {
      beans.push({
        id: `active-${index + 1}`,
        name: `Active Bean ${index + 1}`,
        roaster: 'Current Roaster',
        roastDate: todayStr,
        rating: null,
        notes: '',
        isArchived: false,
        createdAt: new Date(Date.now() - index * 1000).toISOString()
      });
    }
    for (let index = 0; index < archivedCount; index++) {
      beans.push({
        id: `archived-${index + 1}`,
        name: `Archived Bean ${index + 1}`,
        roaster: 'Archive Roaster',
        roastDate: todayStr,
        rating: null,
        notes: '',
        isArchived: true,
        createdAt: new Date(Date.now() - (activeCount + index) * 1000).toISOString()
      });
    }
    localStorage.setItem('coffee_beans', JSON.stringify(beans));
    localStorage.setItem('coffee_shots', '[]');
    localStorage.setItem('coffee_portafilters', '[]');
  }, { activeCount: active, archivedCount: archived });
}

test('app shell loads without runtime errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');

  await expect(page).toHaveTitle('Coffee Journal');
  await expect(page.locator('.app-shell')).toBeVisible();
  const tabBar = page.locator('.tab-bar');
  await expect(tabBar.getByRole('button', { name: 'Home' })).toBeVisible();
  await expect(tabBar.getByRole('button', { name: 'Home' }).locator('[data-testid="home-tab-icon"]')).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Today/ })).toHaveCount(0);
  await expect(tabBar.getByRole('button', { name: /Beans/ })).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Coffee/ })).toHaveCount(0);
  await expect(tabBar.getByRole('button', { name: /Beans/ }).locator('[data-testid="beans-tab-icon"]')).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Calendar/ })).toBeVisible();
  await expect(tabBar.getByRole('button', { name: /Stats/ })).toBeVisible();
  await tabBar.getByRole('button', { name: /Stats/ }).click();
  await expect(page.getByText('No stats yet')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Home shows top stats and the three most recent shots with pull dates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const day = offset => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  };
  const shots = [0, -1, -2, -3].map(offset => ({
    id: `home-shot-${Math.abs(offset)}`,
    notes: `Shot ${offset}`,
    shotDate: day(offset),
    createdAt: new Date(Date.now() + offset * 86400000).toISOString()
  }));
  await seedCoffeeData(page, { shots });
  await page.reload();

  const expectedWeekday = await page.evaluate(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  await expect(page.getByTestId('home-heading')).toHaveText(expectedWeekday);
  await expect(page.getByTestId('home-total-shots')).toHaveText('4');
  await expect(page.getByTestId('home-current-run')).toHaveText('4 days');
  await expect(page.getByTestId('home-recent-shot')).toHaveCount(3);
  await expect(page.getByTestId('home-recent-shot-home-shot-0')).toContainText(
    new Date(day(0) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  await expect(page.getByTestId('home-recent-shot-home-shot-3')).toHaveCount(0);

  const statItems = page.getByTestId('home-stats').locator('.stats-count-item');
  await expect(statItems).toHaveCount(2);
  const statBoxes = await statItems.evaluateAll(items => items.map(item => {
    const rect = item.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top };
  }));
  expect(Math.round(statBoxes[0].top)).toBe(Math.round(statBoxes[1].top));
  expect(statBoxes[1].left).toBeGreaterThan(statBoxes[0].right);
  expect(statBoxes[1].right).toBeLessThanOrEqual(375);

  await page.getByTestId('home-recent-shot-home-shot-0').click();
  await expect(page.getByRole('heading', { name: 'Edit Shot' })).toBeVisible();
  await page.locator('.panel .back-btn').click();

  const newestShot = page.getByTestId('home-recent-shot-home-shot-0');
  const newestShotSwipe = newestShot.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " today-shot-swipe ")]');
  await newestShotSwipe.locator('.today-shot-swipe-actions').dispatchEvent('click');
  await expect(page.getByTestId('home-total-shots')).toHaveText('3');
  await expect(newestShot).toHaveCount(0);
  await expect(page.getByTestId('home-recent-shot-home-shot-3')).toBeVisible();
});

test('Beans separates current and archive collections with stable return behavior', async ({ page }) => {
  await page.goto('/');
  await seedBeanCollections(page);
  await page.reload();

  await page.locator('.tab-bar').getByRole('button', { name: 'Beans' }).click();
  await expect(page.getByRole('heading', { name: 'Beans', exact: true })).toBeVisible();

  const currentTab = page.getByRole('tab', { name: 'Current' });
  const archiveTab = page.getByRole('tab', { name: 'Archive' });
  const currentPanel = page.locator('#current-beans-panel');
  await expect(currentTab).toHaveAttribute('aria-selected', 'true');
  await expect(currentPanel.getByText('Active Bean 1')).toBeVisible();
  await expect(currentPanel.getByText('Archived Bean 1')).toHaveCount(0);

  await archiveTab.press('Enter');
  const archivePanel = page.locator('#archive-beans-panel');
  await expect(archiveTab).toHaveAttribute('aria-selected', 'true');
  await expect(archivePanel.getByText('Archived Bean 1')).toBeVisible();
  await expect(archivePanel.getByText('Active Bean 1')).toHaveCount(0);
  await expect(archivePanel.locator('.bean-card.archived')).toHaveCount(0);
  await expect(archivePanel.getByText('Archived', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add Bean' })).toHaveCount(0);

  await archivePanel.getByText('Archived Bean 1').click();
  await page.getByTestId('bean-detail').getByRole('button', { name: 'Back to Beans' }).click();
  await expect(archiveTab).toHaveAttribute('aria-selected', 'true');

  await currentTab.click();
  await page.locator('#current-beans-panel').getByText('Active Bean 1').click();
  await page.getByRole('button', { name: 'Archive Bean' }).click();
  await expect(currentTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#current-beans-panel').getByText('Active Bean 1')).toHaveCount(0);

  await archiveTab.click();
  await page.locator('#archive-beans-panel').getByText('Archived Bean 1').click();
  await page.getByRole('button', { name: 'Bring Back Bean' }).click();
  await expect(archiveTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#archive-beans-panel').getByText('Archived Bean 1')).toHaveCount(0);

  await page.locator('.tab-bar').getByRole('button', { name: 'Calendar' }).click();
  await page.locator('.tab-bar').getByRole('button', { name: 'Beans' }).click();
  await expect(currentTab).toHaveAttribute('aria-selected', 'true');
});

test('Beans collection empty states and Home archive entry stay reachable', async ({ page }) => {
  await page.goto('/');
  await seedBeanCollections(page, { active: 0, archived: 5 });
  await page.reload();

  await page.getByRole('button', { name: /Or restore from archive/ }).click();
  await page.getByRole('button', { name: /View all 5 archived beans/ }).click();
  await expect(page.getByRole('tab', { name: 'Archive' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#archive-beans-panel').getByText('Archived Bean 1')).toBeVisible();
  await expect(page.locator('#archive-beans-panel').getByText('Archived Bean 5')).toBeVisible();
  await expect(page.locator('#archive-beans-panel .bean-card')).toHaveCount(5);

  await page.getByRole('tab', { name: 'Current' }).click();
  await expect(page.getByText('No current beans')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Bean' })).toBeVisible();

  await seedBeanCollections(page, { active: 1, archived: 0 });
  await page.reload();
  await page.locator('.tab-bar').getByRole('button', { name: 'Beans' }).click();
  await page.getByRole('tab', { name: 'Archive' }).click();
  await expect(page.getByText('No archived beans')).toBeVisible();
  await expect(page.locator('.bean-card')).toHaveCount(0);
});

test('freshness stages live below Calendar and remain visible without beans', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('coffee_beans', '[]');
    localStorage.setItem('coffee_shots', '[]');
    localStorage.setItem('coffee_portafilters', '[]');
  });
  await page.reload();

  await page.locator('.tab-bar').getByRole('button', { name: 'Calendar' }).click();
  const freshnessGuide = page.locator('[data-testid="calendar-freshness-stages"]');
  await expect(freshnessGuide).toBeVisible();
  await expect(freshnessGuide).toContainText('Resting');
  await expect(freshnessGuide).toContainText('0–6 days post-roast');
  await expect(freshnessGuide).toContainText('At Peak');
  await expect(freshnessGuide).toContainText('7–21 days post-roast');
  await expect(freshnessGuide).toContainText('Past Peak');
  await expect(freshnessGuide).toContainText('22+ days post-roast');
  await expect(freshnessGuide).toContainText('Extraction can be gassy and less consistent.');
  await expect(freshnessGuide).toContainText('Best balance of stable extraction and vibrant flavor.');
  await expect(freshnessGuide).toContainText('Flavor and aromatics may fade. Still brewable, but expect less pop.');
  await expect(freshnessGuide.locator('.freshness-legend-dot.resting')).toBeVisible();
  await expect(freshnessGuide.locator('.freshness-legend-dot.at-peak')).toBeVisible();
  await expect(freshnessGuide.locator('.freshness-legend-dot.past-peak')).toBeVisible();
  await expect(page.locator('.calendar-note')).toHaveCount(0);

  await page.locator('.tab-bar').getByRole('button', { name: 'Beans' }).click();
  await expect(page.locator('#current-beans-panel').getByText('Freshness Stages')).toHaveCount(0);
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
  await expect(dailyShot.locator('.shot-visualizer-fill')).toHaveCount(3);
  await expect(dailyShot.locator('.shot-visualizer-point')).toHaveCount(3);
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
  await expect(shotForm.locator('.shot-visualizer-fill')).toHaveCount(3);
  await expect(shotForm.locator('.shot-visualizer-point')).toHaveCount(3);
  await expect(shotForm.locator('.shot-assessment-chip')).toContainText('Well-extracted');
});

test('Home selection can be cleared and the shot form keeps its close control visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 640 });
  await page.goto('/');
  await seedCoffeeData(page, { shots: [{ id: 'shot-1' }] });
  await page.reload();

  await page.locator('.bean-picker-trigger').click();
  await page.locator('.bean-picker-option').filter({ hasText: 'Ethiopia Guji' }).first().click();
  await expect(page.getByTestId('daily-clear-bean')).toBeVisible();
  await expect(page.locator('.daily-guidance-card')).toBeVisible();

  await page.getByTestId('daily-log-shot').click();
  const panel = page.locator('.shot-form-panel');
  const header = panel.locator('.shot-form-header');
  await panel.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect(header.getByRole('button', { name: 'Close shot form' })).toBeVisible();
  const [panelBox, headerBox] = await Promise.all([panel.boundingBox(), header.boundingBox()]);
  expect(headerBox.y).toBeGreaterThanOrEqual(panelBox.y);
  expect(headerBox.y).toBeLessThan(panelBox.y + 8);
  await header.getByRole('button', { name: 'Close shot form' }).click();

  await page.locator('.bean-picker-trigger').click();
  await page.locator('.bean-picker-option').filter({ hasText: 'Ethiopia Guji' }).first().click();
  await page.getByTestId('daily-clear-bean').click();
  await expect(page.locator('.daily-guidance-card')).toHaveCount(0);
  await expect(page.locator('.bean-picker-trigger')).toContainText('Choose a coffee bean');
});

test('Bean detail keeps ratings high, separates quality from recipe, and exposes desktop history actions', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 720 });
  await page.goto('/');
  const shots = Array.from({ length: 7 }, (_, index) => ({
    id: `detail-shot-${index}`,
    shotDate: `2026-07-${String(15 - index).padStart(2, '0')}`,
    createdAt: new Date(2026, 6, 15 - index).toISOString()
  }));
  await seedCoffeeData(page, { shots });
  await page.reload();

  const newestShot = page.getByTestId('home-recent-shot-detail-shot-0');
  const desktopDelete = newestShot.getByRole('button', { name: 'Delete shot' });
  await expect(desktopDelete).toBeVisible();
  await desktopDelete.click();
  await expect(newestShot).toBeVisible();
  const confirmDelete = newestShot.getByRole('button', { name: 'Confirm delete shot' });
  await expect(confirmDelete).toContainText('Delete?');
  await confirmDelete.click();
  await expect(newestShot).toHaveCount(0);
  const undoNotice = page.getByRole('status');
  await expect(undoNotice).toContainText('Shot deleted');
  await undoNotice.getByRole('button', { name: 'Undo' }).click();
  await expect(newestShot).toBeVisible();

  await page.locator('.tab-bar').getByRole('button', { name: 'Beans' }).click();
  await page.locator('#current-beans-panel .bean-card').filter({ hasText: 'Ethiopia Guji' }).click();

  const rating = page.locator('.bean-detail-stars');
  const history = page.getByTestId('bean-shot-history');
  const [ratingBox, historyBox] = await Promise.all([rating.boundingBox(), history.boundingBox()]);
  expect(ratingBox.y).toBeLessThan(historyBox.y);
  const fourStarRating = rating.getByRole('button', { name: 'Rate bean 4 stars' });
  await expect(fourStarRating).toHaveAttribute('aria-pressed', 'false');
  await fourStarRating.click();
  await expect(fourStarRating).toHaveAttribute('aria-pressed', 'true');

  const firstShot = history.locator('.bean-shot-swipe-row').first();
  const badgeBox = await firstShot.locator('.shot-quality-badge').boundingBox();
  const recipeBox = await firstShot.locator('.recipe-measurements').boundingBox();
  expect(badgeBox.y + badgeBox.height).toBeLessThanOrEqual(recipeBox.y);
  await expect(firstShot.getByRole('button', { name: 'Delete shot' })).toBeVisible();

  const expand = page.getByTestId('shot-history-expand');
  await expect(expand).toHaveText('View 2 more shots');
  await expand.click();
  await expect(history.locator('.bean-shot-swipe-row')).toHaveCount(7);
  await expect(expand).toHaveText('Show recent 5 shots');
});

test('portafilter can be created while logging and appears on the saved shot', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await seedCoffeeData(page);
  await page.reload();

  await page.locator('.bean-picker-trigger').click();
  await page.locator('.bean-picker-option').filter({ hasText: 'Ethiopia Guji' }).first().click();
  await page.getByTestId('daily-log-shot').click();

  await page.getByTestId('portafilter-manage').click();
  await page.getByTestId('portafilter-add').click();
  await page.getByTestId('portafilter-name').fill('Breville Stock');
  await page.getByTestId('portafilter-save').click();

  await expect(page.getByTestId('portafilter-select')).toHaveValue(/.+/);
  await expect(page.getByTestId('portafilter-trigger')).toContainText('Breville Stock');
  await page.getByRole('button', { name: 'Save Shot' }).click();
  await expect(page.locator('.today-shot-item').first().locator('.shot-portafilter-label')).toHaveText('Breville Stock');
  expect(pageErrors).toEqual([]);
});

for (const testPage of ['tests.html', 'test-e2e.html']) {
  test(`${testPage} reports zero failures`, async ({ page }) => {
    await page.goto(`/${testPage}`);

    await expect(page.locator('#summary')).toContainText(/0 failed/);
  });
}
