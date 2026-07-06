import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFile = path.resolve(__dirname, '..', '.env');
for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  if (process.env[key] === undefined) process.env[key] = val;
}

const BASE = process.env.PMS_BASE_URL ?? 'http://pms.yodaplus.net';

async function login(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  if (page.url().includes('/landing')) return;
  for (const sel of ['input[type="email"]', 'input[type="text"]']) {
    const loc = page.locator(sel).first();
    if (await loc.isVisible().catch(() => false)) {
      await loc.fill(process.env.PMS_USERNAME);
      break;
    }
  }
  const pw = page.locator('input[type="password"]').first();
  await pw.fill(process.env.PMS_PASSWORD);
  const btn = page.getByRole('button', { name: /log ?in|sign ?in|submit/i }).first();
  if (await btn.isVisible().catch(() => false)) await btn.click();
  else await pw.press('Enter');
  await page.waitForURL(/landing|kra|pms/, { timeout: 20000 }).catch(() => {});
}

async function openSidebarItem(page, item) {
  const toggle = page.getByRole('button', { name: /toggle sidebar/i }).first();
  if (!(await page.getByRole('button', { name: /dashboard/i }).first().isVisible().catch(() => false))) {
    if (await toggle.isVisible().catch(() => false)) await toggle.click();
  }
  const pms = page.getByRole('button', { name: /^PMS/i }).first();
  if (await pms.isVisible().catch(() => false)) {
    const label = await pms.innerText();
    if (label.includes('+')) await pms.click();
  }
  const name = item === '360 Feedback' ? '360° Feedback' : item;
  await page.getByRole('button', { name, exact: true }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

async function collect(page) {
  return {
    url: page.url(),
    title: await page.title(),
    headings: (await page.getByRole('heading').allTextContents()).filter(Boolean).slice(0, 25),
    buttons: (await page.getByRole('button').allTextContents()).filter(Boolean).slice(0, 35),
    links: (await page.getByRole('link').allTextContents()).filter(Boolean).slice(0, 20),
    body: (await page.locator('body').innerText()).slice(0, 2000),
  };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await login(page);

  const sidebarButtons = (await page.getByRole('button').allTextContents()).filter(Boolean);

  // Try direct routes if sidebar item missing
  await page.goto(`${BASE}/pms/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const pmsDashboardDirect = await collect(page);

  await openSidebarItem(page, '360 Feedback');
  const feedback360 = await collect(page);

  console.log(JSON.stringify({ sidebarButtons, pmsDashboardDirect, feedback360 }, null, 2));
  await browser.close();
})();
