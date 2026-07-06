import { test } from '@playwright/test';
import { login } from './helpers/pms';

test('seed', async ({ page }) => {
  await login(page);
});
