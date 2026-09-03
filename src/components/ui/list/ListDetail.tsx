import EmptyState from "@/src/components/ui/EmptyState";
import Spinner from "@/src/components/ui/Spinner";
import type { ReactNode } from "react";

interface IProps<T> {
  /** 표시할 데이터 — 없으면 '찾을 수 없음' 상태 */
  data?: T;
  isLoading: boolean;
  errorMessage?: string;
  /** 카드 상단 — 배지·태그 등 */
  header?: (data: T) => ReactNode;
  /** 카드 제목 */
  title?: (data: T) => ReactNode;
  /** 카드 본문 — DetailRow 들을 나열한다 */
  children: (data: T) => ReactNode;
  /** 상태별 안내 문구 — 도메인 용어는 사용처가 정한다 */
  loadingText?: string;
  errorTitle?: string;
  notFoundTitle?: string;
  notFoundDescription?: string;
}

/**
 * 로딩 / 실패 / 없음 / 상세 네 가지 상태를 렌더링한다 (List 와 같은 형태).
 * 카드 내용은 render prop 으로 주입받으므로 도메인을 알지 않는다.
 */
const ListDetail = <T,>({
  data,
  isLoading,
  errorMessage,
  header,
  title,
  children,
  loadingText = "불러오는 중…",
  errorTitle = "항목을 불러오지 못했습니다.",
  notFoundTitle = "항목을 찾을 수 없습니다.",
  notFoundDescription,
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

  if (!data) {
    return (
      <EmptyState title={notFoundTitle} description={notFoundDescription} />
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      {header && (
        <div className="flex flex-wrap items-center gap-2">{header(data)}</div>
      )}

      {title && (
        <h2 className="mt-3 text-lg font-semibold break-keep text-slate-900">
          {title(data)}
        </h2>
      )}

      <div className="mt-4 flex flex-col">{children(data)}</div>
    </section>
  );
};

export default ListDetail;
