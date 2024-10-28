import { MainMenuComponent } from '../components/main-manu.component';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu: MainMenuComponent;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
  }
}
