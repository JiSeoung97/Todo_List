import { cn } from "@/src/utils/cn";
import type { ReactNode } from "react";

/** 색상 의미만 노출한다 — 어떤 도메인 값이 어느 톤인지는 호출부가 정한다 */
export type TBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted";

/** 배경을 채우는 solid, 글자색만 쓰는 text 두 가지 */
export type TBadgeVariant = "solid" | "text";

const SOLID_TONES: Record<TBadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  muted: "bg-slate-50 text-slate-500",
};

const TEXT_TONES: Record<TBadgeTone, string> = {
  neutral: "text-slate-700",
  info: "text-blue-600",
  success: "text-green-600",
  warning: "text-orange-600",
  danger: "text-red-600",
  muted: "text-slate-500",
};

interface IProps {
  children: ReactNode;
  tone?: TBadgeTone;
  variant?: TBadgeVariant;
  className?: string;
}

const Badge = ({
  children,
  tone = "neutral",
  variant = "solid",
  className,
}: IProps) => (
  <span
    className={cn(
      "whitespace-nowrap",
      variant === "solid" &&
        cn("rounded-full px-2 py-0.5 text-xs font-medium", SOLID_TONES[tone]),
      variant === "text" && cn("text-xs font-semibold", TEXT_TONES[tone]),
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
