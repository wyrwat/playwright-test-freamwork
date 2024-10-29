import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class WelcomePage extends BasePage {
  welcome: Locator;
  url = '/welcome';
  constructor(page: Page) {
    super(page);
    this.welcome = this.page.getByTestId('hello');
  }
}
