import { createArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  const articleDataFinal = articleData || createArticlePayload();
  const responseArticle = await request.post(apiUrls.articlesUrl, {
    headers,
    data: articleDataFinal,
  });
  const responseArticleJson = await responseArticle.json();

  await expect(async () => {
    const responseArticleCreated = await request.get(
      `${apiUrls.articlesUrl}/${responseArticleJson.id}`,
    );
    expect(
      responseArticleCreated.status(),
      `Expected status: 200, actual status: ${responseArticleCreated.status()}`,
    ).toBe(200);
  }).toPass({ timeout: 2_000 });

  return responseArticle;
}
