import Button from '@/src/components/ui/Button';
import Spinner from '@/src/components/ui/Spinner';
import TextField from '@/src/components/ui/TextField';
import type { ILoginRequest } from '@/src/types/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/** 클라이언트 유효성 검사 규칙 */
const loginSchema = z.object({
	username: z
		.string()
		.min(1, '아이디를 입력해 주세요.')
		.min(3, '아이디는 3자 이상이어야 합니다.'),
	password: z
		.string()
		.min(1, '비밀번호를 입력해 주세요.')
		.min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type TLoginForm = z.infer<typeof loginSchema>;

interface IProps {
	onSubmit: (values: ILoginRequest) => void;
	isPending: boolean;
	/** 서버(MSW)가 돌려준 로그인 실패 메시지 */
	errorMessage?: string;
}

const LoginForm = ({ onSubmit, isPending, errorMessage }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TLoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { username: '', password: '' },
	});

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)} noValidate>
			<TextField
				id='username'
				label='아이디'
				autoComplete='username'
				placeholder='admin'
				errorMessage={errors.username?.message}
				{...register('username')}
			/>

			<TextField
				id='password'
				label='비밀번호'
				type='password'
				autoComplete='current-password'
				placeholder='••••••••'
				errorMessage={errors.password?.message}
				{...register('password')}
			/>

			{/* 서버 실패 응답(401 등) 메시지 */}
			{errorMessage && (
				<p role='alert' className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
					{errorMessage}
				</p>
			)}

			<Button
				type='submit'
				disabled={isPending}
				className='mt-2 flex items-center justify-center gap-2'
			>
				{isPending && <Spinner className='size-4 border-white/40 border-t-white' />}
				로그인
			</Button>
		</form>
	);
};

export default LoginForm;
