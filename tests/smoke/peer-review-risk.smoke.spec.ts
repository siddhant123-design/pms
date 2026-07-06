import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('Smoke — Peer Review & Risk @smoke', () => {
  test('SMK-PR-01 Navigate to Peer Review', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Peer Review');
    await expect(page).toHaveURL(/peer-review/);
    await assertNoVisibleAppError(page);
  });

  test('SMK-RSK-01 Navigate to Project Risk Summary', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Project Risk Summary');
    await expect(page).toHaveURL(/risk-management|assignments/);
    await assertNoVisibleAppError(page);
  });
});
