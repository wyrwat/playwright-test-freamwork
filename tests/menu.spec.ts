import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { test as baseTest, expect } from '@playwright/test';

const test = baseTest.extend({
  articlesPage: async ({ page }, use) => {
    const articlePage = new ArticlesPage(page);
    articlePage.goto();
    await use(articlePage);
  },
});

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigate to comments page',
    { tag: ['@GAD-R01-02'] },
    async ({ articlesPage }) => {
      //Arrange
      const expecetedCommentsTitle = 'Comments';

      //Act
      const commentsPage = await articlesPage.mainMenu.clickCommentButton();

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

      //Act
      await commentsPage.goto();
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();

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

      //Act
      await commentsPage.goto();
      const homePage = await commentsPage.mainMenu.clickHomeButton();

      //Assert
      const title = await homePage.getTitle();
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
