/**
 * RESTful 공통 계약
 * mes_fe 의 IRequestBody/IResponseBody 를 RESTful 방식으로 단순화한 형태.
 * (MES 전용 signature/functionCode 규칙은 제외 — 과제 가이드에 따라 RESTful 로만 작성)
 */

/** 목록 조회 공통 쿼리 파라미터 — GET 쿼리스트링으로 직렬화된다 */
export interface IPageQuery {
	/** 1-based 페이지 번호 */
	page: number;
	/** 페이지당 건수 */
	size: number;
}

/** 페이지네이션 응답 공통 형태 */
export interface IPaginatedResponse<T> {
	items: T[];
	page: number;
	size: number;
	/** 필터 적용 후 전체 건수 */
	totalCount: number;
	totalPages: number;
}

/** 서버 에러 응답 본문 (MSW 핸들러가 4xx 와 함께 반환) */
export interface IErrorResponse {
	message: string;
	code?: string;
}
