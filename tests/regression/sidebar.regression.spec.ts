import { expect, test } from '@playwright/test';
import {
  assertNoVisibleAppError,
  login,
  openSidebarItem,
  openSidebarSection,
} from '../helpers/pms';

test.describe('Sidebar Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('REG-SB-02 Expand PMS section and navigate to My KRA', async ({ page }) => {
    await openSidebarSection(page, 'PMS');
    await expect(page.getByRole('button', { name: 'My KRA', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'PMS Dashboard', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '360° Feedback', exact: true }).first()).toBeVisible();
    await openSidebarItem(page, 'My KRA');
    await expect(page).toHaveURL(/kra/);
    await assertNoVisibleAppError(page);
  });

  test('REG-SB-03 Navigate to Dashboard via sidebar', async ({ page }) => {
    await openSidebarItem(page, 'My KRA');
    await expect(page).toHaveURL(/kra/);
    await page.getByRole('button', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/landing/);
    await expect(page.getByRole('heading', { name: /quick links/i }).first()).toBeVisible();
  });

  test('REG-RS-01 Role switcher is accessible', async ({ page }) => {
    const roleButton = page.getByRole('button', { name: /employee/i }).first();
    await roleButton.click();
    await expect(page.getByRole('menuitem').first()).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
