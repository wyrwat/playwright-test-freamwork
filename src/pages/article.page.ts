import { MainMenuComponent } from '../components/main-manu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/articles.html';
  articleTitle: Locator;
  articleBody: Locator;
  alertPopup: Locator;
  mainMenu: MainMenuComponent;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.articleTitle = this.page.getByTestId('article-title');
    this.articleBody = this.page.getByTestId('article-body');
    this.alertPopup = this.page.getByTestId('alert-popup');
  }
}
