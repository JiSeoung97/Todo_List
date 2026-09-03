import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 조건부 className 조합(clsx) + Tailwind 클래스 충돌 해소(twMerge).
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
