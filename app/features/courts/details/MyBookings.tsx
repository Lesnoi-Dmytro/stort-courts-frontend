import {
  Badge,
  Button,
  Flex,
  SegmentedControl,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import { CancelBookingButton } from "~/features/bookings/CancelBookingButton";
import {
  BOOKING_FILTER_VALUES,
  type BookingFilter,
} from "~/features/bookings/booking-filter";
import { CourtBookingsService } from "~/services/http";
import { formatBookingRange } from "~/shared/lib/date";
import { showApiError } from "~/shared/lib/show-api-error";
import { DEFAULT_PAGE, type MyBooking } from "~/shared/types";

/** The customer's bookings of a court, filtered by status and paginated. Refetches when `reloadKey` changes. */
const PAGE_LIMIT = 5;

export function MyBookings({
  courtId,
  reloadKey,
}: {
  courtId: string;
  reloadKey: number;
}) {
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [filter, setFilter] = useState<BookingFilter>("upcoming");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await CourtBookingsService.findMine(
          {
            courtId,
            page,
            limit: PAGE_LIMIT,
            completed: BOOKING_FILTER_VALUES[filter],
          },
          { signal: controller.signal },
        );
        setBookings(data.items);
        setTotal(data.total);
      } catch (error) {
        if (controller.signal.aborted) return;
        setBookings([]);
        showApiError(error, { title: "Failed to load your bookings" });
      }
    };

    load();
    return () => controller.abort();
  }, [courtId, reloadKey, cancelledCount, page, filter]);

  const changePage = (next: number) => {
    setPage(next);
    setBookings(null);
  };

  return (
    <Flex direction="column" gap="3">
      <SegmentedControl.Root
        value={filter}
        onValueChange={(value) => {
          setFilter(value as BookingFilter);
          changePage(DEFAULT_PAGE);
        }}
      >
        <SegmentedControl.Item value="upcoming">Upcoming</SegmentedControl.Item>
        <SegmentedControl.Item value="completed">
          Completed
        </SegmentedControl.Item>
        <SegmentedControl.Item value="all">All</SegmentedControl.Item>
      </SegmentedControl.Root>

      {!bookings ? (
        <Skeleton height="64px" />
      ) : bookings.length === 0 ? (
        <Text size="2" color="gray">
          No bookings for this court here.
        </Text>
      ) : (
        bookings.map((b) => {
          const start = new Date(b.startDatetime);
          const upcoming = isFuture(start);
          return (
            <Flex
              key={b.id}
              justify="between"
              align="center"
              gap="3"
              className={upcoming ? undefined : "opacity-60"}
            >
              <Text size="2">
                {formatBookingRange(b.startDatetime, b.minutes)}
              </Text>
              <Flex align="center" gap="2">
                <Badge color={upcoming ? "green" : "gray"}>
                  {upcoming ? "Upcoming" : "Completed"}
                </Badge>
                {upcoming && (
                  <CancelBookingButton
                    bookingId={b.id}
                    onCancelled={() => setCancelledCount((n) => n + 1)}
                  />
                )}
              </Flex>
            </Flex>
          );
        })
      )}

      {totalPages > 1 && (
        <Flex justify="center" align="center" gap="3">
          <Button
            size="1"
            variant="soft"
            disabled={page <= 1 || !bookings}
            onClick={() => changePage(page - 1)}
          >
            Previous
          </Button>
          <Text size="2" color="gray">
            Page {page} of {totalPages}
          </Text>
          <Button
            size="1"
            variant="soft"
            disabled={page >= totalPages || !bookings}
            onClick={() => changePage(page + 1)}
          >
            Next
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
