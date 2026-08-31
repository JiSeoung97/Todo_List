import type { IErrorResponse } from "@/src/types/common/repository";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

/**
 * HttpClient — 최하위 레이어.
 * RESTful 메서드(get/post/patch/delete)만 노출하고, 도메인 지식은 갖지 않는다.
 * 실제 네트워크는 나가지 않고 전부 MSW 가 가로챈다.
 */
export default class HttpClient {
  private readonly axios: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) throw new Error("VITE_API_BASE_URL 은 필수입니다.");

    this.axios = axios.create({
      baseURL: baseURL.replace(/\/$/, ""),
      timeout: 30_000,
      headers: { "Content-Type": "application/json" },
    });

    this.loadInterceptors();
  }

  /** 요청 시 토큰 주입 / 응답 에러 메시지 정규화 */
  private loadInterceptors = () => {
    this.axios.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError<IErrorResponse>) => {
        const message =
          error.response?.data?.message ??
          error.message ??
          "알 수 없는 오류가 발생했습니다.";
        if (
          error.response?.status === 401 &&
          !error.config?.url?.includes("/auth/login")
        ) {
          this.onUnauthorized();
        }
        return Promise.reject(new HttpError(message, error.response?.status));
      }
    );
  };

  /**
   * 토큰 조회는 store 를 직접 import 하지 않고 주입받는다.
   * (networks → stores 역방향 의존을 만들지 않기 위함)
   */
  private getToken: () => string | null = () => null;
  private onUnauthorized: () => void = () => null;

  public setTokenGetter = (getter: () => string | null) => {
    this.getToken = getter;
  };

  public setUnauthorizedHandler = (handler: () => void) => {
    this.onUnauthorized = handler;
  };

  public get = async <U>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<U> => {
    const { data } = await this.axios.get<U>(url, config);
    return data;
  };

  public post = async <T, U>(
    url: string,
    body?: T,
    config?: AxiosRequestConfig
  ): Promise<U> => {
    const { data } = await this.axios.post<U, { data: U }, T>(
      url,
      body,
      config
    );
    return data;
  };
}

/** 상태 코드를 보존하는 에러 — 화면에서 401 등을 구분해 처리할 수 있게 한다 */
export class HttpError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "HttpError";
  }
}
