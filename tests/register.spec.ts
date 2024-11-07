import randomUserData from '../src/factories/user.factory';
import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUser;
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = randomUserData();
  });
  test(
    'Register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ page }) => {
      //Arrange
      const popUpText = 'User created';
      const loginPage = new LoginPage(page);
      const welcomePage = new WelcomePage(page);

      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.registerPopUp).toHaveText(popUpText);

      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      //Assert test login
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

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
    async () => {
      //Arrange
      const errorMessage = 'Please provide a valid email address';

      registerUserData.userEmail = '@#$';

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
    async () => {
      //Arrange
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
