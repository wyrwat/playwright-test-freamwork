import { ArticlePage } from '@_src/pages/article.page';
import { AddCommentModel } from '@_src/ui/models/comment.model';
import { Locator, Page } from '@playwright/test';

export class AddCommentView {
  addCommentHeader: Locator;
  commentBodyInput: Locator;
  saveButton: Locator;

  constructor(private page: Page) {
    this.addCommentHeader = this.page.getByRole('heading', {
      name: 'Add New Comment',
    });
    this.commentBodyInput = this.page.locator('#body');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
  }

  async createComment(commentData: AddCommentModel): Promise<ArticlePage> {
    await this.commentBodyInput.fill(commentData.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
