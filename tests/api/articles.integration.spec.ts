import createRandomNewArticle from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify articles CRUD operations', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articlesUrl = '/api/articles';
    const randomArticleData = createRandomNewArticle();
    const requestBody = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-01-13T13:39:50.660Z',
      image: '',
    };

    // Act
    const response = await request.post(articlesUrl, { data: requestBody });

    //Expected
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should not create an article with a logged-in user', async ({
    request,
  }) => {
    // Arrange
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
      date: '2024-01-13T13:39:50.660Z',
      image:
        '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
    };

    // Act
    const responseLogin = await request.post(loginUrl, { data: loginBody });
    const responseLoginJson = await responseLogin.json();
    const headers = {
      Authorization: `Bearer ${responseLoginJson.access_token}`,
    };
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: requestBody,
    });

    //Expected
    const actualResponseStatus = responseArticle.status();
    expect(
      actualResponseStatus,
      `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const article = await responseArticle.json();
    expect.soft(article.title).toEqual(requestBody.title);
    expect.soft(article.body).toEqual(requestBody.body);
  });
});
