import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('My KRA Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My KRA');
  });

  test('REG-KRA-02 Display active KRA cycle header', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByText(/my kras|kra/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-KRA-03 KRA rows are listed', async ({ page }) => {
    await expect(page.getByRole('button', { name: /KRA/i }).first()).toBeVisible();
    await expect(page.getByText(/weightage|%/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-KRA-04 Expand a KRA row', async ({ page }) => {
    await page.getByRole('button', { name: /KRA/i }).first().click();
    await expect(page.getByText(/description|target|weightage|status/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-KRA-05 Validate total weightage section', async ({ page }) => {
    await expect(page.getByText(/total weightage/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-KRA-06 Review state indicators present', async ({ page }) => {
    await expect(page.getByText(/pending|completed|review|due|status/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});
