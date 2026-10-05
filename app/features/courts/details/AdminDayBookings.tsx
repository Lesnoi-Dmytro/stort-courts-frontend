import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { endOfDay, format, isFuture, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { CourtBookingsService } from "~/services/http";
import { DatePicker } from "~/shared/components/date-picker/DatePicker";
import { MINUTE } from "~/shared/lib/date";
import { showApiError } from "~/shared/lib/show-api-error";
import type { BookingSummary } from "~/shared/types";

export function AdminDayBookings({ courtId }: { courtId: string }) {
  const [day, setDay] = useState<Date>(() => new Date());
  const [bookings, setBookings] = useState<BookingSummary[] | undefined>();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setBookings(undefined);
      try {
        const from = startOfDay(day);
        const to = endOfDay(day);
        const data = await CourtBookingsService.getDaySummary(
          {
            from: from.toISOString().slice(0, 10),
            to: to.toISOString().slice(0, 10),
            courtId,
          },
          { signal: controller.signal },
        );
        setBookings(
          data.courts
            .flatMap((c) => c.bookings)
            .filter((b) => {
              const start = Date.parse(b.startDatetime);
              return start >= from.getTime() && start <= to.getTime();
            }),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setBookings([]);
        showApiError(error, { title: "Failed to load bookings" });
      }
    };

    load();
    return () => controller.abort();
  }, [courtId, day]);

  const sorted = [...(bookings ?? [])].sort(
    (a, b) => Date.parse(a.startDatetime) - Date.parse(b.startDatetime),
  );
  const total = sorted.reduce((sum, b) => sum + Number(b.price), 0);

  return (
    <Flex direction="column" gap="3">
      <DatePicker
        mode="date"
        value={day}
        onChange={(next) => next && setDay(next)}
      />
      {bookings === undefined ? (
        <Skeleton height="64px" />
      ) : sorted.length === 0 ? (
        <Text size="2" color="gray">
          No bookings on this day.
        </Text>
      ) : (
        <>
          {sorted.map((b) => {
            const start = new Date(b.startDatetime);
            const end = new Date(start.getTime() + b.minutes * MINUTE);
            return (
              <Flex
                key={b.id}
                justify="between"
                gap="3"
                className={isFuture(start) ? undefined : "opacity-60"}
              >
                <Text size="2">
                  {format(start, "HH:mm")} – {format(end, "HH:mm")} ·{" "}
                  {b.userName}
                </Text>
                <Text size="2">${b.price}</Text>
              </Flex>
            );
          })}
          <Text size="2" weight="bold" align="right">
            Total: ${total.toFixed(2)}
          </Text>
        </>
      )}
    </Flex>
  );
}
