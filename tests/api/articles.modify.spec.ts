import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

import exp = require('node:constants');

test.describe(
  'Verify articles modify operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let headers: Headers;
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

    test('should be able to modify and teplace content for an article with a logged-in user', async ({
      request,
    }) => {
      //Arrange
      const expectedStatusCode = 200;
      const modifiedArticleData = createArticlePayload();

      //Act
      const responseArticlePut = await request.put(
        `${apiUrls.articlesUrl}/${articleId}`,
        { headers, data: modifiedArticleData },
      );
      const modifiedArticleJson = await responseArticlePut.json();
      const actualResponseStatus = responseArticlePut.status();

      //Asert
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title);
      expect.soft(modifiedArticleJson.body).toEqual(modifiedArticleData.body);
      expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
      expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body);
    });
  },
);
