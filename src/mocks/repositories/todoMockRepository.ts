import {
	DEFAULT_PAGE_SIZE,
	TODO_PRIORITY_CODES,
	TODO_STATUS_CODES,
} from '@/src/consts/common/todo';
import BaseMockRepository from '@/src/mocks/repositories/common/baseMockRepository';
import type {
	ITodo,
	ITodoListQuery,
	TTodoCreateRequest,
	TTodoUpdateRequest,
} from '@/src/types/todo/todo';
import { faker } from '@faker-js/faker';

/** 재실행 시에도 같은 목데이터가 나오도록 시드 고정 */
faker.seed(20260826);

const TASK_VERBS = ['설계', '구현', '리팩터링', '테스트 작성', '문서화', '배포', '검토'];
const TASK_TARGETS = [
	'로그인 화면',
	'목록 페이지네이션',
	'MSW 핸들러',
	'TanStack Query 캐시',
	'HttpClient 인터셉터',
	'zustand 스토어',
	'폼 유효성 검사',
	'다크 모드',
];

/**
 * TODO mock 데이터 소유 모듈.
 * MSW 핸들러는 이 리포지토리의 메서드만 호출하고, 데이터 가공은 전부 여기서 한다.
 */
export default class TodoMockRepository extends BaseMockRepository<ITodo> {
	constructor() {
		super();
		// 요구사항: 30건 이상
		this.seed(53, index => this.createItem(index));
	}

	protected override getId = (item: ITodo): string => item.id;

	private createItem(index: number): ITodo {
		const status = faker.helpers.arrayElement(TODO_STATUS_CODES);

		return {
			id: `TODO-${String(index + 1).padStart(3, '0')}`,
			title: `${faker.helpers.arrayElement(
				TASK_TARGETS,
			)} ${faker.helpers.arrayElement(TASK_VERBS)}`,
			assignee: faker.person.fullName(),
			status,
			priority: faker.helpers.arrayElement(TODO_PRIORITY_CODES),
			// 완료 건은 100%, 대기 건은 0% 로 맞춰 데이터의 앞뒤를 맞춘다
			progress:
				status === 'DONE'
					? 100
					: status === 'TODO'
						? 0
						: faker.number.int({ min: 5, max: 95 }),
			dueDate: faker.date
				.between({
					from: '2026-08-01T00:00:00.000Z',
					to: '2026-12-31T00:00:00.000Z',
				})
				.toISOString(),
			createdAt: faker.date
				.between({
					from: '2026-05-01T00:00:00.000Z',
					to: '2026-08-20T00:00:00.000Z',
				})
				.toISOString(),
		};
	}

	/**
	 * 검색(keyword) → 필터(status) → 페이징 순으로 적용.
	 * 실제 API 가 하는 일을 그대로 흉내낸다.
	 */
	public getList = (query: ITodoListQuery) => {
		const { keyword, status, page = 1, size = DEFAULT_PAGE_SIZE } = query;

		const filtered = this.items.filter(todo => {
			if (status && todo.status !== status) return false;
			if (!keyword?.trim()) return true;

			const target = keyword.trim();
			return (
				this.includesKeyword(todo.title, target) ||
				this.includesKeyword(todo.assignee, target) ||
				this.includesKeyword(todo.id, target)
			);
		});

		// 마감일 오름차순 — 급한 일이 위로
		const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

		return this.paginate(sorted, page, size);
	};

	/**
	 * 다음 id 를 채번한다 — 기존 번호의 최댓값 + 1.
	 * items.length 로 세면 중간을 삭제했을 때 기존 id 와 충돌한다.
	 */
	private nextId = (): string =>
		`TODO-${String(Math.max(0, ...this.items.map(todo => Number(todo.id.split('-')[1]))) + 1).padStart(3, '0')}`;

	/** id 와 등록일은 서버가 정한다 */
	public createTodo = (body: TTodoCreateRequest): ITodo =>
		this.create({
			...body,
			id: this.nextId(),
			createdAt: new Date().toISOString(),
		});

	/** PATCH — 부분 병합 */
	public updateTodo = (id: string, patch: TTodoUpdateRequest) => this.update(id, patch);

	/** DELETE */
	public removeTodo = (id: string) => this.remove(id);
}
