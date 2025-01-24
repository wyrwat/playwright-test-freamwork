import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { createCommentPayload } from '@_src/api/factories/comment-payload.ap.factory';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;

    test.beforeAll('login and create article', async ({ request }) => {
      //Arrange
      headers = await getAuthHeader(request);
      const responseArticle = await createArticleWithApi(request, headers);
      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test('should create a comment with logged-in user', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;
      const commentData = createCommentPayload(articleId);
      //Act
      const responseComments = await createCommentWithApi(
        request,
        headers,
        commentData,
      );

      const rerponseJson = await responseComments.json();
      commentId = rerponseJson.id;

      //Expected
      const actualResponseStatus = responseComments.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComments.json();
      expect.soft(comment.body).toEqual(comment.body);
    });

    test('should create new comment when modified comment id not exist with logged-in user @GAD-R10-01', async ({
      request,
    }) => {
      //Arrange
      const expectedStatusCode = 201;
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
    });
  },
);
