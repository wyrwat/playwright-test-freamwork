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
  'Verify articles DELETE operations',
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
