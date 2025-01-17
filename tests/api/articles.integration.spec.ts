import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  createArticlePayload,
  getAuthHeader,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

import exp = require('node:constants');

test.describe(
  'Verify articles CRUD operations',
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
      const response = await request.post(apiLinks.articlesUrl, {
        data: articleData,
      });

      //Expected
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.describe(
      'Verify articles CRUD operations',
      { tag: ['@GAD-R08-01', '@crud'] },
      () => {
        let responseArticle: APIResponse;
        let articleData: ArticlePayload;
        let articleId: number;

        test.beforeAll('login', async ({ request }) => {
          headers = await getAuthHeader(request);
        });

        test.beforeEach('create article', async ({ request }) => {
          articleData = createArticlePayload();
          responseArticle = await request.post(apiLinks.articlesUrl, {
            headers,
            data: articleData,
          });
          const responseArticleJson = await responseArticle.json();
          articleId = responseArticleJson.id;

          await expect(async () => {
            const responseArticleCreated = await request.get(
              `${apiLinks.articlesUrl}/${articleId}`,
            );
            expect(
              responseArticleCreated.status(),
              `Expected status: 200, actual status: ${responseArticleCreated.status()}`,
            ).toBe(200);
          }).toPass({ timeout: 2_000 });
        });

        test('should create an article with a logged-in user', async ({}) => {
          // Arrange
          const expectedStatusCode = 201;

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

        test('should be able to delete an article with a logged-in user', async ({
          request,
        }) => {
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
          const responseGet = await request.get(
            `${apiLinks.articlesUrl}/${articleId}`,
          );
          const responseGetStatus = responseGet.status();
          expect(responseGetStatus).toEqual(404);
        });
      },
    );
  },
);
