import EmptyState from "@/src/components/ui/EmptyState";
import Spinner from "@/src/components/ui/Spinner";
import type { ReactNode } from "react";

interface IProps<T> {
  items: T[];
  isLoading: boolean;
  errorMessage?: string;
  /** 각 항목의 고유 key */
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** 상태별 안내 문구 — 도메인 용어는 사용처가 정한다 */
  loadingText?: string;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * 로딩 / 실패 / 빈 데이터 / 목록 네 가지 상태를 렌더링한다.
 * 항목의 생김새는 renderItem 으로 주입받으므로 도메인을 알지 않는다.
 */
const List = <T,>({
  items,
  isLoading,
  errorMessage,
  getKey,
  renderItem,
  loadingText = "불러오는 중…",
  errorTitle = "목록을 불러오지 못했습니다.",
  emptyTitle = "표시할 항목이 없습니다.",
  emptyDescription,
}: IProps<T>) => {
  if (isLoading) {
    return (
      <div
        aria-live="polite"
        className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"
      >
        <Spinner />
        {loadingText}
      </div>
    );
  }

  if (errorMessage) {
    return <EmptyState title={errorTitle} description={errorMessage} />;
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

export default List;
