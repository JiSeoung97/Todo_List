import { cn } from '@/src/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'ghost';
}

const Button = ({ variant = 'primary', className, ...props }: IProps) => (
	<button
		className={cn(
			'cursor-grab rounded-lg px-4 py-2 text-sm font-medium transition-colors',
			'disabled:cursor-not-allowed disabled:opacity-50',
			variant === 'primary' && 'bg-slate-900 text-white hover:bg-slate-700',
			variant === 'ghost' && 'border border-slate-300 text-slate-700 hover:bg-slate-100',
			className,
		)}
		{...props}
	/>
);

export default Button;
