import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openQuickLink } from '../helpers/pms';

test.describe('Dashboard Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('REG-DASH-02 Dashboard content fully loaded', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /quick links/i }).first()).toBeVisible();
    await expect(page.getByText(/loading/i)).toHaveCount(0);
    await assertNoVisibleAppError(page);
  });

  test('REG-QL-02 Open Utilization from Quick Links', async ({ page }) => {
    await openQuickLink(page, 'Utilization');
    await expect(page).toHaveURL(/util/);
    await expect(page.getByRole('heading', { name: /utilization chart/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '1M' }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-QL-03 Open Update Skills from Quick Links', async ({ page }) => {
    await openQuickLink(page, 'Update Skills');
    await expect(page).toHaveURL(/skill/);
    await expect(page.getByRole('heading', { name: /additional skills|remarks/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-QL-04 Navigate multiple quick links sequentially', async ({ page }) => {
    await openQuickLink(page, 'Utilization');
    await expect(page).toHaveURL(/util/);
    await page.goBack();
    await openQuickLink(page, 'Update Skills');
    await expect(page).toHaveURL(/skill/);
    await assertNoVisibleAppError(page);
  });
});
