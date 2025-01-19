import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import {
  ArticlePayload,
  createArticlePayload,
} from '@_src/api/factories/article-payload.ap.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
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
      const response = await request.post(apiUrls.articlesUrl, {
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
          const data = createArticleWithApi(request, headers);
          articleData = createArticlePayload();
          responseArticle = await createArticleWithApi(
            request,
            headers,
            articleData,
          );

          const responseArticleJson = await responseArticle.json();
          articleId = responseArticleJson.id;
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
            `${apiUrls.articlesUrl}/${articleId}`,
            { headers },
          );
          console.log(responseArticle);
          const actualResponseStatus = responseArticle.status();

          expect(
            actualResponseStatus,
            `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);
          const responseGet = await request.get(
            `${apiUrls.articlesUrl}/${articleId}`,
          );
          const responseGetStatus = responseGet.status();
          expect(responseGetStatus).toEqual(404);
        });
      },
    );
  },
);
