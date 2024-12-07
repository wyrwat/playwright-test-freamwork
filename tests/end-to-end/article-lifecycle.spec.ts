import createRandomNewArticle from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articleData: AddArticleModel;

  test(
    'Create new article',
    { tag: ['@GAD-R04-03', '@logged'] },
    async ({ addArticleView }) => {
      //Arrange
      const alertPopUp = 'Article was created';
      articleData = createRandomNewArticle(10, 60);

      //Act
      await expect(addArticleView.addNewHeader).toBeVisible();
      const articlePage = await addArticleView.createNewArticle(articleData);

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
    async ({ articlesPage }) => {
      //Act
      const articlePage = await articlesPage.gotoArticle(articleData.title);

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
    async ({ articlesPage }) => {
      //Arrange
      const expectedArticleTitle = 'Articles';
      const expectedNoresultsText = 'No data';
      const articlePage = await articlesPage.gotoArticle(articleData.title);

      //Act
      articlesPage = await articlePage.deleteArticle();

      //Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticleTitle);

      articlesPage = await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText(expectedNoresultsText);
    },
  );
});
