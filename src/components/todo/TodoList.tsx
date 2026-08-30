import TodoListItem from '@/src/components/todo/TodoListItem';
import EmptyState from '@/src/components/ui/EmptyState';
import Spinner from '@/src/components/ui/Spinner';
import type { ITodo } from '@/src/types/todo/todo';

interface IProps {
	todos: ITodo[];
	isLoading: boolean;
	errorMessage?: string;
}

/** 로딩 / 빈 데이터 / 목록 세 가지 상태를 렌더링한다 */
const TodoList = ({ todos, isLoading, errorMessage }: IProps) => {
	if (isLoading) {
		return (
			<div className='flex items-center justify-center gap-2 py-16 text-sm text-slate-500'>
				<Spinner />
				불러오는 중…
			</div>
		);
	}

	if (errorMessage) {
		return <EmptyState title='목록을 불러오지 못했습니다.' description={errorMessage} />;
	}

	if (todos.length === 0) {
		return (
			<EmptyState
				title='조건에 맞는 항목이 없습니다.'
				description='검색어나 상태 필터를 변경해 보세요.'
			/>
		);
	}

	return (
		<ul className='flex flex-col gap-2'>
			{todos.map(todo => (
				<TodoListItem key={todo.id} todo={todo} />
			))}
		</ul>
	);
};

export default TodoList;
