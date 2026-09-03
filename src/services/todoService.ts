import { queryClient } from '@/src/contexts/QueryProvider';
import type TodoRepository from '@/src/repositories/todoRepository';
import BaseService from '@/src/services/common/baseService';
import type { ITodoListQuery, TTodoCreateRequest, TTodoUpdateRequest } from '@/src/types/todo/todo';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

/**
 * TODO 서비스 — useQuery / useMutation 훅을 반환한다.
 * 페이지 이동 시 화면이 깜빡이지 않도록 keepPreviousData 를 사용.
 */
export default class TodoService extends BaseService {
	constructor(private readonly todoRepository: TodoRepository) {
		super('todos');
	}

	public useGetTodoList = (query: ITodoListQuery) =>
		useQuery({
			queryKey: this.keyOf('list', query),
			queryFn: () => this.todoRepository.getTodoList(query),
			placeholderData: keepPreviousData,
		});

	public useGetTodo = (id: string | undefined) =>
		useQuery({
			queryKey: this.keyOf('detail', id),
			queryFn: () => this.todoRepository.getTodo(id!),
			enabled: Boolean(id),
		});

	/**
	 * 생성 — 성공 시 todos 로 시작하는 캐시를 모두 무효화한다.
	 * 목록은 페이지·검색조건별로 캐시가 나뉘어 있고 정렬·페이징도 서버가 하므로,
	 * 캐시를 직접 조작하지 않고 재조회에 맡긴다.
	 */
	public useCreateTodo = () =>
		useMutation({
			mutationKey: this.keyOf('create'),
			mutationFn: (body: TTodoCreateRequest) => this.todoRepository.createTodo(body),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: this.keyOf() }),
		});

	/** 수정 — mutationFn 은 인자를 하나만 받으므로 id 와 patch 를 객체로 묶는다 */
	public useUpdateTodo = () =>
		useMutation({
			mutationKey: this.keyOf('update'),
			mutationFn: ({ id, patch }: { id: string; patch: TTodoUpdateRequest }) =>
				this.todoRepository.updateTodo(id, patch),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: this.keyOf() }),
		});

	/** 삭제 — 목록과 상세 캐시를 함께 무효화한다 */
	public useDeleteTodo = () =>
		useMutation({
			mutationKey: this.keyOf('delete'),
			mutationFn: (id: string) => this.todoRepository.deleteTodo(id),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: this.keyOf() }),
		});
}
