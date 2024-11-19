import createRandomNewArticle from '@_src/factories/article.factory';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { LoginPage } from '@_src/pages/login.page';
import { AddArticleView } from '@_src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);

    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await expect(addArticleView.addNewHeader).toBeVisible();
  });

  test(
    'Reject create article - empty title',
    { tag: ['@GAD-R04-01', '@logged'] },
    async () => {
      //Arrange
      const alertPopUp = 'Article was not created';
      const articleData = createRandomNewArticle(10, 60);

      //Act
      await addArticleView.bodyInput.fill(articleData.body);
      await addArticleView.saveButton.click();

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
    },
  );

  test(
    'Rejectt create article - empty body',
    { tag: ['@GAD-R04-01', '@logged'] },
    async () => {
      //Arrange
      const alertPopUp = 'Article was not created';
      const articleData = createRandomNewArticle();

      //Act
      await addArticleView.titleInput.fill(articleData.title);
      await addArticleView.saveButton.click();

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
    },
  );
  test.describe('Title length', () => {
    test(
      'Reject create article - title exceed 128 char',
      { tag: ['@GAD-R04-02', '@logged'] },
      async () => {
        //Arrange
        const alertPopUp = 'Article was not created';

        const articleData = createRandomNewArticle(129, 60);

        //Act
        await addArticleView.addNewArticle(articleData);
        await addArticleView.saveButton.click();

        //Assert
        await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
      },
    );

    test(
      'Create article - title with 128 char',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ page }) => {
        //Arrange
        const alertPopUp = 'Article was created';
        const articlePage = new ArticlePage(page);
        const articleData = createRandomNewArticle(128, 60);

        //Act
        await addArticleView.addNewArticle(articleData);

        //Assert
        await expect(articlePage.alertPopup).toHaveText(alertPopUp);
        await expect(articlePage.articleTitle).toHaveText(articleData.title);
        await expect(articlePage.articleBody).toHaveText(articleData.body, {
          useInnerText: true,
        });
      },
    );
  });
});