import { DEFAULT_PAGE_SIZE, TODO_STATUS_CODES, type TTodoStatus } from '@/src/consts/common/todo';
import type { ITodoListQuery } from '@/src/types/todo/todo';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

/** 임의의 문자열이 유효한 상태 코드인지 — URL 로 들어온 값을 좁힌다 */
const isTodoStatus = (value: string | null): value is TTodoStatus =>
	value !== null && (TODO_STATUS_CODES as readonly string[]).includes(value);

/** setQuery 로 넘길 수 있는 부분 조건 — 빈 문자열은 '조건 해제'를 뜻한다 */
export interface ITodoFilterPatch {
	page?: number;
	keyword?: string;
	status?: TTodoStatus | '';
}

/**
 * 기본값은 URL 에서 생략한다.
 * 빈 URLSearchParams 에서 시작해 값이 있는 것만 넣으므로 delete 가 필요 없고,
 * 같은 조건은 항상 같은 URL(= 같은 쿼리키)로 정규화된다.
 */
const toSearchParams = (state: ITodoFilterPatch): URLSearchParams => {
	const params = new URLSearchParams();

	if (state.page && state.page > 1) params.set('page', String(state.page));
	if (state.keyword?.trim()) params.set('keyword', state.keyword.trim());
	if (state.status) params.set('status', state.status);

	return params;
};

/**
 * 목록 검색 조건을 URL 쿼리스트링과 동기화한다.
 * URL 이 단일 진실 소스이므로 새로고침·뒤로가기·링크 공유가 모두 동작한다.
 */
const useTodoListFilter = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// 읽기 — URL 이 어떻게 깨져 있어도 유효한 ITodoListQuery 를 보장한다
	const query: ITodoListQuery = useMemo(() => {
		const pageNum = Number(searchParams.get('page'));
		const page = Number.isInteger(pageNum) && pageNum >= 1 ? pageNum : 1;

		const keyword = searchParams.get('keyword')?.trim() || undefined;

		const rawStatus = searchParams.get('status');
		const status = isTodoStatus(rawStatus) ? rawStatus : undefined;

		return { page, size: DEFAULT_PAGE_SIZE, keyword, status };
	}, [searchParams]);

	// 쓰기 — 부분 갱신. page 외 조건이 바뀌면 page 를 1 로 리셋한다
	const setQuery = useCallback(
		(patch: ITodoFilterPatch) => {
			// size 는 URL 에 싣지 않으므로 현재 조건에서 제외한다
			const { size: _size, ...current } = query;

			const isPageChange = 'page' in patch;
			const next: ITodoFilterPatch = {
				...current,
				...patch,
				// 검색어·필터가 바뀌면 보던 페이지는 의미가 없으므로 처음으로
				...(isPageChange ? null : { page: 1 }),
			};

			// 필터 변경으로 히스토리가 쌓이지 않도록 replace, 페이지 이동만 push
			setSearchParams(toSearchParams(next), { replace: !isPageChange });
		},
		[query, setSearchParams],
	);

	return { query, setQuery };
};

export default useTodoListFilter;
