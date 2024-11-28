import { expect, test } from '@_src/fixtures/merge.fixture';

// interface Pages {
//   articlesPage: ArticlesPage;
//   commentsPage: CommentsPage;
// }

// const test = baseTest.extend<Pages>({
//   articlesPage: async ({ page }, use) => {
//     const articlePage = new ArticlesPage(page);
//     articlePage.goto();
//     await use(articlePage);
//   },
//   commentsPage: async ({ page }, use) => {
//     const commentsPage = new CommentsPage(page);
//     commentsPage.goto();
//     await use(commentsPage);
//   },
// });

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
    async ({ commentsPage }) => {
      //Arrange
      const expectedArticleTitle = 'Articles';

      //Act
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
      const title = await articlesPage.getTitle();

      //Assert
      expect(title).toContain(expectedArticleTitle);
    },
  );

  test(
    'Home button navigate to home page',
    { tag: ['@GAD-R01-02'] },
    async ({ commentsPage }) => {
      //Arrange
      const expectedHomePageTitle = 'GAD';

      //Act
      const homePage = await commentsPage.mainMenu.clickHomeButton();
      const title = await homePage.getTitle();

      //Assert
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
