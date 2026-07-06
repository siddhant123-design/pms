import { expect, test } from '@playwright/test';
import {
  assertNoVisibleAppError,
  ensureSidebarOpen,
  login,
  openSidebarItem,
  openSidebarSection,
} from '../helpers/pms';

test.describe('Smoke — Operational Metrics @smoke', () => {
  test('SMK-OM-01 Expand Operational Metrics submenu', async ({ page }) => {
    await login(page);
    await ensureSidebarOpen(page);
    await openSidebarSection(page, 'Operational Metrics');
    await expect(page.getByRole('button', { name: 'Jira Utilization', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Attendance', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Compliance', exact: true }).first()).toBeVisible();
  });

  test('SMK-UTIL-01 Navigate to Jira Utilization', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Jira Utilization');
    await expect(page).toHaveURL(/util/);
    await assertNoVisibleAppError(page);
  });

  test('SMK-ATT-01 Navigate to Attendance', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Attendance');
    await expect(page).toHaveURL(/attendance/);
    await assertNoVisibleAppError(page);
  });

  test('SMK-CMP-01 Navigate to My Compliance', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My Compliance');
    await expect(page).toHaveURL(/compliance/);
    await expect(page.getByText(/my compliance assignments/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});
