/**
 * BaseMockRepository — mock 데이터의 소유자.
 * 컴포넌트나 핸들러가 아니라 이 모듈이 데이터를 들고 있으며,
 * 검색/필터/페이징 같은 "서버가 할 일"도 여기서 수행한다.
 */
export default abstract class BaseMockRepository<T> {
	protected items: T[] = [];

	protected abstract getId(item: T): string;

	/** count 건의 목데이터를 생성해 보관한다 */
	protected seed(count: number, factory: (index: number) => T): void {
		this.items = Array.from({ length: count }, (_, index) => factory(index));
	}

	public findById = (id: string): T | undefined =>
		this.items.find(item => this.getId(item) === id);

	/** 필터링된 행을 페이지 단위로 잘라 반환 */
	protected paginate = (rows: T[], page: number, size: number) => {
		const totalCount = rows.length;
		const totalPages = Math.max(1, Math.ceil(totalCount / size));
		const safePage = Math.min(Math.max(1, page), totalPages);
		const start = (safePage - 1) * size;

		return {
			items: rows.slice(start, start + size),
			page: safePage,
			size,
			totalCount,
			totalPages,
		};
	};

	/** 대소문자 무시 부분 일치 */
	protected includesKeyword = (value: string, keyword: string): boolean =>
		value.toLowerCase().includes(keyword.toLowerCase());
}
