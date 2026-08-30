import { ENV_DEV_MODE } from "@/src/consts/common/envKeys";
import {
  create,
  type StateCreator,
  type StoreMutatorIdentifier,
} from "zustand";
import { devtools } from "zustand/middleware";

/**
 * zustand devtools 를 일괄 적용하기 위한 스토어 팩토리
 */
export const createStore =
  <T>() =>
  <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    name: string,
    initializer: StateCreator<T, [], Mos>
  ) =>
    create<T>()(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      devtools(initializer as any, { name, enabled: ENV_DEV_MODE })
    );
