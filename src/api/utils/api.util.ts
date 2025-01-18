import { testUser1 } from '@_src/ui/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export interface Headers {
  [key: string]: string;
}

export interface ArticlePayload {
  title: string;
  body: string;
  date: Date;
  image: string;
}

export interface CommentPayload {
  article_id: number;
  body: string;
  date: Date;
}
export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl: '/api/login',
};

export async function getAuthHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const responseLogin = await request.post(apiLinks.loginUrl, {
    data: loginData,
  });
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}
