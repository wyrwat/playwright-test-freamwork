import { RESPONSE_TIMEOUT } from '@_pw-config';
import createRandomNewArticle from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles', () => {
  test(
    'Reject create article - empty title',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticleView, page }) => {
      //Arrange
      const alertPopUp = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = createRandomNewArticle(10, 60);
      articleData.title = '';
      const responsePromise = page.waitForResponse('/api/articles', {
        timeout: RESPONSE_TIMEOUT,
      });

      //Act
      await addArticleView.createNewArticle(articleData);
      const response = await responsePromise;
      expect(response.status()).toBe(expectedResponseCode);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
    },
  );

  test(
    'Rejectt create article - empty body',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticleView }) => {
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
      async ({ addArticleView }) => {
        //Arrange
        const alertPopUp = 'Article was not created';

        const articleData = createRandomNewArticle(129, 60);

        //Act
        await addArticleView.createNewArticle(articleData);

        //Assert
        await expect(addArticleView.alertPopup).toHaveText(alertPopUp);
      },
    );

    test(
      'Create article - title with 128 char',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticleView }) => {
        //Arrange
        const alertPopUp = 'Article was created';
        const articleData = createRandomNewArticle(128, 60);

        //Act
        const articlePage = await addArticleView.createNewArticle(articleData);

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
