import { cn } from '@/src/utils/cn';
import type { ReactNode } from 'react';

interface IProps {
	/** 왼쪽 — 제목·설명 등 가변 폭 영역 */
	children: ReactNode;
	/** 오른쪽 — 지표·날짜 등 고정 폭 영역 */
	aside?: ReactNode;
	/** 카드 클릭 동작 — 이동 여부는 사용처가 정한다 */
	onClick?: () => void;
	className?: string;
}

/** 목록 카드 한 장 — 좌/우 두 영역의 배치만 담당한다 */
const ListItem = ({ children, aside, onClick, className }: IProps) => (
	<div
		onClick={onClick}
		className={cn(
			'flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4',
			'sm:flex-row sm:items-center sm:justify-between',
			onClick && 'cursor-pointer transition-shadow hover:shadow-sm',
			className,
		)}
	>
		<div className='flex min-w-0 flex-col gap-1'>{children}</div>
		{aside && <div className='flex shrink-0 items-center gap-6'>{aside}</div>}
	</div>
);

export default ListItem;
