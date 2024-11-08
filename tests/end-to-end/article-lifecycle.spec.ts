import randomNewArticle from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
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
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
  });

  test('Create new article', { tag: ['@GAD-R04-03'] }, async ({ page }) => {
    //Arrange
    addArticleView = new AddArticleView(page);
    const alertPopUp = 'Article was created';
    articleData = randomNewArticle(10, 60);

    //Act
    await articlesPage.addArticleButtonLogged.click();
    await expect(addArticleView.header).toBeVisible();
    await addArticleView.addNewArticle(articleData);

    //Assert
    await expect(articlePage.alertPopup).toHaveText(alertPopUp);
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test(
    'Loged user can access single article',
    { tag: ['@GAD-R04-01'] },
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
    { tag: ['@GAD-R04-04'] },
    async () => {
      //Arrange
      await articlesPage.gotoArticle(articleData.title);

      //Act
      await articlePage.deleteArticle();

      //Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.title();
      expect(title).toContain('Articles');

      await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText('No data');
    },
  );
});
