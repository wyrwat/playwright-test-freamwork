import createRandomComment from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { CommentPage } from '@_src/pages/comment.page';
import { AddCommentView } from '@_src/views/addComment.view';

test.describe('Create, verify and delete comment', () => {
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentData: AddCommentModel;

  test(
    'Operate on comment',
    { tag: ['@GAD-R05-01', '@GAD-R05-02', '@GAD-R05-03', '@logged'] },
    async ({ createRandomArticle }) => {
      const popUpText = 'Comment was created';
      const newCommentData = createRandomComment(5);
      const expectedAddCommentHeader = 'Add New Comment';
      articlePage = createRandomArticle.articlePage;

      await test.step('Create new comment', async () => {
        //Act
        addCommentView = await articlePage.clickCommentButton();
        await expect
          .soft(addCommentView.addCommentHeader)
          .toHaveText(expectedAddCommentHeader);

        articlePage = await addCommentView.createComment(newCommentData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(popUpText);
      });

      await test.step('Verify  new comment', async () => {
        //Act
        const articleComment = articlePage.getArticleComment(
          newCommentData.body,
        );
        await expect(articleComment.body).toHaveText(newCommentData.body);
        commentPage = await articlePage.clickCommentLink(articleComment);

        //Assert
        await expect(commentPage.commentBody).toHaveText(newCommentData.body);
      });

      await test.step('Update comment', async () => {
        //Arrange
        editCommentData = createRandomComment(1);
        const expectedCommentUpdatedPopup = 'Comment was updated';

        //Act
        const editCommentView = await commentPage.clickEditButton();
        commentPage = await editCommentView.updatedComment(editCommentData);

        //Assert
        await expect(commentPage.alerPopup).toHaveText(
          expectedCommentUpdatedPopup,
        );
      });

      await test.step('Verify updated comment in article', async () => {
        //Act
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
        const articlePage = await commentPage.clickReturnToArticleLink();
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
        addCommentView = await articlePage.clickCommentButton();
        await expect
          .soft(addCommentView.addCommentHeader)
          .toHaveText(expectedAddCommentHeader);
        articlePage = await addCommentView.createComment(newCommentData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(popUpText);
      });

      await test.step('create and verify second comment', async () => {
        const secondCommentData = createRandomComment(4);

        const secondCommentBody =
          await test.step('create comment', async () => {
            addCommentView = await articlePage.clickCommentButton();
            articlePage = await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });

        await test.step('verify comment', async () => {
          await expect(articlePage.alertPopup).toHaveText(popUpText);
          const articleComment =
            articlePage.getArticleComment(secondCommentBody);
          await expect(articleComment.body).toHaveText(secondCommentBody);
          commentPage = await articlePage.clickCommentLink(articleComment);
          await expect(commentPage.commentBody).toHaveText(secondCommentBody);
        });
      });
    },
  );
});
