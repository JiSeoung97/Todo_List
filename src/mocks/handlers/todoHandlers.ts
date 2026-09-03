import { ENV_API_BASE_URL } from '@/src/consts/common/envKeys';
import type { TTodoStatus } from '@/src/consts/common/todo';
import type AuthMockRepository from '@/src/mocks/repositories/auth/authMockRepository';
import type TodoMockRepository from '@/src/mocks/repositories/todo/todoMockRepository';
import { delay, http, HttpResponse, type HttpHandler } from 'msw';

const extractToken = (request: Request): string | null =>
	request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? null;

const unauthorized = () =>
	HttpResponse.json({ message: '인증이 필요합니다.', code: 'UNAUTHORIZED' }, { status: 401 });

export const createTodoHandlers = (
	todoRepository: TodoMockRepository,
	authRepository: AuthMockRepository,
): HttpHandler[] => [
	/** GET /todos — 검색/필터/페이징을 mock repository 에 위임 */
	http.get(`${ENV_API_BASE_URL}/todos`, async ({ request }) => {
		if (!authRepository.findByToken(extractToken(request))) return unauthorized();

		await delay(400);

		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page') ?? 1);
		const size = Number(url.searchParams.get('size') ?? 10);
		const keyword = url.searchParams.get('keyword') ?? undefined;
		const status = (url.searchParams.get('status') as TTodoStatus | null) ?? undefined;

		const result = todoRepository.getList({ page, size, keyword, status });

		return HttpResponse.json(result, { status: 200 });
	}),

	/** GET /todos/:id */
	http.get(`${ENV_API_BASE_URL}/todos/:id`, async ({ request, params }) => {
		if (!authRepository.findByToken(extractToken(request))) return unauthorized();

		await delay(200);

		const todo = todoRepository.findById(String(params.id));

		if (!todo) {
			return HttpResponse.json(
				{ message: '해당 항목을 찾을 수 없습니다.', code: 'NOT_FOUND' },
				{ status: 404 },
			);
		}

		return HttpResponse.json(todo, { status: 200 });
	}),
];
