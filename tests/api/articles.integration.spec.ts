import { expect, test } from '@_src/fixtures/merge.fixture';
import { createArticlePayload, getAuthHeader } from '@_src/utils/api.util';

test.describe(
  'Verify articles CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let headers: { [key: string]: string };

    test('should not create an article without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      headers = await getAuthHeader(request);
      const expectedStatusCode = 401;
      const articlesUrl = '/api/articles';
      const articleData = createArticlePayload();

      // Act
      const response = await request.post(articlesUrl, { data: articleData });

      //Expected
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('should create an article with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const articlesUrl = '/api/articles';
      const articleData = createArticlePayload();

      // Act
      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      //Expected
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await responseArticle.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);
    });
  },
);
