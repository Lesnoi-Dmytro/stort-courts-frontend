import { Badge, Flex, Skeleton, Text } from "@radix-ui/themes";
import { format, isFuture } from "date-fns";
import { useEffect, useState } from "react";
import { CourtBookingsService } from "~/services/http";
import { MINUTE } from "~/shared/lib/date";
import { showApiError } from "~/shared/lib/show-api-error";
import type { CourtBooking } from "~/shared/types";

/** The customer's bookings of a court, newest first. Refetches when `reloadKey` changes. */
export function MyBookings({
  courtId,
  reloadKey,
}: {
  courtId: string;
  reloadKey: number;
}) {
  const [bookings, setBookings] = useState<CourtBooking[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await CourtBookingsService.findMine(
          { courtId },
          { signal: controller.signal },
        );
        setBookings(
          [...data].sort(
            (a, b) => Date.parse(b.startDatetime) - Date.parse(a.startDatetime),
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setBookings([]);
        showApiError(error, { title: "Failed to load your bookings" });
      }
    };

    load();
    return () => controller.abort();
  }, [courtId, reloadKey]);

  if (!bookings) return <Skeleton height="64px" />;
  if (bookings.length === 0)
    return (
      <Text size="2" color="gray">
        You have no bookings for this court yet.
      </Text>
    );

  return (
    <Flex direction="column" gap="2">
      {bookings.map((b) => {
        const start = new Date(b.startDatetime);
        const upcoming = isFuture(start);
        const end = new Date(start.getTime() + b.minutes * MINUTE);
        return (
          <Flex
            key={b.id}
            justify="between"
            align="center"
            gap="3"
            className={upcoming ? undefined : "opacity-60"}
          >
            <Text size="2">
              {format(start, "PP, HH:mm")} – {format(end, "HH:mm")}
            </Text>
            <Badge color={upcoming ? "green" : "gray"}>
              {upcoming ? "Upcoming" : "Completed"}
            </Badge>
          </Flex>
        );
      })}
    </Flex>
  );
}
