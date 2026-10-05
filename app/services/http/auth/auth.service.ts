import axios from "axios";
import type { SignInDTO, SignUpDTO, User } from "~/shared/types";
import { ApiPaths } from "../api-paths";
import { http } from "../config";

export const AuthService = {
  async me(): Promise<User | null> {
    try {
      const { data } = await http.get<User>(ApiPaths.AUTH_ME, {
        skipAuthRedirect: true,
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  async signIn(dto: SignInDTO): Promise<void> {
    await http.post(ApiPaths.AUTH_SIGN_IN, dto, { skipAuthRedirect: true });
  },

  async signUp(dto: SignUpDTO): Promise<void> {
    await http.post(ApiPaths.AUTH_SIGN_UP, dto, { skipAuthRedirect: true });
  },

  async logout(): Promise<void> {
    await http.post(ApiPaths.AUTH_LOGOUT);
  },
};
