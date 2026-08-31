export const ENV_API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "/api";
export const ENV_ENABLE_MSW: boolean =
  import.meta.env.VITE_ENABLE_MSW === "true";
export const ENV_DEV_MODE: boolean = import.meta.env.DEV;
