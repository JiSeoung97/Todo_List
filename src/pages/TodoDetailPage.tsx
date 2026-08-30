import TodoPriorityBadge from '@/src/components/todo/TodoPriorityBadge';
import TodoStatusBadge from '@/src/components/todo/TodoStatusBadge';
import Button from '@/src/components/ui/Button';
import EmptyState from '@/src/components/ui/EmptyState';
import Spinner from '@/src/components/ui/Spinner';
import { useServices } from '@/src/contexts/ServiceProvider';
import { cn } from '@/src/utils/cn';
import { formatDate, isOverdue } from '@/src/utils/date';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

/** 상세 항목 한 줄 — 라벨과 값을 같은 간격으로 나열한다 */
const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className='flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0'>
		<span className='shrink-0 text-sm text-slate-500'>{label}</span>
		<div className='min-w-0 text-right text-sm font-medium text-slate-900'>{children}</div>
	</div>
);

/**
 * 상세 페이지 — URL 의 id 를 service 훅에 넘기는 것이 전부다.
 * 데이터 fetch 는 todoService(useGetTodo) 의 책임이며,
 * Service/Repository/HttpClient/MSW 는 목록 화면과 그대로 공유한다.
 */
const TodoDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { todoService } = useServices();

	const { data: todo, isLoading, error } = todoService.useGetTodo(id);

	const goToList = () => void navigate('/todos');

	// 마감일이 지났고 아직 완료되지 않은 건 강조한다 (목록과 동일한 규칙)
	const overdue = Boolean(todo) && isOverdue(todo!.dueDate) && todo!.status !== 'DONE';

	return (
		<main className='min-h-full bg-slate-50'>
			<div className='mx-auto flex max-w-2xl flex-col gap-4 p-6'>
				<header className='flex items-center justify-between'>
					<div>
						<h1 className='text-xl font-semibold text-slate-900'>TODO 상세</h1>
						<p className='mt-1 font-mono text-sm text-slate-500'>{id}</p>
					</div>

					<Button variant='ghost' onClick={goToList}>
						목록으로
					</Button>
				</header>

				{isLoading && (
					<div className='flex items-center justify-center gap-2 py-16 text-sm text-slate-500'>
						<Spinner />
						불러오는 중…
					</div>
				)}

				{/* 404(없는 id) 와 401 등 모든 실패를 한 곳에서 처리한다 */}
				{!isLoading && error && (
					<EmptyState title='항목을 불러오지 못했습니다.' description={error.message} />
				)}

				{!isLoading && !error && !todo && (
					<EmptyState
						title='항목을 찾을 수 없습니다.'
						description='목록으로 돌아가 다시 선택해 주세요.'
					/>
				)}

				{todo && (
					<section className='rounded-xl border border-slate-200 bg-white p-6'>
						<div className='flex flex-wrap items-center gap-2'>
							<TodoStatusBadge status={todo.status} />
							<TodoPriorityBadge priority={todo.priority} />
						</div>

						<h2 className='mt-3 text-lg font-semibold break-keep text-slate-900'>
							{todo.title}
						</h2>

						<div className='mt-4 flex flex-col'>
							<DetailRow label='담당자'>{todo.assignee}</DetailRow>

							<DetailRow label='진행률'>
								<div className='flex items-center justify-end gap-3'>
									<div className='h-1.5 w-32 overflow-hidden rounded-full bg-slate-100'>
										<div
											className='h-full rounded-full bg-slate-900'
											style={{ width: `${todo.progress}%` }}
										/>
									</div>
									<span className='w-10 text-right'>{todo.progress}%</span>
								</div>
							</DetailRow>

							<DetailRow label='마감일'>
								<span className={cn(overdue && 'text-red-600')}>
									{formatDate(todo.dueDate)}
									{overdue && ' (기한 초과)'}
								</span>
							</DetailRow>

							<DetailRow label='등록일'>{formatDate(todo.createdAt)}</DetailRow>
						</div>
					</section>
				)}
			</div>
		</main>
	);
};

export default TodoDetailPage;
