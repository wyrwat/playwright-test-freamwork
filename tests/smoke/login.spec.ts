import { LoginUserModel } from '@_src/models/user.model';
import { LoginPage } from '@_src/pages/login.page';
import { WelcomePage } from '@_src/pages/welcome.page';
import { testUser1 } from '@_src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Succesfull login using login page',
    { tag: ['@smoke', '@GAD-R02-02'] },
    async ({ page }) => {
      //Arrange
      const loginPage = new LoginPage(page);
      const welcomePage = new WelcomePage(page);
      const userLoginData: LoginUserModel = {
        userEmail: testUser1.userEmail,
        userPassword: testUser1.userPassword,
      };

      const expectedWelcomeTitle = 'Welcome';

      //Act
      await loginPage.goto();
      await loginPage.login(userLoginData);

      //Assert

      const title = await welcomePage.getTitle();
      expect(title).toContain(expectedWelcomeTitle);
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
      const expectedLoginTitle = 'Login';
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
      const title = await loginPage.getTitle();
      expect.soft(title).toContain(expectedLoginTitle);
    },
  );
});
