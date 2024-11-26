import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlesPage } from '@_src/pages/articles.page';
import { BasePage } from '@_src/pages/base.page';
import { CommentPage } from '@_src/pages/comment.page';
import { AddCommentView } from '@_src/views/addComment.view';
import { Locator, Page } from '@playwright/test';

interface ArticleComment {
  body: Locator;
  link: Locator;
}
export class ArticlePage extends BasePage {
  url = '/article.html';
  articleTitle: Locator;
  articleBody: Locator;
  alertPopup: Locator;
  deleteIcon: Locator;
  mainMenu: MainMenuComponent;
  addNewCommentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(page);
    this.articleTitle = this.page.getByTestId('article-title');
    this.articleBody = this.page.getByTestId('article-body');
    this.alertPopup = this.page.getByTestId('alert-popup');
    this.deleteIcon = this.page.getByTestId('delete');
    this.addNewCommentButton = this.page.locator('#add-new');
  }

  async deleteArticle(): Promise<ArticlesPage> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.deleteIcon.click();

    return new ArticlesPage(this.page);
  }
  async clickCommentButton(): Promise<AddCommentView> {
    await this.addNewCommentButton.click();
    return new AddCommentView(this.page);
  }

  getArticleComment(commentText: string): ArticleComment {
    const commentContainer = this.page
      .locator('.comment-container')
      .filter({ hasText: commentText });

    return {
      body: commentContainer.locator(':text("comment:") + span'),
      link: commentContainer.locator("[id^='gotoComment']"),
    };
  }

  async clickCommentLink(
    commentContainer: ArticleComment,
  ): Promise<CommentPage> {
    await commentContainer.link.click();
    return new CommentPage(this.page);
  }
}
