import { expect, test } from '@_src/fixtures/merge.fixture';
import {
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
    let currentDate;
    test.beforeAll('login and create article', async ({ request }) => {
      //Arrange
      headers = await getAuthHeader(request);

      const expectedStatusCode = 201;
      const articlesUrl = '/api/articles';
      const articleData = createArticlePayload();

      //Act
      const responseArticle = await request.post(articlesUrl, {
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
      currentDate = new Date();
      const expectedStatusCode = 201;
      const commentsUrl = '/api/comments';
      const commentsData = createCommentPayload(articleId);
      console.log(commentsData);
      // Act
      const responseComments = await request.post(commentsUrl, {
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
