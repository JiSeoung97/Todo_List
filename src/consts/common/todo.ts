/** TODO 상태 — enum 성 필드 */
export const TODO_STATUSES = {
	TODO: '대기',
	IN_PROGRESS: '진행중',
	DONE: '완료',
	HOLD: '보류',
} as const;

export type TTodoStatus = keyof typeof TODO_STATUSES;

/** TODO 우선순위 — enum 성 필드 */
export const TODO_PRIORITIES = {
	LOW: '낮음',
	MEDIUM: '보통',
	HIGH: '높음',
	URGENT: '긴급',
} as const;

export type TTodoPriority = keyof typeof TODO_PRIORITIES;

export const TODO_STATUS_CODES = Object.keys(TODO_STATUSES) as TTodoStatus[];
export const TODO_PRIORITY_CODES = Object.keys(TODO_PRIORITIES) as TTodoPriority[];

/** 목록 기본 페이지 크기 */
export const DEFAULT_PAGE_SIZE = 10;
