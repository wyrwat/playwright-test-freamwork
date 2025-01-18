import createRandomNewArticle from '@_src/ui/factories/article.factory';

export function createArticlePayload(): ArticlePayload {
  const currentDate = new Date();
  const randomArticledata = createRandomNewArticle();
  const articleData = {
    title: randomArticledata.title,
    body: randomArticledata.body,
    date: currentDate,
    image:
      '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
  };

  return articleData;
}
export interface ArticlePayload {
  title: string;
  body: string;
  date: Date;
  image: string;
}
