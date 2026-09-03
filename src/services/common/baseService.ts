/**
 * BaseService — queryKey 생성 규칙을 한곳에 모은다.
 * 리소스명 + 파라미터 조합으로 키를 만들어, 조건이 바뀌면 자동으로 재조회된다.
 */
export default abstract class BaseService {
	protected constructor(protected readonly resource: string) {}

	protected keyOf = (...rest: unknown[]): unknown[] =>
		[this.resource, ...rest].filter(value => value !== undefined);
}
