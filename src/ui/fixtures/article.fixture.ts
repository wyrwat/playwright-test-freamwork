import createRandomNewArticle from '@_src/ui/factories/article.factory';
import { pageObjectTest } from '@_src/ui/fixtures/page-object.fixture';
import { AddArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage } from '@_src/ui/pages/article.page';

interface ArticleCreationContext {
  articlePage: ArticlePage;
  articleData: AddArticleModel;
}
interface ArticleFixtures {
  createRandomArticle: ArticleCreationContext;
  randomArticle: (
    articleData: AddArticleModel,
  ) => Promise<ArticleCreationContext>;
}

export const articleTest = pageObjectTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ addArticleView }, use) => {
    const articleData = createRandomNewArticle(10, 60);
    const articlePage = await addArticleView.createNewArticle(articleData);
    await use({ articlePage, articleData });
  },
  randomArticle: async ({ addArticleView }, use) => {
    const create = async (
      articleData: AddArticleModel,
    ): Promise<ArticleCreationContext> => {
      const finalArticleData = articleData ?? createRandomNewArticle(10, 60);
      const articlePage = await addArticleView.createNewArticle(articleData);
      return { articlePage, articleData: finalArticleData };
    };

    await use(create);
  },
});
