import createRandomNewArticle from '@_src/factories/article.factory';
import createRandomComment from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let headers = {};
    let currentDate;

    test.beforeAll('login and create article', async ({ request }) => {
      currentDate = new Date();

      const expectedStatusCode = 201;
      const loginUrl = '/api/login';
      const loginBody = {
        email: testUser1.userEmail,
        password: testUser1.userPassword,
      };
      const articlesUrl = '/api/articles';
      const randomArticledata = createRandomNewArticle();

      const requestBody = {
        title: randomArticledata.title,
        body: randomArticledata.body,
        date: currentDate,
        image:
          '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
      };
      const responseLogin = await request.post(loginUrl, { data: loginBody });
      const responseLoginJson = await responseLogin.json();

      headers = {
        Authorization: `Bearer ${responseLoginJson.access_token}`,
      };
      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: requestBody,
      });
      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
      const actualResponseStatus = responseArticle.status();

      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test('should not create an article with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      currentDate = new Date();

      const expectedStatusCode = 201;
      const commentsUrl = '/api/comments';
      const randomCommentData = createRandomComment();

      const commentsData = {
        article_id: articleId,
        body: randomCommentData.body,
        date: currentDate,
      };

      // Act
      const responseComments = await request.post(commentsUrl, {
        headers,
        data: commentsData,
      });

      //Expected
      const actualResponseStatus = responseComments.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComments.json();
      expect.soft(comment.body).toEqual(comment.body);
    });
  },
);
