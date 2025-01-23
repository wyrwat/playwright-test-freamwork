import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import createRandomNewArticle from '@_src/ui/factories/article.factory';
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
      articleData = createArticlePayload();
      responseArticle = await createArticleWithApi(
        request,
        headers,
        articleData,
      );

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test('should be able to modify and replace content for an article with a logged-in user', async ({
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

    test('should be able to partially modify content for an article with a logged-in user', async ({
      request,
    }) => {
      //Arrange
      const expectedStatusCode = 200;
      const randomArticledata = createRandomNewArticle(4, 4);
      const modifiedArticleData = { title: randomArticledata.title };

      //Act
      const responseArticlePatch = await request.patch(
        `${apiUrls.articlesUrl}/${articleId}`,
        { headers, data: modifiedArticleData },
      );

      const modifiedArticleJson = await responseArticlePatch.json();
      const actualResponseStatus = responseArticlePatch.status();

      //Asert
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title);
      expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
      expect.soft(modifiedArticleJson.body).toEqual(articleData.body);
    });

    test('should not modify an article with a non logged-in user @GAD-R10-01', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;
      const modifiedArticleData = createArticlePayload();
      // Act
      const responseArticlePut = await request.put(
        `${apiUrls.articlesUrl}/${articleId}`,
        {
          data: modifiedArticleData,
        },
      );
      // Assert
      const actualResponseStatus = responseArticlePut.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      const nonModifiedArticle = await request.get(
        `${apiUrls.articlesUrl}/${articleId}`,
      );
      const nonModifiedArticleJson = await nonModifiedArticle.json();
      expect
        .soft(nonModifiedArticleJson.title)
        .not.toEqual(modifiedArticleData.title);
      expect
        .soft(nonModifiedArticleJson.body)
        .not.toEqual(modifiedArticleData.body);
      expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
      expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
    });
  },
);
