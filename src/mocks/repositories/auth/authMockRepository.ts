import type { ILoginRequest, ILoginResponse, IUser } from '@/src/types/auth/auth';

interface IMockAccount extends IUser {
	password: string;
}

/**
 * 테스트 계정 — README 에 안내된 계정만 로그인에 성공한다.
 */
const ACCOUNTS: IMockAccount[] = [
	{ id: 'U001', username: 'admin', password: 'admin123!', name: '관리자', role: 'ADMIN' },
	{ id: 'U002', username: 'user', password: 'user123!', name: '박지승', role: 'USER' },
];

/**
 * 인증 mock 데이터 소유 모듈.
 * 토큰 발급과 계정 검증을 담당하며, MSW 핸들러는 결과만 응답으로 감싼다.
 */
export default class AuthMockRepository {
	/** username:id 를 base64 로 감싼 가짜 토큰 — 서명 검증은 하지 않는다 */
	private issueToken = (user: IUser): string =>
		`mock.${btoa(`${user.username}:${user.id}`)}.token`;

	private toUser = ({ password: _password, ...user }: IMockAccount): IUser => user;

	/** 계정이 일치하면 토큰+사용자, 아니면 null (핸들러가 401 로 변환) */
	public login = ({ username, password }: ILoginRequest): ILoginResponse | null => {
		const account = ACCOUNTS.find(
			item => item.username === username && item.password === password,
		);
		if (!account) return null;

		const user = this.toUser(account);
		return { accessToken: this.issueToken(user), user };
	};

	/** Authorization 헤더의 토큰으로 사용자를 되찾는다 */
	public findByToken = (token: string | null): IUser | null => {
		if (!token) return null;

		const account = ACCOUNTS.find(item => this.issueToken(this.toUser(item)) === token);
		return account ? this.toUser(account) : null;
	};
}
