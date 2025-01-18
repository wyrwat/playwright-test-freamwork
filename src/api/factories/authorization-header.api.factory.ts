import { Headers } from '@_src/api/models/headers.api.models';
import { apiUrls } from '@_src/api/utils/api.util';
import { testUser1 } from '@_src/ui/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const responseLogin = await request.post(apiUrls.loginUrl, {
    data: loginData,
  });
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}
