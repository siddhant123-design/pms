import { expect, Page, test } from '@playwright/test';

export const BASE_URL = process.env.PMS_BASE_URL ?? 'http://pms.yodaplus.net';

const DEFAULT_TIMEOUT = 15_000;

export type PmsRole =
  | 'Employee'
  | 'HR'
  | 'Admin'
  | 'Manager'
  | 'Process Compliance Manager'
  | 'Process Compliance Officer';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    test.skip(true, `Missing required environment variable: ${name}`);
    return '';
  }
  return value;
}

export function getCredentials() {
  return {
    username: requiredEnv('PMS_USERNAME'),
    password: requiredEnv('PMS_PASSWORD'),
  };
}

export async function gotoApp(page: Page, path = '') {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
}

export async function login(page: Page) {
  const { username, password } = getCredentials();

  await gotoApp(page);

  if (await isAuthenticated(page)) {
    return;
  }

  const userSelectors = [
    'input[type="email"]',
    'input[name*="email" i]',
    'input[placeholder*="email" i]',
    'input[id*="email" i]',
    'input[name*="user" i]',
    'input[id*="user" i]',
    'input[placeholder*="user" i]',
    'input[type="text"]',
  ];

  let emailField: ReturnType<Page['locator']> | null = null;
  for (const sel of userSelectors) {
    const loc = page.locator(sel).first();
    if (await loc.isVisible().catch(() => false)) {
      emailField = loc;
      break;
    }
  }

  const passwordField = page.locator('input[type="password"], input[name*="pass" i]').first();

  if (emailField) {
    await expect(emailField).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await emailField.fill(username);
  }

  if (await passwordField.isVisible().catch(() => false)) {
    await passwordField.fill(password);
  }

  const submitCandidates = [
    page.getByRole('button', { name: /log ?in|sign ?in|submit|continue|next/i }).first(),
    page.locator('button[type="submit"]').first(),
    page.locator('input[type="submit"]').first(),
  ];

  let clicked = false;
  for (const btn of submitCandidates) {
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    await passwordField.press('Enter').catch(() => {});
  }

  await expect
    .poll(async () => isAuthenticated(page), {
      timeout: DEFAULT_TIMEOUT,
      message: 'Expected user to be authenticated after login',
    })
    .toBeTruthy();
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  return (
    (await page.getByRole('button', { name: /employee|admin|manager|hr/i }).first().isVisible().catch(() => false)) ||
    page.url().includes('/landing')
  );
}

export async function openQuickLink(page: Page, name: string) {
  await page.getByRole('link', { name: new RegExp(name, 'i') }).first().click();
}

export async function ensureSidebarOpen(page: Page) {
  if (await page.getByRole('button', { name: /dashboard/i }).first().isVisible().catch(() => false)) {
    return;
  }

  const toggle = page.getByRole('button', { name: /toggle sidebar/i }).first();
  await expect(toggle).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await toggle.click();
  await expect(page.getByRole('button', { name: /dashboard/i }).first()).toBeVisible({
    timeout: DEFAULT_TIMEOUT,
  });
}

export async function openSidebarSection(page: Page, name: string) {
  await ensureSidebarOpen(page);

  const section = page
    .getByRole('button', { name: new RegExp(`^${escapeRegex(name)}`, 'i') })
    .first();
  await expect(section).toBeVisible({ timeout: DEFAULT_TIMEOUT });

  const label = await section.innerText().catch(() => '');
  if (label.includes('+')) {
    await section.click();
  }
}

export async function openSidebarItem(page: Page, name: string) {
  await ensureSidebarOpen(page);

  const parentSections: Record<string, string> = {
    'My KRA': 'PMS',
    'PMS Dashboard': 'PMS',
    '360 Feedback': 'PMS',
    'Jira Utilization': 'Operational Metrics',
    Attendance: 'Operational Metrics',
    'My Compliance': 'Operational Metrics',
    'Your Skills': 'Skills',
    'Skill Document': 'Skills',
    'Training Dashboard': 'Training',
    'My Trainings': 'Training',
  };

  const displayNames: Record<string, string> = {
    '360 Feedback': '360° Feedback',
  };

  if (parentSections[name]) {
    await openSidebarSection(page, parentSections[name]);
  }

  const itemName = displayNames[name] ?? name;
  const item = page.getByRole('button', { name: itemName, exact: true }).first();
  await expect(item).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await item.click();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function assertNoVisibleAppError(page: Page) {
  const errorSignals = [
    page.getByText(/something went wrong/i).first(),
    page.getByText(/internal server error/i).first(),
    page.getByText(/cannot read properties/i).first(),
  ];
  for (const locator of errorSignals) {
    await expect(locator).toHaveCount(0);
  }
}
