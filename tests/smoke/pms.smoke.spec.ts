import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('Smoke — PMS @smoke', () => {
  test('SMK-KRA-01 Navigate to My KRA', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My KRA');
    await expect(page).toHaveURL(/kra/);
    await assertNoVisibleAppError(page);
  });

  test('SMK-PDM-01 Navigate to PMS Dashboard', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'PMS Dashboard');
    await expect(page).toHaveURL(/pms/);
    await expect(page.getByText(/pms dashboard/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('SMK-FB-01 Navigate to 360 Feedback', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, '360 Feedback');
    await expect(page).toHaveURL(/360-feedback/);
    await expect(page.getByRole('heading', { name: /360° manager feedback/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});
