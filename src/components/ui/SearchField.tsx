import { cn } from '@/src/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
	/** 값이 있을 때 노출되는 지우기 버튼 — 없으면 버튼을 렌더링하지 않는다 */
	onClear?: () => void;
}

/** 돋보기 아이콘 + 지우기 버튼을 갖춘 검색 전용 입력창 */
const SearchField = ({ className, onClear, value, ...props }: IProps) => (
	<div className={cn('relative flex-1', className)}>
		<svg
			aria-hidden
			viewBox='0 0 20 20'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.8}
			strokeLinecap='round'
			className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400'
		>
			<circle cx='9' cy='9' r='6' />
			<path d='m13.5 13.5 3 3' />
		</svg>

		<input
			type='search'
			value={value}
			className={cn(
				'w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 text-sm outline-none',
				'transition-colors placeholder:text-slate-400',
				'hover:border-slate-400',
				'focus:border-slate-900 focus:ring-1 focus:ring-slate-900',
				// 지우기 버튼 자리를 비워둔다
				onClear ? 'pr-9' : 'pr-3',
				// 브라우저 기본 지우기 버튼은 숨기고 커스텀 버튼만 노출
				'[&::-webkit-search-cancel-button]:appearance-none',
			)}
			{...props}
		/>

		{onClear && value && (
			<button
				type='button'
				onClick={onClear}
				aria-label='검색어 지우기'
				className={cn(
					'absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center',
					'rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600',
				)}
			>
				<svg
					aria-hidden
					viewBox='0 0 20 20'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					className='size-3'
				>
					<path d='M5 5l10 10M15 5L5 15' />
				</svg>
			</button>
		)}
	</div>
);

export default SearchField;
