import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/register.html');
  await page.getByTestId('firstname-input').click();
  await page.getByTestId('firstname-input').fill('janina');
  await page.getByTestId('lastname-input').click();
  await page.getByTestId('lastname-input').fill('nowaddd');
  await page.getByTestId('email-input').click();
  await page.getByTestId('email-input').fill('testybezsciemy@bez.test');
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('test12345');
  await page.getByTestId('register-button').click();
  await page.getByTestId('alert-popup').click();
});
