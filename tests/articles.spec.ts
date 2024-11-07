import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticlesView } from '../src/views/addArticle.view';
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

    const addArticlesView = new AddArticlesView(page);
    await expect(addArticlesView.header).toBeVisible();

    const newArticleTitle = 'article-title';
    const newArticleBody = 'test body';
    await addArticlesView.titleInput.fill(newArticleTitle);
    await addArticlesView.bodyInput.fill(newArticleBody);
    await addArticlesView.saveButton.click();
    //Assert
    const article = new ArticlePage(page);
    await expect(article.articleTitle).toHaveText(newArticleTitle);
    await expect(article.articleBody).toHaveText(newArticleBody);
  });
});
