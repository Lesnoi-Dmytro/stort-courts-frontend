import { Link, Outlet } from "react-router";
import { Paths } from "~/shared/const/paths";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link to={Paths.INDEX} className="text-xl font-bold">
            Courtly
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
