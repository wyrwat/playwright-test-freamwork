import { ArticlePage } from '@_src/pages/article.page';
import { expect, test } from '@playwright/test';

test.describe('Verify article', () => {
  test(
    'Non logged user can access created article',
    { tag: ['@GAD-R06-01', '@predefined_data'] },
    async ({ page }) => {
      //Arrange
      const expectedArticleTitle = 'Myth: Testing is only for finding bugs';
      const articlePage = new ArticlePage(page);
      //Act
      await articlePage.goto('?id=57');

      //Assert
      await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
    },
  );
});
