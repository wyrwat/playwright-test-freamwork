import { LoginUser } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Succesfull login using login page',
    { tag: ['@smoke', '@GAD-R02-02'] },
    async ({ page }) => {
      //Arrange
      const userLoginData: LoginUser = {
        userEmail: testUser1.userEmail,
        userPassword: testUser1.userPassword,
      };

      const loginPage = new LoginPage(page);

      //Act
      await loginPage.goto();
      await loginPage.login(userLoginData);

      //Assert
      const welcomePage = new WelcomePage(page);
      const title = await welcomePage.title();
      expect(title).toContain('Welcome');
      await expect(welcomePage.welcome).toContainText(
        'Hi Moses.Armstrong@Feest.ca!',
      );
    },
  );

  test(
    'Reject login with incorrect password',
    { tag: ['@smoke', '@GAD-R02-02'] },
    async ({ page }) => {
      //Arrange
      const loginPage = new LoginPage(page);

      //Act
      await loginPage.goto();
      await loginPage.login({
        userEmail: testUser1.userEmail,
        userPassword: 'incorrectPassword',
      });

      //Assert
      await expect
        .soft(loginPage.loginError)
        .toHaveText('Invalid username or password');
      const title = await loginPage.title();
      expect.soft(title).toContain('Login');
    },
  );
});
