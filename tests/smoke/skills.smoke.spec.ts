import { expect, test } from '@playwright/test';
import {
  assertNoVisibleAppError,
  ensureSidebarOpen,
  login,
  openSidebarItem,
  openSidebarSection,
} from '../helpers/pms';

test.describe('Smoke — Skills @smoke', () => {
  test('SMK-SKM-01 Expand Skills submenu', async ({ page }) => {
    await login(page);
    await ensureSidebarOpen(page);
    await openSidebarSection(page, 'Skills');
    await expect(page.getByRole('button', { name: 'Your Skills', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skill Document', exact: true }).first()).toBeVisible();
  });

  test('SMK-SKL-01 Navigate to Your Skills', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Your Skills');
    await expect(page).toHaveURL(/skill/);
    await expect(page.getByText(/your overall score|manager score/i).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });

  test('SMK-DOC-01 Navigate to Skill Document', async ({ page }) => {
    await login(page);
    await openSidebarItem(page, 'Skill Document');
    await expect(page).toHaveURL(/skills-document|emp-skills-document/);
    await expect(page.getByText(/employee skills documents/i).first()).toBeVisible({ timeout: 20_000 });
    await assertNoVisibleAppError(page);
  });
});
