import createRandomNewArticle from '../../src/factories/article.factory';
import createRandomComment from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/addArticle.view';
import { AddCommentView } from '../../src/views/addComment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    addArticleView = new AddArticleView(page);
    commentPage = new CommentPage(page);
    articleData = createRandomNewArticle(10, 60);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.addNewArticle(articleData);
  });

  test('Create new comment', { tag: ['@GAD-R04-03'] }, async () => {
    //Arrange
    const popUpText = 'Comment was created';

    const newCommentData = createRandomComment(5);
    //Act
    await articlePage.addNewCommentButton.click();
    await expect(addCommentView.addCommentHeader).toBeVisible();
    await addCommentView.commentBodyInput.fill(newCommentData.body);
    await addCommentView.saveButton.click();

    //Assert
    await expect(articlePage.alertPopup).toHaveText(popUpText);

    //veryfi comment
    //Act
    const articleComment = articlePage.getArticleComment(newCommentData.body);
    await expect(articleComment.body).toHaveText(newCommentData.body);
    await articleComment.link.click();
    //Assert
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);
  });
});
