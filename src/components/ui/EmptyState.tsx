interface IProps {
	title: string;
	description?: string;
}

/** 빈 데이터 상태 UI */
const EmptyState = ({ title, description }: IProps) => (
	<div className='flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center'>
		<p className='text-sm font-medium text-slate-700'>{title}</p>
		{description && <p className='text-xs text-slate-500'>{description}</p>}
	</div>
);

export default EmptyState;
