import createRandomNewArticle from '@_src/factories/article.factory';
import createRandomComment from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthHeader } from '@_src/utils/api.util';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R08-01', '@crud'] },
  () => {
    let articleId: number;
    let headers: { [key: string]: string };
    let currentDate;

    test.beforeAll('login and create article', async ({ request }) => {
      //Arrange
      currentDate = new Date();
      headers = await getAuthHeader(request);

      const expectedStatusCode = 201;
      const articlesUrl = '/api/articles';
      const randomArticledata = createRandomNewArticle();

      const requestBody = {
        title: randomArticledata.title,
        body: randomArticledata.body,
        date: currentDate,
        image:
          '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
      };

      //Act
      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: requestBody,
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
