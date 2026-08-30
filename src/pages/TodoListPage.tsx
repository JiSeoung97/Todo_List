import TodoFilterBar from '@/src/components/todo/TodoFilterBar';
import TodoList from '@/src/components/todo/TodoList';
import Button from '@/src/components/ui/Button';
import Pagination from '@/src/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, type TTodoStatus } from '@/src/consts/common/todo';
import { useServices } from '@/src/contexts/ServiceProvider';
import useAuthStore from '@/src/stores/common/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * 목록 페이지 — 검색/필터/페이지 상태를 보유하고 service 훅에 전달한다.
 * 데이터 fetch 는 전적으로 todoService(useGetTodoList) 의 책임.
 */
const TodoListPage = () => {
	const navigate = useNavigate();
	const { todoService, authService } = useServices();
	const user = useAuthStore(state => state.user);

	// 입력 중인 검색어와 실제 조회에 쓰이는 검색어를 분리 — 타이핑마다 요청이 나가지 않게 한다
	const [keywordInput, setKeywordInput] = useState('');
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState<TTodoStatus | ''>('');
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = todoService.useGetTodoList({
		page,
		size: DEFAULT_PAGE_SIZE,
		keyword: keyword || undefined,
		status: status || undefined,
	});

	const handleSearch = () => {
		setKeyword(keywordInput);
		setPage(1); // 조건이 바뀌면 1페이지부터
	};

	const handleReset = () => {
		setKeywordInput('');
		setKeyword('');
		setStatus('');
		setPage(1);
	};

	const handleStatusChange = (next: TTodoStatus | '') => {
		setStatus(next);
		setPage(1);
	};

	const handleLogout = () => {
		authService.logout();
		void navigate('/login', { replace: true });
	};

	return (
		<main className='min-h-full bg-slate-50'>
			<div className='mx-auto flex max-w-4xl flex-col gap-4 p-6'>
				<header className='flex items-center justify-between'>
					<div>
						<h1 className='text-xl font-semibold text-slate-900'>TODO 목록</h1>
						<p className='mt-1 text-sm text-slate-500'>
							{user?.name}님 환영합니다 · 전체 {data?.totalCount ?? 0}건
						</p>
					</div>

					<Button variant='ghost' onClick={handleLogout}>
						로그아웃
					</Button>
				</header>

				<TodoFilterBar
					keywordInput={keywordInput}
					onKeywordInputChange={setKeywordInput}
					onSearch={handleSearch}
					onReset={handleReset}
					status={status}
					onStatusChange={handleStatusChange}
				/>

				<TodoList
					todos={data?.items ?? []}
					isLoading={isLoading}
					errorMessage={error?.message}
				/>

				<Pagination
					page={data?.page ?? 1}
					totalPages={data?.totalPages ?? 1}
					onChange={setPage}
				/>
			</div>
		</main>
	);
};

export default TodoListPage;
