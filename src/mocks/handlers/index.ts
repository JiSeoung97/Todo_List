import { createAuthHandlers } from "@/src/mocks/handlers/authHandlers";
import { createTodoHandlers } from "@/src/mocks/handlers/todoHandlers";
import AuthMockRepository from "@/src/mocks/repositories/auth/authMockRepository";
import TodoMockRepository from "@/src/mocks/repositories/todo/todoMockRepository";
import type { HttpHandler } from "msw";

/* mock repository 인스턴스는 이곳에서 한 번만 생성해 핸들러 간에 공유한다 */
const authMockRepository = new AuthMockRepository();
const todoMockRepository = new TodoMockRepository();

/** 전체 핸들러 집합 — setupWorker(...handlers) 에 그대로 전달된다 */
export const handlers: HttpHandler[] = [
  ...createAuthHandlers(authMockRepository),
  ...createTodoHandlers(todoMockRepository, authMockRepository),
];
