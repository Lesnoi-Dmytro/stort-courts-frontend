import { Button, Flex, Heading } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { CourtsList } from "~/features/courts/list/CourtsList";
import { Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { UserRole } from "~/shared/types";
import type { Route } from "./+types/courts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Courts | Courtly" },
    { name: "description", content: "Sports Facility Booking Platform" },
  ];
}

export default function Courts() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <Flex justify="between" align="center" gap="3">
        <Heading as="h1" size="7">
          Courts
        </Heading>
        {user?.role === UserRole.ADMIN && (
          <Button asChild>
            <Link to={Paths.COURT_NEW}>
              <PlusIcon size={16} /> New court
            </Link>
          </Button>
        )}
      </Flex>
      <CourtsList />
    </div>
  );
}
