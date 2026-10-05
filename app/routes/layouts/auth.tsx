import { VolleyballIcon } from "lucide-react";
import { Link, Navigate, Outlet } from "react-router";
import { ThemeSwitch } from "~/shared/components/header/ThemeSwitch";
import { DEFAULT_PATH, Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) return <Navigate to={DEFAULT_PATH} replace />;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center px-4">
        <Link
          to={Paths.INDEX}
          className="flex items-center gap-2 text-xl font-bold"
        >
          <VolleyballIcon className="text-(--accent-9)" size={24} />
          Courtly
        </Link>
        <div className="ml-auto">
          <ThemeSwitch />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
