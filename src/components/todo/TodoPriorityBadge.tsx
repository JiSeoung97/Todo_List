import { TODO_PRIORITIES, type TTodoPriority } from '@/src/consts/common/todo';
import { cn } from '@/src/utils/cn';

const PRIORITY_STYLES: Record<TTodoPriority, string> = {
	LOW: 'text-slate-500',
	MEDIUM: 'text-slate-700',
	HIGH: 'text-orange-600',
	URGENT: 'text-red-600',
};

const TodoPriorityBadge = ({ priority }: { priority: TTodoPriority }) => (
	<span className={cn('text-xs font-semibold whitespace-nowrap', PRIORITY_STYLES[priority])}>
		{TODO_PRIORITIES[priority]}
	</span>
);

export default TodoPriorityBadge;
