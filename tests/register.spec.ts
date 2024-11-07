import randomUserData from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'Register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ page }) => {
      //Arrange
      const registerUserData = randomUserData();
      const registerPage = new RegisterPage(page);

      const popUpText = 'User created';

      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.registerPopUp).toHaveText(popUpText);

      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      //Assert
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
      await expect(welcomePage.welcome).toContainText(
        `Hi ${registerUserData.userEmail}!`,
      );
    },
  );

  test(
    'Not register with incorrect data - invalid email',
    { tag: ['@GAD-R03-04'] },
    async ({ page }) => {
      //Arrange
      const registerUserData = randomUserData();
      registerUserData.userEmail = '@#$';

      const registerPage = new RegisterPage(page);
      const errorMessage = 'Please provide a valid email address';

      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.alertPopUp).toHaveText(errorMessage);
    },
  );

  test(
    'Not register with incorrect data - email not provided',
    { tag: ['@GAD-R03-04'] },
    async ({ page }) => {
      //Arrange
      const registerUserData = randomUserData();
      const registerPage = new RegisterPage(page);
      const errorMessage = 'This field is required';
      //Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirtsName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.userPassword);
      await registerPage.registerButton.click();

      //Assert
      await expect(registerPage.alertPopUp).toHaveText(errorMessage);
    },
  );
});
