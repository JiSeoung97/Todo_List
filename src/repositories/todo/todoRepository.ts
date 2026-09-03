import type HttpClient from '@/src/networks/httpClient';
import BaseRepository from '@/src/repositories/common/baseRepository';
import type { IPaginatedResponse } from '@/src/types/common/repository';
import type { ITodo, ITodoListQuery } from '@/src/types/todo/todo';

/**
 * TODO 리포지토리 — RESTful 엔드포인트만 감싼다.
 * 검색/필터/페이징 조건은 쿼리스트링(params)으로 전달하며, 계산은 서버(MSW)가 수행한다.
 */
export default class TodoRepository extends BaseRepository {
	constructor(httpClient: HttpClient) {
		super(httpClient, '/todos');
	}

	/** GET /todos?page=&size=&keyword=&status= */
	public getTodoList = (query: ITodoListQuery): Promise<IPaginatedResponse<ITodo>> =>
		this.httpClient.get<IPaginatedResponse<ITodo>>(this.path, {
			params: query,
		});

	/** GET /todos/:id */
	public getTodo = (id: string): Promise<ITodo> => this.httpClient.get<ITodo>(this.url(id));
}
