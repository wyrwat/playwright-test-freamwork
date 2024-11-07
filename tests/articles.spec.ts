import randomNewArticle from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test('Create new article', { tag: ['@GAD-R04-01'] }, async ({ page }) => {
    //Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser1);

    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();

    const addArticleView = new AddArticleView(page);
    await expect(addArticleView.header).toBeVisible();
    const addArticledata = randomNewArticle();
    const alertPopUp = 'Article was created';

    await addArticleView.addNewArticle(addArticledata);
    //Assert
    const article = new ArticlePage(page);
    await expect(article.alertPopup).toHaveText(alertPopUp);
    await expect(article.articleTitle).toHaveText(addArticledata.title);
    await expect(article.articleBody).toHaveText(addArticledata.body, {
      useInnerText: true,
    });
  });
});
