import axios, { type AxiosRequestConfig } from "axios";
import { Paths } from "~/shared/const/paths";
import { ApiPaths } from "./api-paths";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

export type RequestOptions = Pick<AxiosRequestConfig, "signal">;

const AUTH_ROUTS = [Paths.SIGN_IN, Paths.SIGN_UP];

const protocol = import.meta.env.VITE_API_SECURE === "true" ? "https" : "http";

export const http = axios.create({
  baseURL: `${protocol}://${import.meta.env.VITE_API_ORIGIN}/api`,
  timeout: 5000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.skipAuthRedirect &&
      typeof window !== "undefined" &&
      !AUTH_ROUTS.includes(window.location.pathname)
    ) {
      window.location.assign(Paths.SIGN_IN);
    }
    return Promise.reject(error);
  },
);
