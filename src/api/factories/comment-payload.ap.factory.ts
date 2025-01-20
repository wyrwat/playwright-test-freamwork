import { CommentPayload } from '@_src/api/models/comment-payload.api.models';
import createRandomComment from '@_src/ui/factories/comment.factory';

export function createCommentPayload(articleId: number): CommentPayload {
  const currentDate = new Date().toISOString();
  const randomArticledata = createRandomComment(1);
  const commentData = {
    article_id: articleId,
    body: randomArticledata.body,
    date: currentDate,
  };

  return commentData;
}
