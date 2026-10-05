import { Badge, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { ClockIcon } from "lucide-react";
import { Link } from "react-router";
import { Paths } from "~/shared/const/paths";
import type { Court } from "~/shared/types";
import { utcTimeToLocal } from "~/shared/lib/date";
import { formatSport } from "~/shared/lib/format";

export function CourtCard({ court }: { court: Court }) {
  return (
    <Card asChild size="3">
      <Link to={Paths.COURT(court.id)} className="block">
        <Flex direction="column" gap="3">
          <Flex justify="between" align="start" gap="2">
            <Heading as="h3" size="4" className="min-w-0 truncate">
              {court.name}
            </Heading>
            <Flex gap="1" className="shrink-0">
              {!court.isActive && <Badge color="gray">Inactive</Badge>}
              <Badge>{formatSport(court.sportType)}</Badge>
            </Flex>
          </Flex>

          <Flex align="center" gap="2" className="text-(--gray-11)">
            <ClockIcon size={16} />
            <Text size="2">
              {utcTimeToLocal(court.openingHour)} –{" "}
              {utcTimeToLocal(court.closingHour)}
            </Text>
          </Flex>

          <Text size="5" weight="bold">
            ${court.hourlyPrice}
            <Text size="2" weight="regular" color="gray">
              {" "}
              / hour
            </Text>
          </Text>
        </Flex>
      </Link>
    </Card>
  );
}
