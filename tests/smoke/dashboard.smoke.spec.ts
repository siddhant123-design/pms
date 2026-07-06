import { expect, test } from '@playwright/test';
import {
  assertNoVisibleAppError,
  ensureSidebarOpen,
  login,
  openQuickLink,
} from '../helpers/pms';

test.describe('Smoke @smoke', () => {
  test('SMK-DASH-01 Login and employee landing dashboard', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/landing/);
    await expect(page.getByRole('heading', { name: /personal details/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /quick links/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('SMK-DASH-02 Sidebar main sections visible', async ({ page }) => {
    await login(page);
    await ensureSidebarOpen(page);
    await expect(page.getByRole('button', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^PMS/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /operational metrics/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^skills/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Peer Review', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Project Risk Summary', exact: true }).first()).toBeVisible();
  });

  test('SMK-DASH-03 Quick link opens My Reviews', async ({ page }) => {
    await login(page);
    await openQuickLink(page, 'My Reviews');
    await expect(page).toHaveURL(/review/);
    await assertNoVisibleAppError(page);
  });
});
