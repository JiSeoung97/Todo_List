import type HttpClient from "@/src/networks/httpClient";

/**
 * BaseRepository — 리소스 경로(path)를 보유하고, 하위 경로를 조합해준다.
 * mes_fe 의 BaseRepository 와 같은 역할이되, MES 전용 signature/functionCode 대신
 * RESTful 리소스 경로만 사용한다.
 */
export default abstract class BaseRepository {
  constructor(
    protected readonly httpClient: HttpClient,
    /** 리소스 루트 경로 (e.g. '/todos') */
    protected readonly path: string
  ) {}

  /** '/todos' + 'abc' → '/todos/abc' */
  protected url = (...segments: (string | number)[]): string =>
    [this.path, ...segments].join("/");
}
