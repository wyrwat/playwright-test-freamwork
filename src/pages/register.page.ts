import { BasePage } from './base.page';
import { RegisterUserModel } from '@_src/models/user.model';
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

  async register(registerUserData: RegisterUserModel): Promise<void> {
    await this.userFirstNameInput.fill(registerUserData.userFirtsName);
    await this.userLastNameInput.fill(registerUserData.userLastName);
    await this.userEmailInput.fill(registerUserData.userEmail);
    this.userPasswordInput.fill(registerUserData.userPassword);
    await this.registerButton.click();
  }
}
