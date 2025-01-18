import { ArticlePayload, CommentPayload } from '@_src/api/utils/api.util';
import createRandomNewArticle from '@_src/ui/factories/article.factory';
import createRandomComment from '@_src/ui/factories/comment.factory';

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

export function createCommentPayload(articleId: number): CommentPayload {
  const currentDate = new Date();
  const randomArticledata = createRandomComment(1);
  const commentData = {
    article_id: articleId,
    body: randomArticledata.body,
    date: currentDate,
  };

  return commentData;
}
