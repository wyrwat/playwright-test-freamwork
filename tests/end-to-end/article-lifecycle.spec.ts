import createRandomNewArticle from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { AddArticleView } from '../../src/views/addArticle.view';
import test, { expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);

    await articlesPage.goto();
  });

  test(
    'Create new article',
    { tag: ['@GAD-R04-03', '@logged'] },
    async ({ page }) => {
      //Arrange
      addArticleView = new AddArticleView(page);
      const alertPopUp = 'Article was created';
      articleData = createRandomNewArticle(10, 60);

      //Act
      await articlesPage.addArticleButtonLogged.click();
      await expect(addArticleView.addNewHeader).toBeVisible();
      await addArticleView.addNewArticle(articleData);

      //Assert
      await expect(articlePage.alertPopup).toHaveText(alertPopUp);
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
      await expect(articlePage.articleBody).toHaveText(articleData.body, {
        useInnerText: true,
      });
    },
  );

  test(
    'Loged user can access single article',
    { tag: ['@GAD-R04-01', '@logged'] },
    async () => {
      //Act
      await articlesPage.gotoArticle(articleData.title);

      //Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title);
      await expect(articlePage.articleBody).toHaveText(articleData.body, {
        useInnerText: true,
      });
    },
  );

  test(
    'Loged user can delete his own article single article',
    { tag: ['@GAD-R04-04', '@logged'] },
    async () => {
      //Arrange
      const expectedArticleTitle = 'Articles';
      const expectedNoresultsText = 'No data';
      await articlesPage.gotoArticle(articleData.title);

      //Act
      await articlePage.deleteArticle();

      //Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticleTitle);

      await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText(expectedNoresultsText);
    },
  );
});
