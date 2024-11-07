import randomNewArticle from '../src/factories/article.factory';
import { AddArticleModel } from '../src/models/article.model';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articleData = randomNewArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    await articlesPage.addArticleButtonLogged.click();
    await expect(addArticleView.header).toBeVisible();
  });

  test('Create new article', { tag: ['@GAD-R04-01'] }, async ({ page }) => {
    //Arrange

    const alertPopUp = 'Article was created';
    const articlePage = new ArticlePage(page);

    //Act
    await addArticleView.addNewArticle(articleData);

    //Assert
    await expect(articlePage.alertPopup).toHaveText(alertPopUp);
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toHaveText(articleData.body, {
      useInnerText: true,
    });
  });

  test(
    'Reject create article - empty title',
    { tag: ['@GAD-R04-01'] },
    async () => {
      //Arrange
      const alertPopUp = 'Article was not created';

      //Act
      await addArticleView.bodyInput.fill(articleData.body);
      await addArticleView.saveButton.click();

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
    },
  );

  test(
    'Rejectt create article - empty body',
    { tag: ['@GAD-R04-01'] },
    async () => {
      //Arrange
      const alertPopUp = 'Article was not created';

      //Act
      await addArticleView.titleInput.fill(articleData.title);
      await addArticleView.saveButton.click();

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
    },
  );
});
