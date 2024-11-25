import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlePage } from '@_src/pages/article.page';
import { BasePage } from '@_src/pages/base.page';
import { AddArticleView } from '@_src/views/addArticle.view';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu: MainMenuComponent;
  addArticleButtonLogged: Locator;
  searchInput: Locator;
  goSearchButton: Locator;
  noResultText: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.addArticleButtonLogged = this.page.locator('#add-new');
    this.searchInput = this.page.getByTestId('search-input');
    this.goSearchButton = this.page.getByTestId('search-button');
    this.noResultText = this.page.getByTestId('no-results');
  }

  async gotoArticle(title: string): Promise<ArticlePage> {
    await this.page.getByText(title).click();
    return new ArticlePage(this.page);
  }

  async searchArticle(phrase: string): Promise<ArticlesPage> {
    await this.searchInput.fill(phrase);
    await this.goSearchButton.click();
    return this;
  }

  async clickAddArticleButton(): Promise<AddArticleView> {
    await this.addArticleButtonLogged.click();
    return new AddArticleView(this.page);
    return new AddArticleView(this.page);
  }
}
