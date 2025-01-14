import createRandomComment from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { ArticlePage } from '@_src/pages/article.page';
import { waitForResponse } from '@_src/utils/wait.util';
import { AddCommentView } from '@_src/views/addComment.view';

test.describe('Verify comment creation via API', () => {
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;

  test(
    'Should return created article from API',
    { tag: ['@GAD-R07-06', '@logged'] },
    async ({ createRandomArticle, page }) => {
      const popUpText = 'Comment was created';
      const newCommentData = createRandomComment(5);
      const expectedAddCommentHeader = 'Add New Comment';

      articlePage = createRandomArticle.articlePage;

      const waitParams = {
        page,
        url: '/api/comments',
        method: 'GET',
        text: newCommentData.body,
      };

      const responsePromise = waitForResponse(waitParams);

      // Arrange
      addCommentView = await articlePage.clickCommentButton();
      await expect
        .soft(addCommentView.addCommentHeader)
        .toHaveText(expectedAddCommentHeader);

      // Act
      articlePage = await addCommentView.createComment(newCommentData);
      const response = await responsePromise;

      //Assert
      await expect(articlePage.alertPopup).toHaveText(popUpText);
      expect(response.status()).toBeTruthy();
    },
  );
});
