import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('Training Dashboard Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Training Dashboard');
  });

  test('REG-TRN-DASH-02 Page title and lifecycle summary labels', async ({ page }) => {
    await expect(page.getByText(/training dashboard/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Assigned$/i).first()).toBeVisible();
    await expect(page.getByText(/^In Progress$/i).first()).toBeVisible();
    await expect(page.getByText(/^Completed$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-TRN-DASH-03 Assignments table column headers', async ({ page }) => {
    await expect(page.getByText(/^Training Name$/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Start Date$/i).first()).toBeVisible();
    await expect(page.getByText(/^End Date$/i).first()).toBeVisible();
    await expect(page.getByText(/^Status$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-TRN-DASH-04 Training row with status visible', async ({ page }) => {
    await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/assigned|in progress|completed|overdue/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});

test.describe('My Trainings Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My Trainings');
  });

  test('REG-TRN-MY-02 Page title and description', async ({ page }) => {
    await expect(page.getByText(/my trainings/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/view and manage your assigned trainings/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-TRN-MY-03 Trainings table column headers', async ({ page }) => {
    await expect(page.getByText(/^Training Name$/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Training Sheet$/i).first()).toBeVisible();
    await expect(page.getByText(/^Review Manager$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-TRN-MY-04 Training rows with status visible', async ({ page }) => {
    await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/assigned|in progress|overdue/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-TRN-MY-05 Action buttons on training rows', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start|submit/i }).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });
});
