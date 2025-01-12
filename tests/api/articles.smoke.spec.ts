import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint', () => {
  test.describe('Verify each condition in separate test', () => {
    test(
      'GET articles should return an object with required field',
      { tag: ['@GAD-R08-01', '@api'] },
      async ({ request }) => {
        // Arrange

        const articleUrl = '/api/articles';
        const response = await request.get(articleUrl);
        const responseJson = await response.json();

        await test.step('Get articles returns statys code 200', () => {
          const expectedStatusCode = 200;
          expect(response.status()).toBe(expectedStatusCode);
        });

        await test.step('GET article should returns at least one article', () => {
          const expectedMinArticleCount = 1;

          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinArticleCount,
          );
        });

        await test.step('GET articles return article object', () => {
          const expectedRequiredFields = [
            'id',
            'user_id',
            'title',
            'date',
            'image',
          ];

          const article = responseJson[0];

          expectedRequiredFields.forEach((field) => {
            expect.soft(article).toHaveProperty(field);
          });
        });
      },
    );
  });
});
