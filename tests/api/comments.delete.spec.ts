import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments DELETE operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;
    let responseComments: APIResponse;

    test.beforeAll('login and create article', async ({ request }) => {
      headers = await getAuthHeader(request);
      const responseArticle = await createArticleWithApi(request, headers);
      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test.beforeEach('create comments', async ({ request }) => {
      responseComments = await createCommentWithApi(
        request,
        headers,
        articleId,
      );

      const rerponseJson = await responseComments.json();
      commentId = rerponseJson.id;
    });

    test('should be able to delete an comment with a logged-in user', async ({
      request,
    }) => {
      const expectedStatusCode = 201;
      const responseArticle = await request.delete(
        `${apiUrls.commentsUrl}/${commentId}`,
        { headers },
      );

      const actualResponseStatus = responseComments.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      const responseGet = await request.get(
        `${apiUrls.commentsUrl}/${commentId}`,
      );
      const responseGetStatus = responseGet.status();
      expect(responseGetStatus).toEqual(404);
    });

    test('should be not able to delete an comment with a  non logged-in user', async ({
      request,
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const expectedStatusCode = 401;
      responseComments = await request.delete(
        `${apiUrls.commentsUrl}/${commentId}`,
      );

      const actualResponseStatus = responseComments.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      const responseGet = await request.get(
        `${apiUrls.commentsUrl}/${commentId}`,
      );
      const responseGetStatus = responseGet.status();
      expect(responseGetStatus).toEqual(200);
    });
  },
);
