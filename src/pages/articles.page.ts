import { MainMenuComponent } from '../components/main-manu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu: MainMenuComponent;
  addArticleButtonLogged: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.addArticleButtonLogged = this.page.locator('#add-new');
  }
}
