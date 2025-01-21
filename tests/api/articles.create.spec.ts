import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

import exp = require('node:constants');

test.describe(
  'Verify articles create operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let headers: Headers;

    test('should not create an article without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      headers = await getAuthHeader(request);
      const expectedStatusCode = 401;
      const articleData = createArticlePayload();

      // Act
      const response = await request.post(apiUrls.articlesUrl, {
        data: articleData,
      });

      //Expected
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.describe(
      'Verify articles create operations',
      { tag: ['@GAD-R08-01', '@crud'] },
      () => {
        test.beforeAll('login', async ({ request }) => {
          headers = await getAuthHeader(request);
        });

        test('should create an article with a logged-in user', async ({
          request,
        }) => {
          // Arrange
          const expectedStatusCode = 201;
          const articleData = createArticlePayload();

          //Act
          const responseArticle = await createArticleWithApi(
            request,
            headers,
            articleData,
          );

          //Assert
          const actualResponseStatus = responseArticle.status();
          expect(
            actualResponseStatus,
            `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticle.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        });
      },
    );
  },
);
