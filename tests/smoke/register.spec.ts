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
});
