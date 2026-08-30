import Button from '@/src/components/ui/Button';
import { cn } from '@/src/utils/cn';

interface IProps {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
}

/** 현재 페이지 주변 최대 5개의 번호만 노출한다 */
const buildPageNumbers = (page: number, totalPages: number): number[] => {
	const size = Math.min(5, totalPages);
	const start = Math.min(Math.max(1, page - 2), Math.max(1, totalPages - size + 1));

	return Array.from({ length: size }, (_, index) => start + index);
};

const Pagination = ({ page, totalPages, onChange }: IProps) => {
	if (totalPages <= 1) return null;

	return (
		<nav className='flex items-center justify-center gap-1' aria-label='페이지네이션'>
			<Button variant='ghost' disabled={page <= 1} onClick={() => onChange(page - 1)}>
				이전
			</Button>

			{buildPageNumbers(page, totalPages).map(number => (
				<button
					key={number}
					aria-current={number === page ? 'page' : undefined}
					onClick={() => onChange(number)}
					className={cn(
						'size-9 rounded-lg text-sm transition-colors',
						number === page
							? 'bg-slate-900 font-semibold text-white'
							: 'text-slate-600 hover:bg-slate-100',
					)}
				>
					{number}
				</button>
			))}

			<Button variant='ghost' disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
				다음
			</Button>
		</nav>
	);
};

export default Pagination;
