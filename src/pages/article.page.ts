import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/articles.html';
  articleTitle: Locator;
  articleBody: Locator;
  alertPopup: Locator;
  deleteIcon: Locator;
  mainMenu: MainMenuComponent;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.articleTitle = this.page.getByTestId('article-title');
    this.articleBody = this.page.getByTestId('article-body');
    this.alertPopup = this.page.getByTestId('alert-popup');
    this.deleteIcon = this.page.getByTestId('delete');
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.deleteIcon.click();
  }
}
