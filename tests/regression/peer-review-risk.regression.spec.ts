import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('Peer Review Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Peer Review');
  });

  test('REG-PR-02 Page heading and summary counts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my peer reviews/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/pending/i).first()).toBeVisible();
    await expect(page.getByText(/completed/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-PR-03 Feedback Given and Feedback Received tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /feedback given/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('tab', { name: /feedback received/i }).first()).toBeVisible();
    await page.getByRole('tab', { name: /feedback received/i }).first().click();
    await page.getByRole('tab', { name: /feedback given/i }).first().click();
    await assertNoVisibleAppError(page);
  });

  test('REG-PR-04 Filter controls visible', async ({ page }) => {
    await expect(page.getByText(/all cycles|cycle/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/all employees|employee/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-PR-05 Submitted reviews table with View actions', async ({ page }) => {
    await expect(page.getByText(/^Employee$/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Status$/i).first()).toBeVisible();
    await expect(page.getByText(/submitted/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /view/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-PR-06 Add Review button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add review/i }).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });
});

test.describe('Project Risk Summary Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Project Risk Summary');
  });

  test('REG-RSK-02 Page title and table headers', async ({ page }) => {
    await expect(page.getByText(/project risk summary/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Project$/i).first()).toBeVisible();
    await expect(page.getByText(/project manager|overall risk|status/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-RSK-03 Project rows with risk levels', async ({ page }) => {
    await expect(page.getByText(/high|low|n\/a/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/enabled/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-RSK-04 View Summary buttons visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /view summary/i }).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('REG-RSK-05 Open project risk detail via View Summary', async ({ page }) => {
    await page.getByRole('button', { name: /view summary/i }).first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(/risk|project|summary|total risks|exposure/i).first()).toBeVisible({
      timeout: 20_000,
    });
    await assertNoVisibleAppError(page);
  });
});
