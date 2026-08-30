import LoginPage from "@/src/pages/LoginPage";
import TodoListPage from "@/src/pages/TodoListPage";
import AuthGuard from "@/src/pages/guards/AuthGuard";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider as Router,
} from "react-router";
import TodoDetailPage from "@/src/pages/TodoDetailPage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/todos" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    // 인증이 필요한 구간
    element: <AuthGuard />,
    children: [
      { path: "/todos", element: <TodoListPage /> },
      { path: "/todos/:id", element: <TodoDetailPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/todos" replace /> },
]);

const RouterProvider = () => <Router router={router} />;

export default RouterProvider;
