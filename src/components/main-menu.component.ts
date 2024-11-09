import { Locator, Page } from '@playwright/test';

export class MainMenuComponent {
  articlesButton: Locator;
  commentsButton: Locator;
  homePage: Locator;

  constructor(private page: Page) {
    this.articlesButton = this.page.getByTestId('open-articles');
    this.commentsButton = this.page.getByTestId('open-comments');
    this.homePage = this.page.getByRole('link', { name: '🦎 GAD' });
  }
}
