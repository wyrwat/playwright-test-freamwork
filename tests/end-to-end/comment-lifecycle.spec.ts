import createRandomNewArticle from '@_src/factories/article.factory';
import createRandomComment from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentPage } from '@_src/pages/comment.page';
import { LoginPage } from '@_src/pages/login.page';
import { AddArticleView } from '@_src/views/addArticle.view';
import { AddCommentView } from '@_src/views/addComment.view';
import { EditCommentView } from '@_src/views/editComment.view';
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
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    addArticleView = new AddArticleView(page);
    commentPage = new CommentPage(page);
    articleData = createRandomNewArticle(10, 60);
    editCommentView = new EditCommentView(page);

    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.addNewArticle(articleData);
  });

  test(
    'Operate on comment',
    { tag: ['@GAD-R05-01', '@GAD-R05-02', '@GAD-R05-03', '@logged'] },
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
    },
  );
  test(
    'User can add second comment',
    { tag: ['@GAD-R05-03', '@logged'] },
    async () => {
      const expectedAddCommentHeader = 'Add New Comment';
      const popUpText = 'Comment was created';
      const newCommentData = createRandomComment(3);

      await test.step('Create first comment', async () => {
        //Act
        await articlePage.addNewCommentButton.click();
        await expect
          .soft(addCommentView.addCommentHeader)
          .toHaveText(expectedAddCommentHeader);
        await addCommentView.createComment(newCommentData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(popUpText);
      });

      await test.step('create and verify second comment', async () => {
        const secondCommentData = createRandomComment(3);

        const secondCommendBody =
          await test.step('create comment', async () => {
            await articlePage.addNewCommentButton.click();
            await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });

        await test.step('verify comment', async () => {
          await expect(articlePage.alertPopup).toHaveText(popUpText);
          const articleComment =
            articlePage.getArticleComment(secondCommendBody);
          await expect(articleComment.body).toHaveText(secondCommendBody);
          await articleComment.link.click();
          await expect(commentPage.commentBody).toHaveText(secondCommendBody);
        });
      });
    },
  );
});
