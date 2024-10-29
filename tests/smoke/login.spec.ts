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
      const userEmail = testUser1.userEmail;
      const userPassword = testUser1.userPassword;
      const loginPage = new LoginPage(page);

      //Act
      await loginPage.goto();
      await loginPage.login(userEmail, userPassword);

      //Assert
      const welcomePage = new WelcomePage(page);
      const title = await welcomePage.title();
      expect(title).toContain('Welcome');
      await expect(welcomePage.welcome).toContainText(
        'Hi Moses.Armstrong@Feest.ca!',
      );
    },
  );
});
