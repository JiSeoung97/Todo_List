import Button from '@/src/components/ui/Button';
import SearchField from '@/src/components/ui/SearchField';
import { TODO_STATUSES, type TTodoStatus } from '@/src/consts/common/todo';
import type { ChangeEvent, FormEvent } from 'react';

interface IProps {
	/** 입력창의 현재 값 (제출 전) */
	keywordInput: string;
	onKeywordInputChange: (value: string) => void;
	onSearch: () => void;
	onReset: () => void;
	status: TTodoStatus | '';
	onStatusChange: (status: TTodoStatus | '') => void;
}

/** 검색(제목/담당자) + 상태 필터 */
const TodoFilterBar = ({
	keywordInput,
	onKeywordInputChange,
	onSearch,
	onReset,
	status,
	onStatusChange,
}: IProps) => {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSearch();
	};

	const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) =>
		onStatusChange(event.target.value as TTodoStatus | '');

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3'
		>
			<SearchField
				value={keywordInput}
				onChange={event => onKeywordInputChange(event.target.value)}
				onClear={() => onKeywordInputChange('')}
				placeholder='제목 · 담당자 · ID 검색'
				aria-label='검색어'
				className='min-w-56'
			/>

			<select
				value={status}
				onChange={handleStatusChange}
				aria-label='상태 필터'
				className='rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900'
			>
				<option value=''>전체 상태</option>
				{Object.entries(TODO_STATUSES).map(([code, label]) => (
					<option key={code} value={code}>
						{label}
					</option>
				))}
			</select>

			<Button type='submit'>검색</Button>
			<Button type='button' variant='ghost' onClick={onReset}>
				초기화
			</Button>
		</form>
	);
};

export default TodoFilterBar;
