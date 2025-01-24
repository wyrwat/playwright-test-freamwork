import { createCommentPayload } from '@_src/api/factories/comment-payload.ap.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function prepareAndCreateCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleId: number,
): Promise<APIResponse> {
  const commentData = createCommentPayload(articleId);
  return await createCommentWithApi(request, headers, commentData);
}

export async function createCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  commentData: CommentPayload,
): Promise<APIResponse> {
  const responseComments = await request.post(apiUrls.commentsUrl, {
    headers,
    data: commentData,
  });

  const rerponseJson = await responseComments.json();
  const commentId = rerponseJson.id;

  await expect(async () => {
    const responseCommentsCreated = await request.get(
      `${apiUrls.commentsUrl}/${commentId}`,
    );

    expect(
      responseCommentsCreated.status(),
      `Expected status: 200, actual status: ${responseCommentsCreated.status()}`,
    ).toBe(200);
  }).toPass({ timeout: 2_000 });

  return responseComments;
}
