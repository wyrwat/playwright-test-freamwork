import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiLinks,
  createArticlePayload,
  createCommentPayload,
  getAuthHeader,
} from '@_src/utils/api.util';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let headers: { [key: string]: string };

    test.beforeAll('login and create article', async ({ request }) => {
      //Arrange
      headers = await getAuthHeader(request);

      const expectedStatusCode = 201;

      const articleData = createArticlePayload();

      //Act
      const responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;

      const actualResponseStatus = responseArticle.status();

      //Assert
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test('should create a comment with logged-in user', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;
      const commentsData = createCommentPayload(articleId);

      // Act
      const responseComments = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentsData,
      });

      //Expected
      const actualResponseStatus = responseComments.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComments.json();
      expect.soft(comment.body).toEqual(comment.body);
    });
  },
);
