import { cn } from '@/src/utils/cn';
import type { InputHTMLAttributes, Ref } from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	/** react-hook-form 의 register 가 넘겨주는 ref */
	ref?: Ref<HTMLInputElement>;
	errorMessage?: string;
}

const TextField = ({ label, errorMessage, className, id, ...props }: IProps) => (
	<div className='flex flex-col gap-1.5'>
		{label && (
			<label htmlFor={id} className='text-sm font-medium text-slate-700'>
				{label}
			</label>
		)}
		<input
			id={id}
			aria-invalid={Boolean(errorMessage)}
			className={cn(
				'rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
				'focus:border-slate-900 focus:ring-1 focus:ring-slate-900',
				errorMessage ? 'border-red-400' : 'border-slate-300',
				className,
			)}
			{...props}
		/>
		{errorMessage && <p className='text-xs text-red-600'>{errorMessage}</p>}
	</div>
);

export default TextField;
