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
  await page.waitForTimeout(5000);
}

async function openSidebarItem(page, item) {
  const toggle = page.getByRole('button', { name: /toggle sidebar/i }).first();
  if (!(await page.getByRole('button', { name: /dashboard/i }).first().isVisible().catch(() => false))) {
    if (await toggle.isVisible().catch(() => false)) await toggle.click();
  }
  const skills = page.getByRole('button', { name: /^Skills/i }).first();
  if (await skills.isVisible().catch(() => false)) {
    const label = await skills.innerText();
    if (label.includes('+')) await skills.click();
  }
  await page.getByRole('button', { name: item, exact: true }).first().click();
  await page.waitForLoadState('domcontentloaded');
}

const collect = async (page) => ({
  url: page.url(),
  headings: (await page.getByRole('heading').allTextContents()).filter(Boolean),
  buttons: (await page.getByRole('button').allTextContents()).filter(Boolean),
  rows: await page.getByRole('row').count(),
  text: (await page.locator('body').innerText()).slice(0, 3500),
});

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await login(page);

  await openSidebarItem(page, 'Your Skills');
  await page.waitForTimeout(2500);
  const yourSkills = await collect(page);

  const editBtn = page.getByRole('button', { name: /^edit$/i }).first();
  let editOpen = null;
  if (await editBtn.isVisible().catch(() => false)) {
    await editBtn.click();
    await page.waitForTimeout(1500);
    editOpen = {
      textareas: await page.locator('textarea').count(),
      saveVisible: await page.getByRole('button', { name: /save|update|submit/i }).first().isVisible().catch(() => false),
      cancelVisible: await page.getByRole('button', { name: /cancel|close/i }).first().isVisible().catch(() => false),
      snippet: (await page.locator('body').innerText()).slice(0, 800),
    };
    await page.keyboard.press('Escape');
  }

  await openSidebarItem(page, 'Skill Document');
  await page.waitForTimeout(2500);
  const skillDoc = await collect(page);

  const row1 = await page.getByRole('row').nth(1).innerText().catch(() => '');
  const removedHr = await page.getByText(/removed by hr/i).count();
  const pagination = await page.getByText(/\d+–\d+ of \d+/i).first().innerText().catch(() => '');

  console.log(JSON.stringify({ yourSkills, editOpen, skillDoc, row1, removedHr, pagination }, null, 2));
  await browser.close();
})();
