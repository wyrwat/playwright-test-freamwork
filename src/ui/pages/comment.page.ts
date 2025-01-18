import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { BasePage } from '@_src/ui/pages/base.page';
import { EditCommentView } from '@_src/ui/views/editComment.view';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu: MainMenuComponent;
  commentBody: Locator;
  editButton: Locator;
  alerPopup: Locator;
  returnToArticleLink: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.commentBody = this.page.getByTestId('comment-body');
    this.editButton = this.page.getByTestId('edit');
    this.alerPopup = this.page.getByTestId('alert-popup');
    this.returnToArticleLink = this.page.getByTestId('return');
  }

  async clickEditButton(): Promise<EditCommentView> {
    await this.editButton.click();
    return new EditCommentView(this.page);
  }

  async clickReturnToArticleLink(): Promise<ArticlePage> {
    await this.returnToArticleLink.click();
    return new ArticlePage(this.page);
  }
}
