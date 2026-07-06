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

async function openYourSkills(page) {
  const toggle = page.getByRole('button', { name: /toggle sidebar/i }).first();
  if (!(await page.getByRole('button', { name: /dashboard/i }).first().isVisible().catch(() => false))) {
    if (await toggle.isVisible().catch(() => false)) await toggle.click();
  }
  const skills = page.getByRole('button', { name: /^Skills/i }).first();
  if (await skills.isVisible().catch(() => false)) {
    const label = await skills.innerText();
    if (label.includes('+')) await skills.click();
  }
  await page.getByRole('button', { name: 'Your Skills', exact: true }).first().click();
  await page.waitForTimeout(2500);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await login(page);
  await openYourSkills(page);

  const beforeExpand = (await page.locator('body').innerText()).slice(0, 2000);

  // Expand skill category
  const skillCat = page.getByRole('heading', { name: /playwright|weightage/i }).first();
  await skillCat.click();
  await page.waitForTimeout(2000);
  const afterExpand = (await page.locator('body').innerText()).slice(0, 3000);

  // Check for question rows, radio buttons, ratings
  const radios = await page.getByRole('radio').count();
  const checkboxes = await page.getByRole('checkbox').count();
  const sliders = await page.locator('input[type="range"]').count();

  // Skill document - date fields on row with dates
  await page.getByRole('button', { name: 'Skill Document', exact: true }).first().click();
  await page.waitForTimeout(2500);

  const dateFields = await page.getByRole('textbox').count();
  const rowWithDates = await page.getByRole('row').filter({ hasText: /13\/03\/2026/ }).first().innerText().catch(() => '');

  console.log(JSON.stringify({ beforeExpand, afterExpand, radios, checkboxes, sliders, dateFields, rowWithDates }, null, 2));
  await browser.close();
})();
