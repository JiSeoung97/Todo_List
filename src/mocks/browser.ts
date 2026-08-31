import { handlers } from "@/src/mocks/handlers";
import { setupWorker } from "msw/browser";

export const worker = setupWorker(...handlers);
