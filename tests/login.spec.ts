import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test('Succesfull login using login page', async ({ page }) => {
    //Arrange
    const userEmail = 'Moses.Armstrong@Feest.ca';
    const userPassword = 'test1';
    const loginPage = new LoginPage(page);

    //Act
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);

    //Assert
    const welcomePage = new WelcomePage(page);
    const title = await welcomePage.title();
    expect(title).toContain('Welcome');
    await expect(welcomePage.welcome).toContainText(
      'Hi Moses.Armstrong@Feest.ca!sdasdasd',
    );
  });
});
