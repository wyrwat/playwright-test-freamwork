import { BasePage } from '@_src/pages/base.page';
import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { Page } from '@playwright/test';

export class CommentsPage extends BasePage {
  url = '/comments.html';
  mainMenu = new MainMenuComponent(this.page);
  constructor(page: Page) {
    super(page);
  }
}
