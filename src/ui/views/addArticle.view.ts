import { ArticlePage } from '@_src/pages/article.page';
import { AddArticleModel } from '@_src/ui/models/article.model';
import { Locator, Page } from '@playwright/test';

export class AddArticleView {
  addNewHeader: Locator;
  titleInput: Locator;
  bodyInput: Locator;
  saveButton: Locator;
  alertPopup: Locator;

  constructor(private page: Page) {
    this.addNewHeader = this.page.getByRole('heading', {
      name: 'Add New Entry',
    });
    this.titleInput = this.page.getByTestId('title-input');
    this.bodyInput = this.page.getByTestId('body-text');
    this.saveButton = this.page.getByTestId('save');
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async createNewArticle(addArticle: AddArticleModel): Promise<ArticlePage> {
    await this.titleInput.fill(addArticle.title);
    await this.bodyInput.fill(addArticle.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
