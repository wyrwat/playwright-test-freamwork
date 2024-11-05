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
      const userfirstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
      const userlastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
      // const userEmail = `jan${new Date().getTime()}@test.te`;
      const userEmail = faker.internet.email({
        firstName: userfirstName,
        lastName: userlastName,
      });
      const userPassword = faker.internet.password({ length: 8 });

      const registerPage = new RegisterPage(page);
      const popUpText = 'User created';
      //Act
      await registerPage.goto();
      await registerPage.register(
        userfirstName,
        userlastName,
        userEmail,
        userPassword,
      );

      //Assert
      await expect(registerPage.registerPopUp).toHaveText(popUpText);

      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      //Assert
      await loginPage.login(userEmail, userPassword);

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
      await expect(welcomePage.welcome).toContainText(`Hi ${userEmail}!`);
    },
  );
});
