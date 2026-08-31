import LoginForm from "@/src/components/auth/LoginForm";
import { useServices } from "@/src/contexts/ServiceProvider";
import useAuthStore, {
  selectIsAuthenticated,
} from "@/src/stores/common/authStore";
import { Navigate, useLocation, useNavigate } from "react-router";

/**
 * 로그인 페이지 — 화면 조립과 이동만 담당한다.
 * 실제 요청은 authService(useLogin) 가, 토큰 저장은 authStore 가 처리한다.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authService } = useServices();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const { mutate, isPending, error } = authService.useLogin();

  // AuthGuard 가 넘겨준 원래 목적지 — 직접 로그인했다면 목록으로
  const from = (location.state as { from?: string } | null)?.from ?? "/todos";

  // 이미 로그인된 상태로 접근하면 목록으로 보낸다
  if (isAuthenticated) return <Navigate to="/todos" replace />;

  return (
    <main className="flex min-h-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Todo-List 로그인
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            MSW 로 모킹된 로그인 API 를 호출합니다.
          </p>
        </header>

        <LoginForm
          isPending={isPending}
          errorMessage={error?.message}
          onSubmit={(values) =>
            mutate(values, {
              onSuccess: () => void navigate(from, { replace: true }),
            })
          }
        />

        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700">테스트 계정</p>
          <p className="mt-1">admin / admin123!</p>
          <p>user / user123!</p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
