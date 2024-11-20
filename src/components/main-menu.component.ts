import { CommentPage } from '@_src/pages/comment.page';
import { Locator, Page } from '@playwright/test';

export class MainMenuComponent {
  articlesButton: Locator;
  commentsButton: Locator;
  homePage: Locator;

  constructor(private page: Page) {
    this.articlesButton = this.page.getByTestId('open-articles');
    this.commentsButton = this.page.getByTestId('open-comments');
    this.homePage = this.page.getByRole('link', { name: '🦎 GAD' });
  }

  async clickCommentButton(): Promise<CommentPage> {
    await this.commentsButton.click();
    return new CommentPage(this.page);
  }
}
