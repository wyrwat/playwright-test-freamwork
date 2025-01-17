import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiLinks,
  createArticlePayload,
  createCommentPayload,
  getAuthHeader,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;
    let responseComments: APIResponse;
    let commentsData: CommentPayload;

    test.beforeAll('login and create article', async ({ request }) => {
      //Arrange
      headers = await getAuthHeader(request);

      const expectedStatusCode = 201;
      const articleData = createArticlePayload();

      //Act
      const responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;

      const actualResponseStatus = responseArticle.status();

      //Assert
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test.beforeEach('create comments', async ({ request }) => {
      // Act
      commentsData = createCommentPayload(articleId);
      responseComments = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentsData,
      });

      const rerponseJson = await responseComments.json();
      commentId = rerponseJson.id;

      await expect(async () => {
        const responseCommentsCreated = await request.get(
          `${apiLinks.commentsUrl}/${commentId}`,
        );

        expect(
          responseCommentsCreated.status(),
          `Expected status: 200, actual status: ${responseCommentsCreated.status()}`,
        ).toBe(200);
      }).toPass({ timeout: 2_000 });
    });

    test('should create a comment with logged-in user', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;

      //Expected
      const actualResponseStatus = responseComments.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComments.json();
      expect.soft(comment.body).toEqual(comment.body);
    });

    test('should be able to delete an comment with a logged-in user', async ({
      request,
    }) => {
      const expectedStatusCode = 201;
      const responseArticle = await request.delete(
        `${apiLinks.commentsUrl}/${commentId}`,
        { headers },
      );

      const actualResponseStatus = responseComments.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      const responseGet = await request.get(
        `${apiLinks.commentsUrl}/${commentId}`,
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
        `${apiLinks.commentsUrl}/${commentId}`,
      );

      const actualResponseStatus = responseComments.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      const responseGet = await request.get(
        `${apiLinks.commentsUrl}/${commentId}`,
      );
      const responseGetStatus = responseGet.status();
      expect(responseGetStatus).toEqual(200);
    });
  },
);
