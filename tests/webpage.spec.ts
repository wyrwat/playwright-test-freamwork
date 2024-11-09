import { ArticlesPage } from '../src/pages/articles.page';
import { CommentsPage } from '../src/pages/comments.page';
import { HomePage } from '../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify service main pages', () => {
  test('Home page has title', { tag: ['@GAD-R01-02'] }, async ({ page }) => {
    // Arange
    const homePage = new HomePage(page);

    //Act
    await homePage.goto();

    //Assert
    const title = await homePage.getTitle();
    expect(title).toContain('GAD');
  });

  test(
    'Arcticles page has title',
    { tag: ['@GAD-R01-02'] },
    async ({ page }) => {
      // Arange
      const articlesPage = new ArticlesPage(page);

      //Act
      await articlesPage.goto();

      //Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain('Articles');
    },
  );

  test(
    'Comments page has title',
    { tag: ['@GAD-R01-02'] },
    async ({ page }) => {
      // Arange

      const commentsPage = new CommentsPage(page);
      //Act
      await commentsPage.goto();

      //Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain('Comments');
    },
  );

  test('Home page has title simple', async ({ page }) => {
    //Act
    await page.goto('');

    //Assert
    await expect(page).toHaveTitle(/GAD/);
  });
});
