import { ENV_API_BASE_URL } from "@/src/consts/common/envKeys";
import type AuthMockRepository from "@/src/mocks/repositories/auth/authMockRepository";
import type { ILoginRequest } from "@/src/types/auth/auth";
import { delay, http, HttpResponse, type HttpHandler } from "msw";

export const createAuthHandlers = (
  repository: AuthMockRepository
): HttpHandler[] => [
  /** POST /auth/login — 계정에 따라 성공/실패를 분기 */
  http.post(`${ENV_API_BASE_URL}/auth/login`, async ({ request }) => {
    await delay(1000);

    const body = (await request.json()) as ILoginRequest;
    const result = repository.login(body);

    if (!result) {
      return HttpResponse.json(
        {
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    return HttpResponse.json(result, { status: 200 });
  }),
];
