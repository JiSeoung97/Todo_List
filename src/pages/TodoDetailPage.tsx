import TodoDetail from "@/src/components/todo/TodoDetail";
import Button from "@/src/components/ui/Button";
import { useServices } from "@/src/contexts/ServiceProvider";
import { useNavigate, useParams } from "react-router";

/**
 * 상세 페이지 — URL 의 id 를 service 훅에 넘기는 것이 전부다.
 * 데이터 fetch 는 todoService(useGetTodo) 의 책임이며,
 * Service/Repository/HttpClient/MSW 는 목록 화면과 그대로 공유한다.
 */
const TodoDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { todoService } = useServices();

  const { data: todo, isLoading, error } = todoService.useGetTodo(id);

  const goToList = () => void navigate("/todos");

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">TODO 상세</h1>
            <p className="mt-1 font-mono text-sm text-slate-500">{id}</p>
          </div>

          <Button variant="ghost" onClick={goToList}>
            목록으로
          </Button>
        </header>

        <TodoDetail
          todo={todo}
          isLoading={isLoading}
          errorMessage={error?.message}
        />
      </div>
    </main>
  );
};

export default TodoDetailPage;
