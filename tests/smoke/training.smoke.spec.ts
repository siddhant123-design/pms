import { expect, test } from '@playwright/test';
import {
  assertNoVisibleAppError,
  ensureSidebarOpen,
  login,
  openSidebarItem,
  openSidebarSection,
} from '../helpers/pms';

test.describe('Smoke — Training @smoke', () => {
  test('SMK-TRN-01 Expand Training submenu', async ({ page }) => {
    await login(page);
    await ensureSidebarOpen(page);
    await openSidebarSection(page, 'Training');
    await expect(page.getByRole('button', { name: 'Training Dashboard', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Trainings', exact: true }).first()).toBeVisible();
  });

  test('SMK-TRN-DASH-01 Navigate to Training Dashboard', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Training Dashboard');
    await expect(page).toHaveURL(/training-dashboard/);
    await assertNoVisibleAppError(page);
  });

  test('SMK-TRN-MY-01 Navigate to My Trainings', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My Trainings');
    await expect(page).toHaveURL(/my-trainings/);
    await assertNoVisibleAppError(page);
  });
});
