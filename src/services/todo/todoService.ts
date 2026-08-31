import type TodoRepository from "@/src/repositories/todo/todoRepository";
import BaseService from "@/src/services/common/baseService";
import type { ITodoListQuery } from "@/src/types/todo/todo";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/**
 * TODO 서비스 — useQuery 훅을 반환한다.
 * 페이지 이동 시 화면이 깜빡이지 않도록 keepPreviousData 를 사용.
 */
export default class TodoService extends BaseService {
  constructor(private readonly todoRepository: TodoRepository) {
    super("todos");
  }

  public useGetTodoList = (query: ITodoListQuery) =>
    useQuery({
      queryKey: this.keyOf("list", query),
      queryFn: () => this.todoRepository.getTodoList(query),
      placeholderData: keepPreviousData,
    });

  public useGetTodo = (id: string | undefined) =>
    useQuery({
      queryKey: this.keyOf("detail", id),
      queryFn: () => this.todoRepository.getTodo(id!),
      enabled: Boolean(id),
    });
}
