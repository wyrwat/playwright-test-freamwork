import { RegisterUser } from '../../src/models/user.models';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/pl';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'Register with correct data and login',
    { tag: ['@smoke', '@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ page }) => {
      //Arrange
      const registerUserData: RegisterUser = {
        userFirtsName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        userEmail: '',
        userPassword: faker.internet.password({ length: 8 }),
      };

      registerUserData.userEmail = faker.internet.email({
        firstName: registerUserData.userFirtsName,
        lastName: registerUserData.userLastName,
      });

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
    { tag: ['@smoke', '@GAD-R03-04'] },
    async ({ page }) => {
      //Arrange
      const registerUserData: RegisterUser = {
        userFirtsName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        userEmail: '@#$',
        userPassword: faker.internet.password({ length: 8 }),
      };

      const registerPage = new RegisterPage(page);
      const errorMessage = 'Please provide a valid email address';

      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.invalidEmailError).toHaveText(errorMessage);
    },
  );

  test(
    'Not register with incorrect data - email not provided',
    { tag: ['@smoke', '@GAD-R03-04'] },
    async ({ page }) => {
      //Arrange
      const errorMessage = 'This field is required';
      const registerPage = new RegisterPage(page);

      //Act
      await registerPage.goto();
      registerPage.userFirstNameInput.fill(
        faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      );
      registerPage.userLastNameInput.fill(
        faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      );
      registerPage.userPasswordInput.fill(
        faker.internet.password({ length: 8 }),
      );
      await registerPage.registerButton.click();

      //Assert
      await expect(registerPage.invalidEmailError).toHaveText(errorMessage);
    },
  );
});
