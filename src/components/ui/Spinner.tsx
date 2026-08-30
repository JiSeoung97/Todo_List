import { cn } from '@/src/utils/cn';

const Spinner = ({ className }: { className?: string }) => (
	<span
		role='status'
		aria-label='로딩 중'
		className={cn(
			'inline-block size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900',
			className,
		)}
	/>
);

export default Spinner;
