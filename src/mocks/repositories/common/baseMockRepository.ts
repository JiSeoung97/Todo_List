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

	/**
	 * 항목을 추가하고 그대로 돌려준다 (핸들러가 201 응답 본문으로 쓴다).
	 * id 채번처럼 리소스마다 다른 규칙은 서브클래스가 미리 채워서 넘긴다.
	 */
	protected create = (item: T): T => {
		this.items.push(item);
		return item;
	};

	/** 찾아서 patch 를 병합하고 돌려준다 — 없으면 null (핸들러가 404 로 변환) */
	protected update = (id: string, patch: Partial<T>): T | null => {
		const index = this.items.findIndex(item => this.getId(item) === id);
		if (index === -1) return null;

		const updated = { ...this.items[index], ...patch };
		this.items[index] = updated;
		return updated;
	};

	/** 찾아서 제거한다 — 없었으면 false (핸들러가 404 로 변환) */
	protected remove = (id: string): boolean => {
		const index = this.items.findIndex(item => this.getId(item) === id);
		if (index === -1) return false;

		this.items.splice(index, 1);
		return true;
	};

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
