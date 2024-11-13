import createRandomNewArticle from '../../src/factories/article.factory';
import createRandomComment from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { AddCommentModel } from '../../src/models/comment.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/addArticle.view';
import { AddCommentView } from '../../src/views/addComment.view';
import { EditCommentView } from '../../src/views/editComment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;
  let editCommentData: AddCommentModel;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    addArticleView = new AddArticleView(page);
    commentPage = new CommentPage(page);
    articleData = createRandomNewArticle(10, 60);
    editCommentView = new EditCommentView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.addNewArticle(articleData);
  });

  test(
    'Operate on comment',
    { tag: ['@GAD-R05-01', '@GAD-R05-02', '@GAD-R05-03'] },
    async () => {
      const popUpText = 'Comment was created';
      const newCommentData = createRandomComment(5);
      const expectedAddCommentHeader = 'Add New Comment';

      await test.step('Create new comment', async () => {
        //Act
        await articlePage.addNewCommentButton.click();
        await expect
          .soft(addCommentView.addCommentHeader)
          .toHaveText(expectedAddCommentHeader);
        await addCommentView.createComment(newCommentData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(popUpText);
      });

      await test.step('Verify  new comment', async () => {
        //Act
        const articleComment = articlePage.getArticleComment(
          newCommentData.body,
        );
        await expect(articleComment.body).toHaveText(newCommentData.body);
        await articleComment.link.click();
        //Assert
        await expect(commentPage.commentBody).toHaveText(newCommentData.body);
      });

      await test.step('Update comment', async () => {
        //Arrange
        editCommentData = createRandomComment(1);
        const expectedCommentUpdatedPopup = 'Comment was updated';

        //Act
        await commentPage.editButton.click();
        await editCommentView.updatedComment(editCommentData);

        //Assert
        await expect(commentPage.alerPopup).toHaveText(
          expectedCommentUpdatedPopup,
        );
      });

      await test.step('Verify updated comment in article', async () => {
        //Act
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
        await commentPage.returnToArticleButton.click();
        const articleCommentUpdated = articlePage.getArticleComment(
          editCommentData.body,
        );

        //Assert
        await expect(articleCommentUpdated.body).toHaveText(
          editCommentData.body,
        );
      });

      await test.step('Add and verify second comment', async () => {
        //Arrange
        const secondCommentData = createRandomComment(3);
        //Act
        await articlePage.addNewCommentButton.click();
        await expect
          .soft(addCommentView.addCommentHeader)
          .toHaveText(expectedAddCommentHeader);
        await addCommentView.createComment(secondCommentData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(popUpText);
        const articleComment = articlePage.getArticleComment(
          secondCommentData.body,
        );
        await expect(articleComment.body).toHaveText(secondCommentData.body);
      });
    },
  );
});
