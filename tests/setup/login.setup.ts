import { STORAGE_STATE } from '../../playwright.config';
import { LoginUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test as setup } from '@playwright/test';

setup('Succesfull login using login page', async ({ page }) => {
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

  await page.context().storageState({ path: STORAGE_STATE });
});
