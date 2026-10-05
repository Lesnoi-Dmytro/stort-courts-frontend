import { DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import {
  CalendarCheckIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";

export function UserMenu() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <div className="size-8" aria-hidden />;

  if (!user) {
    return (
      <IconButton
        asChild
        variant="ghost"
        color="gray"
        aria-label="Sign in"
        title="Sign in"
      >
        <Link to={Paths.SIGN_IN}>
          <LogInIcon size={18} />
        </Link>
      </IconButton>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate(Paths.SIGN_IN);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" radius="full" aria-label="User menu">
          <UserIcon size={18} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <Flex direction="column" gap="1" px="3" py="2">
          <Text size="2" weight="medium">
            {user.firstName} {user.lastName}
          </Text>
          <Text size="1" color="gray">
            {user.email}
          </Text>
        </Flex>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link to={Paths.BOOKINGS}>
            <CalendarCheckIcon size={16} />
            Bookings
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item color="red" onSelect={handleLogout}>
          <LogOutIcon size={16} />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
