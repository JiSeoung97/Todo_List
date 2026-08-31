import { createStore } from "@/src/stores/common/createStore";
import type { IUser } from "@/src/types/auth/auth";
import { createJSONStorage, persist } from "zustand/middleware";

interface IAuthStore {
  accessToken: string | null;
  user: IUser | null;
  /** 로그인 성공 시 토큰+사용자 저장 */
  setAuth: (accessToken: string, user: IUser) => void;
  /** 로그아웃 / 401 시 초기화 */
  clearAuth: () => void;
}

/**
 * 로그인 상태 — 클라이언트 상태이므로 TanStack Query 가 아닌 Store 가 소유한다.
 * 새로고침해도 로그인이 유지되도록 localStorage 에 persist.
 */
const useAuthStore = createStore<IAuthStore>()(
  "useAuthStore",
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "todo-list:auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** 로그인 여부 — 컴포넌트에서 자주 쓰는 파생 상태 */
export const selectIsAuthenticated = (state: IAuthStore): boolean =>
  Boolean(state.accessToken);

export default useAuthStore;
