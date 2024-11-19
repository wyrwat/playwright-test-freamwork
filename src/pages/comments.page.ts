import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { MainMenuComponent } from '@src/components/main-menu.component';

export class CommentsPage extends BasePage {
  url = '/comments.html';
  mainMenu = new MainMenuComponent(this.page);
  constructor(page: Page) {
    super(page);
  }
}
