import createRandomNewArticle from '@_src/factories/article.factory';
import createRandomComment from '@_src/factories/comment.factory';
import { testUser1 } from '@_src/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

interface Headers {
  [key: string]: string;
}

interface ArticlePayload {
  title: string;
  body: string;
  date: Date;
  image: string;
}

interface CommentPayload {
  article_id: number;
  body: string;
  date: Date;
}

export async function getAuthHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginUrl = '/api/login';
  const loginData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const responseLogin = await request.post(loginUrl, { data: loginData });
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}

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
