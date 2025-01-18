import { STORAGE_STATE } from '@_pw-config';
import { LoginUserModel } from '@_src/ui/models/user.model';
import { LoginPage } from '@_src/ui/pages/login.page';
import { testUser1 } from '@_src/ui/test-data/user.data';
import { expect, test as setup } from '@playwright/test';

setup('Login and save session', async ({ page }) => {
  //Arrange
  const loginPage = new LoginPage(page);

  const userLoginData: LoginUserModel = {
    userEmail: testUser1.userEmail,
    userPassword: testUser1.userPassword,
  };

  const expectedWelcomeTitle = 'Welcome';

  //Act
  await loginPage.goto();
  const welcomePage = await loginPage.login(userLoginData);

  //Assert
  const title = await welcomePage.getTitle();
  expect(title).toContain(expectedWelcomeTitle);
  await expect(welcomePage.welcome).toContainText(
    'Hi Moses.Armstrong@Feest.ca!',
  );

  await page.context().storageState({ path: STORAGE_STATE });
});
