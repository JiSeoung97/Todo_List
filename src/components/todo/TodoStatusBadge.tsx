import { TODO_STATUSES, type TTodoStatus } from "@/src/consts/common/todo";
import { cn } from "@/src/utils/cn";

const STATUS_STYLES: Record<TTodoStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  HOLD: "bg-amber-100 text-amber-700",
};

const TodoStatusBadge = ({ status }: { status: TTodoStatus }) => (
  <span
    className={cn(
      "rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
      STATUS_STYLES[status]
    )}
  >
    {TODO_STATUSES[status]}
  </span>
);

export default TodoStatusBadge;
