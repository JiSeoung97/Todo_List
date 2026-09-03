import type { ReactNode } from "react";

interface IProps {
  label: string;
  children: ReactNode;
}

/** 상세 항목 한 줄 — 라벨과 값을 같은 간격으로 나열한다 */
const ListDetailRow = ({ label, children }: IProps) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <span className="shrink-0 text-sm text-slate-500">{label}</span>
    <div className="min-w-0 text-right text-sm font-medium text-slate-900">
      {children}
    </div>
  </div>
);

export default ListDetailRow;
