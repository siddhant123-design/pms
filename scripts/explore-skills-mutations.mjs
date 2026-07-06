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
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await login(page);
  await openYourSkills(page);

  const allButtons = (await page.getByRole('button').allTextContents()).filter(Boolean);
  const allLinks = (await page.getByRole('link').allTextContents()).filter(Boolean);

  // Remarks flow
  await page.getByRole('button', { name: /^edit$/i }).first().click();
  await page.waitForTimeout(1000);
  const textareas = page.locator('textarea');
  const taCount = await textareas.count();
  let currentRemark = '';
  if (taCount > 0) currentRemark = await textareas.first().inputValue().catch(() => '');

  const remarkButtons = (await page.getByRole('button').allTextContents()).filter(Boolean);

  // Skill document submit flow - check for delete
  await page.keyboard.press('Escape');
  await openYourSkills(page);

  // Expand category and look for add/delete on questions
  await page.getByRole('heading', { name: /weightage/i }).first().click();
  await page.waitForTimeout(1500);

  const afterExpandButtons = (await page.getByRole('button').allTextContents()).filter(Boolean);
  const bodySnippet = (await page.locator('body').innerText()).slice(0, 4000);

  // Skill document
  await page.getByRole('button', { name: 'Skill Document', exact: true }).first().click();
  await page.waitForTimeout(2500);
  const docButtons = (await page.getByRole('button').allTextContents()).filter(Boolean).slice(0, 40);
  const docBody = (await page.locator('body').innerText()).slice(0, 2000);

  console.log(JSON.stringify({ allButtons, allLinks, taCount, currentRemark, remarkButtons, afterExpandButtons, bodySnippet, docButtons, docBody }, null, 2));
  await browser.close();
})();
