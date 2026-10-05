import { VolleyballIcon } from "lucide-react";
import { Link, Outlet } from "react-router";
import { ThemeSwitch } from "~/shared/components/header/ThemeSwitch";
import { UserMenu } from "~/shared/components/header/UserMenu";
import { Paths } from "~/shared/const/paths";

export default function MainLayout() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            to={Paths.INDEX}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <VolleyballIcon className="text-(--accent-9)" size={24} />
            Courtly
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitch />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="container mx-auto flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
