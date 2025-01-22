import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { createCommentPayload } from '@_src/api/factories/comment-payload.ap.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments modify operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;
    let responseComments: APIResponse;
    let commentData: CommentPayload;

    test.beforeAll('login and create article', async ({ request }) => {
      headers = await getAuthHeader(request);
      const responseArticle = await createArticleWithApi(request, headers);
      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test.beforeEach('create comments', async ({ request }) => {
      commentData = createCommentPayload(articleId);

      responseComments = await createCommentWithApi(
        request,
        headers,
        articleId,
        commentData,
      );

      const rerponseJson = await responseComments.json();
      commentId = rerponseJson.id;
    });

    test('should be able to modify and replace content for an comment with a logged-in user', async ({
      request,
    }) => {
      //Arrange
      const expectedStatusCode = 200;
      const modifiedCommentData = createCommentPayload(articleId);

      //Act
      const responseCommentsPut = await request.put(
        `${apiUrls.commentsUrl}/${commentId}`,
        { headers, data: modifiedCommentData },
      );

      const actualResponseStatus = responseCommentsPut.status();
      const modifiedCommentJson = await responseCommentsPut.json();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      expect.soft(modifiedCommentJson.body).toEqual(modifiedCommentData.body);
      expect.soft(modifiedCommentJson.body).not.toEqual(commentData.body);
    });

    test('should not modify an comment with a non logged-in user @GAD-R10-01', async ({
      request,
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const expectedStatusCode = 401;
      responseComments = await request.put(
        `${apiUrls.commentsUrl}/${commentId}`,
      );

      const actualResponseStatus = responseComments.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
    });
  },
);
