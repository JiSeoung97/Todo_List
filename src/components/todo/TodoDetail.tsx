import Badge from '@/src/components/ui/Badge';
import ListDetail from '@/src/components/ui/list/ListDetail';
import ListDetailRow from '@/src/components/ui/list/ListDetailRow';
import ProgressBar from '@/src/components/ui/ProgressBar';
import {
	TODO_PRIORITIES,
	TODO_PRIORITY_TONES,
	TODO_STATUS_TONES,
	TODO_STATUSES,
} from '@/src/consts/common/todo';
import type { ITodo } from '@/src/types/todo/todo';
import { cn } from '@/src/utils/cn';
import { formatDate, isOverdue } from '@/src/utils/date';

interface IProps {
	todo?: ITodo;
	isLoading: boolean;
	errorMessage?: string;
}

/** 상세 카드에 담을 TODO 고유 정보 — 카드의 뼈대와 상태 분기는 ui/detail/Detail 이 갖는다 */
const TodoDetail = ({ todo, isLoading, errorMessage }: IProps) => (
	<ListDetail
		data={todo}
		isLoading={isLoading}
		errorMessage={errorMessage}
		notFoundDescription='목록으로 돌아가 다시 선택해 주세요.'
		header={todo => (
			<>
				<Badge tone={TODO_STATUS_TONES[todo.status]}>{TODO_STATUSES[todo.status]}</Badge>
				<Badge tone={TODO_PRIORITY_TONES[todo.priority]} variant='text'>
					{TODO_PRIORITIES[todo.priority]}
				</Badge>
			</>
		)}
		title={todo => todo.title}
	>
		{todo => {
			// 마감일이 지났고 아직 완료되지 않은 건 강조한다 (목록과 동일한 규칙)
			const overdue = isOverdue(todo.dueDate) && todo.status !== 'DONE';

			return (
				<>
					<ListDetailRow label='담당자'>{todo.assignee}</ListDetailRow>

					<ListDetailRow label='진행률'>
						<div className='flex items-center justify-end gap-3'>
							<ProgressBar value={todo.progress} className='w-32' />
							<span className='w-10 text-right'>{todo.progress}%</span>
						</div>
					</ListDetailRow>

					<ListDetailRow label='마감일'>
						<span className={cn(overdue && 'text-red-600')}>
							{formatDate(todo.dueDate)}
							{overdue && ' (기한 초과)'}
						</span>
					</ListDetailRow>

					<ListDetailRow label='등록일'>{formatDate(todo.createdAt)}</ListDetailRow>
				</>
			);
		}}
	</ListDetail>
);

export default TodoDetail;
