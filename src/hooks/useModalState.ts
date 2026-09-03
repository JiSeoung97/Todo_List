import { useCallback, useState, type MouseEventHandler } from 'react';

// T=boolean(기본, 단순 토글)만 MouseEventHandler 와 겹쳐 `onClick={onOpen}` bare 할당을 허용한다.
// T 가 실데이터 타입이면 인자를 강제해, `onClick={onOpen}` 처럼 이벤트 객체가 데이터로 오인되는
// 실수(예: `open` 이 boolean `true` 로만 세팅되고 `data.field` 가 조용히 undefined 가 되는 경우)를
// 컴파일 타임에 차단한다.
type TOnOpen<T> = boolean extends T
	? ((value?: T) => void) & MouseEventHandler<HTMLElement>
	: (value: T) => void;

function useModalState<T = boolean>(defaultValue: T | false = false) {
	const [state, setState] = useState<T | false>(defaultValue);

	const onOpenImpl = useCallback((value?: T | unknown) => {
		const isEventLike =
			value !== undefined &&
			typeof value === 'object' &&
			value !== null &&
			('preventDefault' in value || 'currentTarget' in value);
		setState(isEventLike || value === undefined ? (true as unknown as T) : (value as T));
	}, []);
	const onOpen = onOpenImpl as TOnOpen<T>;

	const onClose = useCallback(() => setState(false), []);

	return { open: state, onOpen, onClose } as const;
}

export default useModalState;
