import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentPage } from '@_src/ui/pages/comment.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { Locator, Page } from '@playwright/test';

export class MainMenuComponent {
  articlesButton: Locator;
  commentsButton: Locator;
  homePageLink: Locator;

  constructor(private page: Page) {
    this.articlesButton = this.page.getByTestId('open-articles');
    this.commentsButton = this.page.getByTestId('open-comments');
    this.homePageLink = this.page.getByRole('link', { name: '🦎 GAD' });
  }

  async clickCommentButton(): Promise<CommentPage> {
    await this.commentsButton.click();
    return new CommentPage(this.page);
  }

  async clickArticlesButton(): Promise<ArticlesPage> {
    await this.articlesButton.click();
    return new ArticlesPage(this.page);
  }

  async clickHomeButton(): Promise<HomePage> {
    await this.homePageLink.click();
    return new HomePage(this.page);
  }
}
