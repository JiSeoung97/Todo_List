import Badge from "@/src/components/ui/Badge";
import ListItem from "@/src/components/ui/list/ListItem";
import ProgressBar from "@/src/components/ui/ProgressBar";
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_TONES,
  TODO_STATUS_TONES,
  TODO_STATUSES,
} from "@/src/consts/common/todo";
import type { ITodo } from "@/src/types/todo/todo";
import { cn } from "@/src/utils/cn";
import { formatDate, isOverdue } from "@/src/utils/date";
import { useNavigate } from "react-router";

/** 목록 카드에 담을 TODO 고유 정보 — 카드의 뼈대는 ui/list/ListItem 이 갖는다 */
const TodoListItem = ({ todo }: { todo: ITodo }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(todo.dueDate) && todo.status !== "DONE";

  return (
    <ListItem
      onClick={() => void navigate(`/todos/${todo.id}`)}
      aside={
        <>
          {/* 숫자 필드 — 진행률 */}
          <div className="flex w-28 flex-col gap-1">
            <span className="text-xs text-slate-500">
              진행률 {todo.progress}%
            </span>
            <ProgressBar value={todo.progress} className="w-full" />
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
        </>
      }
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-slate-400">{todo.id}</span>
        <Badge tone={TODO_STATUS_TONES[todo.status]}>
          {TODO_STATUSES[todo.status]}
        </Badge>
        <Badge tone={TODO_PRIORITY_TONES[todo.priority]} variant="text">
          {TODO_PRIORITIES[todo.priority]}
        </Badge>
      </div>

      <p className="truncate text-sm font-medium text-slate-900">
        {todo.title}
      </p>

      <p className="text-xs text-slate-500">
        담당 {todo.assignee} · 등록 {formatDate(todo.createdAt)}
      </p>
    </ListItem>
  );
};

export default TodoListItem;
