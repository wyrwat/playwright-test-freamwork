import createRandomUserData from '@_src/ui/factories/user.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { RegisterUserModel } from '@_src/ui/models/user.model';

test.describe('Verify register', () => {
  let registerUserData: RegisterUserModel;

  test.beforeEach(async ({}) => {
    registerUserData = createRandomUserData();
  });

  test(
    'Register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ registerPage }) => {
      //Arrange
      const popUpText = 'User created';
      const expectedLoginTitle = 'Login';
      const expectedWelcomeTitle = 'Welcome';

      //Act
      const loginPage = await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.registerPopUp).toHaveText(popUpText);

      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.getTitle();
      expect(titleLogin).toContain(expectedLoginTitle);

      //Assert test login
      const welcomePage = await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const titleWelcome = await welcomePage.getTitle();
      expect(titleWelcome).toContain(expectedWelcomeTitle);
      await expect(welcomePage.welcome).toContainText(
        `Hi ${registerUserData.userEmail}!`,
      );
    },
  );

  test(
    'Not register with incorrect data - invalid email',
    { tag: ['@GAD-R03-04'] },
    async ({ registerPage }) => {
      //Arrange
      const errorMessage = 'Please provide a valid email address';

      registerUserData.userEmail = '@#$';

      //Act
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.alertPopUp).toHaveText(errorMessage);
    },
  );

  test(
    'Not register with incorrect data - email not provided',
    { tag: ['@GAD-R03-04'] },
    async ({ registerPage }) => {
      //Arrange
      const errorMessage = 'This field is required';

      //Act
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
