import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify service main pages', () => {
  test(
    'Home page has title', 
    { tag: ['@GAD-R01-02'] }, 
    async ({ homePage }) => {
    // Arange
   const expectedHomePageTitle = 'GAD';

    // //Assert
    const title = await homePage.getTitle();
    expect(title).toContain(expectedHomePageTitle);
  });

  test(
    'Arcticles page has title',
    { tag: ['@GAD-R01-02'] },
    async ({ articlesPage }) => {
      // Arange
      const expectedArticleTitle = 'Articles';

      //Act
      await articlesPage.goto();

      //Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticleTitle);
    },
  );

  test(
    'Comments page has title',
    { tag: ['@GAD-R01-02'] },
    async ({ commentsPage }) => {
      // Arange
      const expecetedCommentsTitle = 'Comments';

      //Act
      await commentsPage.goto();

      //Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain(expecetedCommentsTitle);
    },
  );

  test('Home page has title simple', async ({ page }) => {
    //Act
    await page.goto('');

    //Assert
    await expect(page).toHaveTitle(/GAD/);
  });
});
