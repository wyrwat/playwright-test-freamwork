import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiLinks,
  createArticlePayload,
  getAuthHeader,
} from '@_src/utils/api.util';

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

      const articleData = createArticlePayload();

      // Act
      const response = await request.post(apiLinks.articlesUrl, {
        data: articleData,
      });

      //Expected
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.describe.configure({ mode: 'serial' });
    test.describe(
      'Verify articles CRUD operations',
      { tag: ['@GAD-R08-01', '@crud'] },
      () => {
        let articleId: number;
        let headers: { [key: string]: string };

        test('should create an article with a logged-in user', async ({
          request,
        }) => {
          // Arrange
          const expectedStatusCode = 201;
          headers = await getAuthHeader(request);

          const articleData = createArticlePayload();

          // Act
          const responseArticle = await request.post(apiLinks.articlesUrl, {
            headers,
            data: articleData,
          });

          //Expected
          const actualResponseStatus = responseArticle.status();
          expect(
            actualResponseStatus,
            `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticle.json();
          articleId = articleJson.id;

          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        });

        test('should be able to delete an article with a logged-in user', async ({
          request,
        }) => {
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const expectedStatusCode = 200;
          const responseArticle = await request.delete(
            `${apiLinks.articlesUrl}/${articleId}`,
            { headers },
          );
          console.log(responseArticle);
          const actualResponseStatus = responseArticle.status();

          expect(
            actualResponseStatus,
            `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);
        });
      },
    );
  },
);
