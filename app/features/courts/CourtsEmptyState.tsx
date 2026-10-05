import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { SearchXIcon, VolleyballIcon } from "lucide-react";

type CourtsEmptyStateProps = {
  hasFilters: boolean;
  onReset: () => void;
};

export function CourtsEmptyState({
  hasFilters,
  onReset,
}: CourtsEmptyStateProps) {
  const Icon = hasFilters ? SearchXIcon : VolleyballIcon;

  return (
    <Flex
      direction="column"
      align="center"
      gap="3"
      className="rounded-lg border border-dashed border-(--gray-6) px-4 py-16 text-center"
    >
      <Flex
        align="center"
        justify="center"
        className="size-14 rounded-full bg-(--accent-3) text-(--accent-9)"
      >
        <Icon size={28} />
      </Flex>
      <Heading as="h2" size="4">
        {hasFilters ? "No courts match your filters" : "No courts yet"}
      </Heading>
      <Text size="2" color="gray" className="max-w-sm">
        {hasFilters
          ? "Try a different name or sport, or clear the filters to see all courts."
          : "There are no courts available at the moment. Please check back later."}
      </Text>
      {hasFilters && (
        <Button variant="soft" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </Flex>
  );
}
