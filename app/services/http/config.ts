import axios from "axios";
import { Paths } from "~/shared/const/paths";
import { ApiPaths } from "./api-paths";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const AUTH_ROUTS = [Paths.SIGN_IN, Paths.SIGN_UP];

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
