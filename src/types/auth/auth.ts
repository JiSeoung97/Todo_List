/** 로그인 요청 본문 */
export interface ILoginRequest {
  username: string;
  password: string;
}

/** 로그인 사용자 정보 */
export interface IUser {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "USER";
}

/** 로그인 성공 응답 */
export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}
