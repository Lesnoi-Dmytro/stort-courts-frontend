import { Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { InfoIcon } from "lucide-react";
import { CopyButton } from "~/shared/components/CopyButton";

const ACCOUNT_GROUPS = [
  { role: "Admin", emails: ["admin@example.com"] },
  {
    role: "Customers",
    emails: ["john.doe@example.com", "jane.smith@example.com"],
  },
];
const PASSWORD = "Password123!";

export function SeededAccountsHint() {
  return (
    <Tooltip
      side="right"
      maxWidth="320px"
      content={
        <Flex direction="column" gap="2" py="1">
          <Text size="1" weight="bold">
            Demo accounts
          </Text>
          {ACCOUNT_GROUPS.map(({ role, emails }) => (
            <Flex key={role} direction="column" gap="1">
              <Text size="1" className="opacity-70">
                {role}
              </Text>
              {emails.map((email) => (
                <Flex key={email} align="center" justify="between" gap="4">
                  <Text size="1" className="cursor-text font-mono select-text">
                    {email}
                  </Text>
                  <CopyButton value={email} label={`Copy ${email}`} />
                </Flex>
              ))}
            </Flex>
          ))}
          <div className="h-px bg-white/25" />
          <Flex direction="column" gap="1">
            <Text size="1" className="opacity-70">
              Password (shared)
            </Text>
            <Flex align="center" justify="between" gap="4">
              <Text size="1" className="cursor-text font-mono select-text">
                {PASSWORD}
              </Text>
              <CopyButton value={PASSWORD} label="Copy password" />
            </Flex>
          </Flex>
        </Flex>
      }
    >
      <IconButton
        type="button"
        variant="ghost"
        color="gray"
        size="1"
        aria-label="Show demo accounts"
      >
        <InfoIcon size={16} />
      </IconButton>
    </Tooltip>
  );
}
