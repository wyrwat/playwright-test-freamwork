import { CommentPayload } from '@_src/api/utils/api.util';
import createRandomComment from '@_src/ui/factories/comment.factory';

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
