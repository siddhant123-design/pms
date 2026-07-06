import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('PMS Dashboard Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'PMS Dashboard');
  });

  test('REG-PDM-02 Display review stat cards', async ({ page }) => {
    await expect(page.getByText(/total reviews/i).first()).toBeVisible();
    await expect(page.getByText(/pending/i).first()).toBeVisible();
    await expect(page.getByText(/completed reviews/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-PDM-03 Display active review cycle card', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByText(/review period|assigned date|self-rating/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /view detailed review/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-PDM-04 Review status indicator visible', async ({ page }) => {
    await expect(page.getByText(/awaiting|pending|completed|review/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});

test.describe('360 Feedback Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, '360 Feedback');
  });

  test('REG-FB-02 Display page purpose text', async ({ page }) => {
    await expect(page.getByText(/anonymous feedback|manager grow|360/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-FB-03 Show empty state or feedback assignment', async ({ page }) => {
    const emptyState = page.getByText(/no feedback opportunities available/i).first();
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    if (hasEmpty) {
      await expect(emptyState).toBeVisible();
      await expect(page.getByText(/contact hr|kra assignments|360.*feedback enabled/i).first()).toBeVisible();
    } else {
      await expect(page.getByText(/feedback|assignment|reviewer|submit/i).first()).toBeVisible();
    }

    await assertNoVisibleAppError(page);
  });
});
