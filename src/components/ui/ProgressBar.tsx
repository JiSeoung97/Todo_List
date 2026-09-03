import { cn } from '@/src/utils/cn';

interface IProps {
	/** 진행률 0~100 */
	value: number;
	/** 바의 폭 등 바깥에서 조정할 클래스 */
	className?: string;
	label?: string;
}

/** 진행률 바 — 접근성 속성을 이곳에서 한 번만 정의한다 */
const ProgressBar = ({ value, className, label = '진행률' }: IProps) => (
	<div
		role='progressbar'
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={label}
		className={cn('h-1.5 overflow-hidden rounded-full bg-slate-100', className)}
	>
		<div
			className='h-full rounded-full bg-slate-900 transition-[width]'
			style={{ width: `${value}%` }}
		/>
	</div>
);

export default ProgressBar;
