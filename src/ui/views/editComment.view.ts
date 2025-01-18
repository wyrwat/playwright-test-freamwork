import { CommentPage } from '@_src/pages/comment.page';
import { AddCommentModel } from '@_src/ui/models/comment.model';
import { Locator, Page } from '@playwright/test';

export class EditCommentView {
  bodyInput: Locator;
  updateButton: Locator;

  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body');
    this.updateButton = this.page.getByTestId('update-button');
  }
  async updatedComment(commentData: AddCommentModel): Promise<CommentPage> {
    await this.bodyInput.fill(commentData.body);
    await this.updateButton.click();
    return new CommentPage(this.page);
  }
}
