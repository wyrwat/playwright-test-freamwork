import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @api', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET articles returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articlesUrl = '/api/articles';

      // Act
      const response = await request.get(articlesUrl);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('GET articles should return at least one article @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedMinArticlesCount = 1;
      const articlesUrl = '/api/articles';

      // Act
      const response = await request.get(articlesUrl);
      const responseJson = await response.json();

      // Assert
      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinArticlesCount,
      );
    });

    test('GET articles return article object @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedRequiredFields = [
        'id',
        'user_id',
        'title',
        'body',
        'date',
        'image',
      ];

      const articlesUrl = '/api/articles';

      // Act
      const response = await request.get(articlesUrl);
      const responseJson = await response.json();
      const article = responseJson[0];

      // Assert
      expectedRequiredFields.forEach((key) => {
        expect
          .soft(article, `Expected key "${key}" should be in object`)
          .toHaveProperty(key);
      });
    });
  });

  test('GET articles should return an object with required fields @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const articlesUrl = '/api/articles';
    const response = await request.get(articlesUrl);

    await test.step('GET articles returns status code 200', async () => {
      const expectedStatusCode = 200;

      expect(response.status()).toBe(expectedStatusCode);
    });

    const responseJson = await response.json();
    await test.step('GET articles should return at least one article', async () => {
      const expectedMinArticlesCount = 1;

      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinArticlesCount,
      );
    });

    const expectedRequiredFields = [
      'id',
      'user_id',
      'title',
      'body',
      'date',
      'image',
    ];

    const article = responseJson[0];

    expectedRequiredFields.forEach(async (key) => {
      await test.step(`response object contains required field: "${key}"`, async () => {
        expect.soft(article).toHaveProperty(key);
      });
    });
  });
});
