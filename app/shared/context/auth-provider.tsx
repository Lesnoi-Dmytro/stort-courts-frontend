import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "~/services/http";
import { showApiError } from "~/shared/lib/show-api-error";
import type { User } from "~/shared/types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await AuthService.me());
    } catch (error) {
      setUser(null);
      showApiError(error, { title: "Could not load your profile" });
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, refresh, logout }),
    [user, isLoading, refresh, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
