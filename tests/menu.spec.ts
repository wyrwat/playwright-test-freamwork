import { ArticlesPage } from '../src/pages/articles.page';
import { CommentsPage } from '../src/pages/comments.page';
import { HomePage } from '../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigate to comments page',
    { tag: ['@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const expecetedCommentsTitle = 'Comments';

      const articlesPage = new ArticlesPage(page);
      const commentsPage = new CommentsPage(page);
      //Act
      await articlesPage.goto();
      await articlesPage.mainMenu.commentsButton.click();

      //Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain(expecetedCommentsTitle);
    },
  );

  test(
    'Articles button navigate to articles page',
    { tag: ['@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const expectedArticleTitle = 'Articles';
      const commentsPage = new CommentsPage(page);
      const articlesPage = new ArticlesPage(page);

      //Act
      await commentsPage.goto();
      await commentsPage.mainMenu.articlesButton.click();

      //Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticleTitle);
    },
  );

  test(
    'Home button navigate to home page',
    { tag: ['@GAD-R01-02'] },
    async ({ page }) => {
      //Arrange
      const expectedHomePageTitle = 'GAD';
      const commentsPage = new CommentsPage(page);
      const homePage = new HomePage(page);
      //Act
      await commentsPage.goto();
      await commentsPage.mainMenu.homePage.click();

      //Assert
      const title = await homePage.getTitle();
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
