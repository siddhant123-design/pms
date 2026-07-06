import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

const UTILIZATION_CHARTS = [
  'Utilization Chart',
  'Bugs Assignee Chart',
  'Bugs Reporter Chart',
  'Breached Due Dates Chart',
  'Non-Compliance Chart',
  'Velocity Chart',
];

test.describe('Jira Utilization Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Jira Utilization');
  });

  test('REG-UTIL-02 All six chart sections visible', async ({ page }) => {
    for (const chart of UTILIZATION_CHARTS) {
      await expect(page.getByRole('heading', { name: chart, exact: true }).first()).toBeVisible();
    }
    await assertNoVisibleAppError(page);
  });

  test('REG-UTIL-03 Time range filters on utilization chart', async ({ page }) => {
    await expect(page.getByRole('button', { name: '1M' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '3M' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '6M' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '1Y' }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-UTIL-04 Switch chart time range to 3M', async ({ page }) => {
    await page.getByRole('button', { name: '3M' }).first().click();
    await expect(page.getByRole('button', { name: '3M' }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-UTIL-05 Export format and export button visible', async ({ page }) => {
    await expect(page.getByRole('combobox').first()).toBeVisible();
    await expect(page.getByText(/export/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});

test.describe('Attendance Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Attendance');
  });

  test('REG-ATT-02 Date filter textboxes', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /from date/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('textbox', { name: /to date/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-ATT-03 Page title and attendance section', async ({ page }) => {
    await expect(page.getByText(/employee attendance/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/view attendance records/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-ATT-04 Summary metric cards visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /total working hours/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /work from home days/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /total leaves/i }).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-ATT-05 Clear filter button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /clear/i }).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('REG-ATT-06 Employee view or no-data state', async ({ page }) => {
    await expect(
      page.getByText(/employee view|showing your records|showing attendance|no data/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });
});

test.describe('My Compliance Regression @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'My Compliance');
  });

  test('REG-CMP-02 All status summary cards visible', async ({ page }) => {
    await expect(page.getByText(/^Pending$/i).first()).toBeVisible();
    await expect(page.getByText(/^In Progress$/i).first()).toBeVisible();
    await expect(page.getByText(/^Completed$/i).first()).toBeVisible();
    await expect(page.getByText(/^Overdue$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-CMP-03 Filter controls visible', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: /filter by status/i }).first()).toBeVisible();
    await expect(page.getByText(/filter by period/i).first()).toBeVisible();
    await expect(page.getByText(/filter by access type/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-CMP-04 Assignments table column headers', async ({ page }) => {
    await expect(page.getByText(/^Project$/i).first()).toBeVisible();
    await expect(page.getByText(/^Template$/i).first()).toBeVisible();
    await expect(page.getByText(/^Status$/i).first()).toBeVisible();
    await expect(page.getByText(/^Due Date$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-CMP-05 Table contains assignment rows', async ({ page }) => {
    await expect(page.getByText(/completed|pending|in progress/i).first()).toBeVisible();
    await expect(page.getByText(/view only|pco role required/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });
});
