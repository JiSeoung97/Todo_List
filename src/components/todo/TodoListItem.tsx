import TodoPriorityBadge from "@/src/components/todo/TodoPriorityBadge";
import TodoStatusBadge from "@/src/components/todo/TodoStatusBadge";
import type { ITodo } from "@/src/types/todo/todo";
import { cn } from "@/src/utils/cn";
import { formatDate, isOverdue } from "@/src/utils/date";
import { Link } from "react-router";

const TodoListItem = ({ todo }: { todo: ITodo }) => {
  const overdue = isOverdue(todo.dueDate) && todo.status !== "DONE";

  return (
    <li>
      <Link
        to={`/todos/${todo.id}`}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">{todo.id}</span>
            <TodoStatusBadge status={todo.status} />
            <TodoPriorityBadge priority={todo.priority} />
          </div>

          <p className="truncate text-sm font-medium text-slate-900">
            {todo.title}
          </p>

          <p className="text-xs text-slate-500">
            담당 {todo.assignee} · 등록 {formatDate(todo.createdAt)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          {/* 숫자 필드 — 진행률 */}
          <div className="flex w-28 flex-col gap-1">
            <span className="text-xs text-slate-500">
              진행률 {todo.progress}%
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${todo.progress}%` }}
              />
            </div>
          </div>

          {/* 날짜 필드 — 마감일 */}
          <div className="w-24 text-right">
            <span className="block text-xs text-slate-500">마감일</span>
            <span
              className={cn(
                "text-sm font-medium",
                overdue ? "text-red-600" : "text-slate-800"
              )}
            >
              {formatDate(todo.dueDate)}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default TodoListItem;
