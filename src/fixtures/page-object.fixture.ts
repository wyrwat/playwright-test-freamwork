import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { LoginPage } from '@_src/pages/login.page';
import { RegisterPage } from '@_src/pages/register.page';
import { AddArticleView } from '@_src/views/addArticle.view';
import { test as baseTest } from '@playwright/test';

interface Pages {
  articlePage: ArticlePage;
  addArticleView: AddArticleView;
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
}

export const pageObjectTest = baseTest.extend<Pages>({
  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page);
    await use(articlePage);
  },
  articlesPage: async ({ page }, use) => {
    const articlePage = new ArticlesPage(page);
    await articlePage.goto();
    await use(articlePage);
  },

  addArticleView: async ({ articlesPage }, use) => {
    const addArticleView = await articlesPage.clickAddArticleButton();
    await use(addArticleView);
  },

  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(commentsPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});
