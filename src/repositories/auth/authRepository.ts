import type HttpClient from '@/src/networks/httpClient';
import BaseRepository from '@/src/repositories/common/baseRepository';
import type { ILoginRequest, ILoginResponse } from '@/src/types/auth/auth';

/**
 * 인증 리포지토리 — HTTP 요청 캡슐화만 담당한다.
 * 상태 저장/화면 이동 등의 판단은 Service 이상 레이어의 책임.
 */
export default class AuthRepository extends BaseRepository {
	constructor(httpClient: HttpClient) {
		super(httpClient, '/auth');
	}

	/** POST /auth/login */
	public login = (body: ILoginRequest): Promise<ILoginResponse> =>
		this.httpClient.post<ILoginRequest, ILoginResponse>(this.url('login'), body);
}
