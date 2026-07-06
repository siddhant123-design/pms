import { expect, test } from '@playwright/test';
import { assertNoVisibleAppError, login, openSidebarItem } from '../helpers/pms';

test.describe('Your Skills — In Depth @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Your Skills');
  });

  test('REG-SKL-02 Overall and manager scores visible', async ({ page }) => {
    await expect(page.getByText(/your overall score/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/manager score/i).first()).toBeVisible();
    await expect(page.getByText(/\d+(\.\d+)?%/).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-03 Full proficiency scale visible', async ({ page }) => {
    for (const level of ['Awareness', 'Novice', 'Competent', 'Professional', 'Expert']) {
      await expect(page.getByText(level, { exact: true }).first()).toBeVisible({ timeout: 20_000 });
    }
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-04 Avg score and Questions section', async ({ page }) => {
    await expect(page.getByText(/avg score/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Questions$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-05 Skill category with weightage and score breakdown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /weightage/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/your score.*contribution/i).first()).toBeVisible();
    await expect(page.getByText(/manager.*\d/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-06 Expand skill category shows sub-questions', async ({ page }) => {
    await page.getByRole('heading', { name: /weightage/i }).first().click();
    await expect(page.getByText(/testing|automation testing|codegen|solidity/i).first()).toBeVisible({
      timeout: 20_000,
    });
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-07 Sub-question shows employee and manager ratings', async ({ page }) => {
    await page.getByRole('heading', { name: /weightage/i }).first().click();
    await expect(page.getByText(/employee/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/manager/i).first()).toBeVisible();
    await expect(page.getByText(/\d+(\.\d+)?\/5/).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-08 Sub-question shows answered count', async ({ page }) => {
    await page.getByRole('heading', { name: /weightage/i }).first().click();
    await expect(page.getByText(/\d+\/\d+/).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-09 Additional remarks section with helper text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /additional skills|remarks/i }).first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/mention any skills you have/i).first()).toBeVisible();
    await expect(page.getByText(/saved/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-SKL-10 Edit remarks opens Cancel and Save Remarks', async ({ page }) => {
    await page.getByRole('button', { name: /^edit$/i }).first().click();
    await expect(page.getByRole('button', { name: /cancel/i }).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: /save remarks/i }).first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await assertNoVisibleAppError(page);
  });
});

test.describe('Skill Document — In Depth @regression', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Skill Document');
  });

  test('REG-DOC-02 Page title and all table headers', async ({ page }) => {
    await expect(page.getByText(/employee skills documents/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/^Sr\.? No/i).first()).toBeVisible();
    await expect(page.getByText(/^Document Name$/i).first()).toBeVisible();
    await expect(page.getByText(/^Download$/i).first()).toBeVisible();
    await expect(page.getByText(/^Comment$/i).first()).toBeVisible();
    await expect(page.getByText(/HR Completion Date/i).first()).toBeVisible();
    await expect(page.getByText(/^Start Date$/i).first()).toBeVisible();
    await expect(page.getByText(/^Completion Date$/i).first()).toBeVisible();
    await expect(page.getByText(/^Submit$/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-03 Document rows with multiple file types', async ({ page }) => {
    await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/\.png/i).first()).toBeVisible();
    await expect(page.getByText(/\.xlsx|\.pdf|\.doc|\.csv/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-04 Submit button on each document row', async ({ page }) => {
    const submitButtons = page.getByRole('button', { name: /^submit$/i });
    await expect(submitButtons.first()).toBeVisible({ timeout: 20_000 });
    expect(await submitButtons.count()).toBeGreaterThan(5);
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-05 Pagination shows document count', async ({ page }) => {
    await expect(page.getByText(/\d+–\d+ of \d+/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/rows per page/i).first()).toBeVisible();
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-06 Row with populated start and completion dates', async ({ page }) => {
    await expect(page.getByText(/\d{2}\/\d{2}\/\d{4}/).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-07 Removed by HR row state', async ({ page }) => {
    await expect(page.getByText(/removed by hr/i).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-08 Comment and date textboxes on rows', async ({ page }) => {
    const textboxes = page.getByRole('textbox');
    await expect(textboxes.first()).toBeVisible({ timeout: 20_000 });
    expect(await textboxes.count()).toBeGreaterThan(10);
    await assertNoVisibleAppError(page);
  });

  test('REG-DOC-09 Document grid has multiple rows', async ({ page }) => {
    await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 20_000 });
    const submitButtons = page.getByRole('button', { name: /^submit$/i });
    expect(await submitButtons.count()).toBeGreaterThan(10);
    await assertNoVisibleAppError(page);
  });
});
