import { createCommentPayload } from '@_src/api/factories/comment-payload.ap.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.models';
import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function createCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleId: number,
  commentData?: CommentPayload,
): Promise<APIResponse> {
  const commentsDataFinal = commentData || createCommentPayload(articleId);
  const responseComments = await request.post(apiUrls.commentsUrl, {
    headers,
    data: commentsDataFinal,
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
