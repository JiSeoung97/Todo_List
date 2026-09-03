import { ENV_API_BASE_URL } from '@/src/consts/common/envKeys';
import HttpClient from '@/src/networks/httpClient';
import AuthRepository from '@/src/repositories/authRepository';
import TodoRepository from '@/src/repositories/todoRepository';
import AuthService from '@/src/services/authService';
import TodoService from '@/src/services/todoService';
import useAuthStore from '@/src/stores/common/authStore';
import { createContext, use, type ReactNode } from 'react';

/* ───────────────────────────── Composition Root ─────────────────────────────
 * HttpClient → Repository → Service 의존성을 이 파일 한곳에서만 조립한다.
 * 각 레이어는 상위 레이어를 import 하지 않으므로 의존 방향이 한쪽으로 유지된다.
 * ------------------------------------------------------------------------- */
const httpClient = new HttpClient(ENV_API_BASE_URL);

// 토큰은 Store 가 소유하고, HttpClient 는 읽기 함수만 주입받는다.
httpClient.setTokenGetter(() => useAuthStore.getState().accessToken);
httpClient.setUnauthorizedHandler(() => useAuthStore.getState().clearAuth());

const services = {
	authService: new AuthService(new AuthRepository(httpClient)),
	todoService: new TodoService(new TodoRepository(httpClient)),
};

type TServices = typeof services;

const ServiceContext = createContext<TServices | null>(null);

const ServiceProvider = ({ children }: { children: ReactNode }) => (
	<ServiceContext value={services}>{children}</ServiceContext>
);

export const useServices = (): TServices => {
	const ctx = use(ServiceContext);
	if (!ctx) throw new Error('useServices must be used within a ServiceProvider');
	return ctx;
};

export default ServiceProvider;
