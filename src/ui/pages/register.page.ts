import { RegisterUserModel } from '@_src/ui/models/user.model';
import { BasePage } from '@_src/ui/pages/base.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { Locator, Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  url = '/register.html';
  userFirstNameInput: Locator;
  userLastNameInput: Locator;
  userEmailInput: Locator;
  userPasswordInput: Locator;
  registerButton: Locator;
  registerPopUp: Locator;
  alertPopUp: Locator;

  constructor(page: Page) {
    super(page);
    this.userFirstNameInput = this.page.getByTestId('firstname-input');
    this.userLastNameInput = this.page.getByTestId('lastname-input');
    this.userEmailInput = this.page.getByTestId('email-input');
    this.userPasswordInput = this.page.getByTestId('password-input');
    this.registerButton = page.getByTestId('register-button');
    this.registerPopUp = page.getByTestId('alert-popup');
    this.alertPopUp = page.locator('#octavalidate_email');
  }

  async register(registerUserData: RegisterUserModel): Promise<LoginPage> {
    await this.userFirstNameInput.fill(registerUserData.userFirtsName);
    await this.userLastNameInput.fill(registerUserData.userLastName);
    await this.userEmailInput.fill(registerUserData.userEmail);
    await this.userPasswordInput.fill(registerUserData.userPassword);
    await this.registerButton.click();
    return new LoginPage(this.page);
  }
}
