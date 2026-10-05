import { Flex, Text } from "@radix-ui/themes";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format, isFuture } from "date-fns";
import { useMemo, useRef } from "react";
import { Link } from "react-router";
import { Paths } from "~/shared/const/paths";
import { MINUTE } from "~/shared/lib/date";
import { formatSport } from "~/shared/lib/format";
import type { BookingSummary, CourtDaySummary } from "~/shared/types";

type Row =
  | { kind: "court"; key: string; court: CourtDaySummary }
  | { kind: "booking"; key: string; booking: BookingSummary };

const HEADER_HEIGHT = 64;
const BOOKING_HEIGHT = 32;

export function SummaryRows({ courts }: { courts: CourtDaySummary[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<Row[]>(
    () =>
      courts.flatMap((court) => [
        { kind: "court" as const, key: `c-${court.id}`, court },
        ...court.bookings.map((booking) => ({
          kind: "booking" as const,
          key: `b-${booking.id}`,
          booking,
        })),
      ]),
    [courts],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) =>
      rows[i].kind === "court" ? HEADER_HEIGHT : BOOKING_HEIGHT,
    getItemKey: (i) => rows[i].key,
    overscan: 8,
  });

  return (
    <div
      ref={parentRef}
      className="min-h-0 flex-1 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-800"
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const row = rows[item.index];
          return (
            <div
              key={item.key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full px-4"
              style={{ transform: `translateY(${item.start}px)` }}
            >
              {row.kind === "court" ? (
                <CourtHeader court={row.court} first={item.index === 0} />
              ) : (
                <BookingRow booking={row.booking} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourtHeader({
  court,
  first,
}: {
  court: CourtDaySummary;
  first: boolean;
}) {
  return (
    <Flex
      justify="between"
      align="center"
      gap="3"
      className={`py-3 ${first ? "" : "mt-2 border-t border-gray-200 dark:border-gray-800"}`}
    >
      <Flex direction="column" className="min-w-0">
        <Link
          to={Paths.COURT(court.id)}
          className="font-medium wrap-break-word underline-offset-2 hover:underline"
        >
          {court.name}
        </Link>
        <Text size="1" color="gray">
          {formatSport(court.sportType)} · ${court.hourlyPrice}/h
        </Text>
      </Flex>
      <Text weight="bold" className="shrink-0">
        ${court.totalPrice.toFixed(2)}
      </Text>
    </Flex>
  );
}

function BookingRow({ booking }: { booking: BookingSummary }) {
  const start = new Date(booking.startDatetime);
  const end = new Date(start.getTime() + booking.minutes * MINUTE);
  return (
    <Flex
      justify="between"
      gap="3"
      className={`py-1 ${isFuture(start) ? "" : "opacity-60"}`}
    >
      <Text size="2">
        {format(start, "HH:mm")} – {format(end, "HH:mm")} · {booking.userName}
      </Text>
      <Text size="2">${booking.price}</Text>
    </Flex>
  );
}
