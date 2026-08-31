import { ENV_ENABLE_MSW } from "@/src/consts/common/envKeys";
import type { SetupWorker } from "msw/browser";
import { Suspense, use, type ReactNode } from "react";

let workerRef: SetupWorker | undefined;

/**
 * MSW 워커가 준비되기 전에 첫 요청이 나가면 가로채지 못하므로,
 * 워커 start 를 Suspense 로 기다린 뒤 앱을 렌더링한다.
 */
const mockingEnabledPromise = ENV_ENABLE_MSW
  ? import("@/src/mocks/browser").then(async ({ worker }) => {
      workerRef = worker;
      await worker.start({ onUnhandledRequest: "bypass" });
    })
  : Promise.resolve();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    workerRef?.stop();
  });
}

const MswProviderInner = ({ children }: { children: ReactNode }) => {
  use(mockingEnabledPromise);
  return children;
};

const MswProvider = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={null}>
    <MswProviderInner>{children}</MswProviderInner>
  </Suspense>
);

export default MswProvider;
