import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigate to comments page',
    { tag: ['@smoke', '@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const articlesPage = new ArticlesPage(page);

      //Act
      await articlesPage.goto();
      await articlesPage.mainMenu.commentsButton.click();

      //Assert
      const commentsPage = new CommentsPage(page);
      const title = await commentsPage.title();
      expect(title).toContain('Comments');
    },
  );

  test(
    'Articles button navigate to articles page',
    { tag: ['@smoke', '@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const commentsPage = new CommentsPage(page);

      //Act
      await commentsPage.goto();
      await commentsPage.mainMenu.articlesButton.click();

      //Assert
      const articlesPage = new ArticlesPage(page);
      const title = await articlesPage.title();
      expect(title).toContain('Articles');
    },
  );

  test(
    'Home button navigate to home page',
    { tag: ['@smoke', '@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const commentsPage = new CommentsPage(page);

      //Act
      await commentsPage.goto();
      await commentsPage.mainMenu.homePage.click();

      //Assert
      const homePage = new HomePage(page);
      const title = await homePage.title();
      expect(title).toContain('GAD');
    },
  );
});
