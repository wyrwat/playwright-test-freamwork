import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify article', () => {
  test(
    'Non logged user can access created article',
    { tag: ['@GAD-R06-01', '@predefined_data'] },
    async ({ articlePage }) => {
      //Arrange
      const expectedArticleTitle = 'Myth: Testing is only for finding bugs';
      //Act
      await articlePage.goto('?id=57');

      //Assert
      await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
    },
  );
});
