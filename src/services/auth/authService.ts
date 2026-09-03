import { queryClient } from '@/src/contexts/QueryProvider';
import type AuthRepository from '@/src/repositories/auth/authRepository';
import BaseService from '@/src/services/common/baseService';
import useAuthStore from '@/src/stores/common/authStore';
import type { ILoginRequest } from '@/src/types/auth/auth';
import { useMutation } from '@tanstack/react-query';

/**
 * 인증 서비스 — useMutation 훅을 반환한다.
 * 컴포넌트는 이 훅만 사용하고 repository 를 직접 호출하지 않는다.
 */
export default class AuthService extends BaseService {
	constructor(private readonly authRepository: AuthRepository) {
		super('auth');
	}

	/** 로그인 — 성공 시 토큰을 Store 에 저장한다 */
	public useLogin = () =>
		useMutation({
			mutationKey: this.keyOf('login'),
			mutationFn: (body: ILoginRequest) => this.authRepository.login(body),
			onSuccess: ({ accessToken, user }) => {
				useAuthStore.getState().setAuth(accessToken, user);
			},
		});

	/** 로그아웃 — 클라이언트 상태와 서버 캐시를 함께 정리 */
	public logout = () => {
		useAuthStore.getState().clearAuth();
		queryClient.clear();
	};
}
