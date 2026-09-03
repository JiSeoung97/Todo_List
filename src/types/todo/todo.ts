import type { TTodoPriority, TTodoStatus } from '@/src/consts/common/todo';
import type { IPageQuery } from '@/src/types/common/repository';

/**
 * TODO 항목 — 필드 6개 이상 (문자열/숫자/날짜/enum 혼합)
 * - 문자열: id, title, assignee
 * - enum:   status, priority
 * - 숫자:   progress
 * - 날짜:   dueDate, createdAt (ISO 8601 문자열)
 */
export interface ITodo {
	id: string;
	title: string;
	assignee: string;
	status: TTodoStatus;
	priority: TTodoPriority;
	/** 진행률 0~100 */
	progress: number;
	/** 마감일 (ISO 8601) */
	dueDate: string;
	/** 등록일 (ISO 8601) */
	createdAt: string;
}

/** 목록 조회 검색/필터 조건 */
export interface ITodoListQuery extends IPageQuery {
	/** 제목/담당자 부분 일치 검색 */
	keyword?: string;
	/** 상태 필터 — 미지정 시 전체 */
	status?: TTodoStatus;
}
