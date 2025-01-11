import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint', () => {
  test(
    'GET articles return status code 200',
    { tag: ['@GAD-R08-01', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articleUrl = '/api/articles';

      // Act
      const response = await request.get(articleUrl);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );

  test(
    'Get acrticle should return at least one article',
    { tag: ['@GAD-R08-01', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedMinArticleCount = 1;
      const articleUrl = '/api/articles';

      // Act
      const response = await request.get(articleUrl);
      const responseJson = await response.json();

      // Assert
      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinArticleCount,
      );
    },
  );
});
