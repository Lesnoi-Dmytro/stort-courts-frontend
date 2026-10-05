import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  SegmentedControl,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { isFuture } from "date-fns";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { CourtBookingsService } from "~/services/http";
import { BOOKING_FILTER_VALUES, type BookingFilter } from "./booking-filter";
import { CancelBookingButton } from "./CancelBookingButton";
import { DEFAULT_PATH, Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { formatBookingRange } from "~/shared/lib/date";
import { showApiError } from "~/shared/lib/show-api-error";
import { DEFAULT_PAGE, UserRole, type MyBooking } from "~/shared/types";

const PAGE_LIMIT = 10;

export function MyBookingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);

  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [filter, setFilter] = useState<BookingFilter>("upcoming");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const isCustomer = !!user && user.role !== UserRole.ADMIN;

  useEffect(() => {
    if (!isCustomer) return;
    const controller = new AbortController();
    const { signal } = controller;

    const load = async () => {
      try {
        const data = await CourtBookingsService.findMine(
          {
            page,
            limit: PAGE_LIMIT,
            completed: BOOKING_FILTER_VALUES[filter],
          },
          { signal },
        );
        setBookings(data.items);
        setTotal(data.total);
      } catch (error) {
        if (signal.aborted) return;
        setBookings((prev) => prev ?? []);
        showApiError(error, { title: "Failed to load your bookings" });
      }
    };

    load();
    return () => controller.abort();
  }, [isCustomer, page, filter, reloadKey]);

  if (isAuthLoading) return <Skeleton height="120px" />;
  if (!isCustomer) return <Navigate to={DEFAULT_PATH} replace />;

  return (
    <Flex direction="column" gap="5" className="mx-auto w-full max-w-xl">
      <Heading as="h1" size="7">
        My bookings
      </Heading>

      <SegmentedControl.Root
        value={filter}
        onValueChange={(value) => {
          setFilter(value as BookingFilter);
          setPage(DEFAULT_PAGE);
          setBookings(null);
        }}
      >
        <SegmentedControl.Item value="upcoming">Upcoming</SegmentedControl.Item>
        <SegmentedControl.Item value="completed">
          Completed
        </SegmentedControl.Item>
        <SegmentedControl.Item value="all">All</SegmentedControl.Item>
      </SegmentedControl.Root>

      {!bookings ? (
        <Skeleton height="120px" />
      ) : bookings.length === 0 ? (
        <Text color="gray">
          No bookings here.{" "}
          <Link to={Paths.COURTS} className="underline">
            Browse courts
          </Link>
        </Text>
      ) : (
        <Flex direction="column" gap="3">
          {bookings.map((b) => {
            const start = new Date(b.startDatetime);
            const upcoming = isFuture(start);
            return (
              <Card key={b.id} className={upcoming ? undefined : "opacity-60"}>
                <Flex justify="between" align="center" gap="3">
                  <Link
                    to={Paths.COURT(b.court.id)}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <Flex direction="column" gap="1" className="min-w-0">
                      <Text weight="medium" className="wrap-break-word">
                        {b.court.name}
                      </Text>
                      <Text size="2" color="gray">
                        {formatBookingRange(b.startDatetime, b.minutes)}
                      </Text>
                    </Flex>
                    <ChevronRightIcon size={16} className="text-(--gray-9)" />
                  </Link>
                  <Flex align="center" gap="2" className="shrink-0">
                    <Badge color={upcoming ? "green" : "gray"}>
                      {upcoming ? "Upcoming" : "Completed"}
                    </Badge>
                    {upcoming && (
                      <CancelBookingButton
                        bookingId={b.id}
                        onCancelled={() => setReloadKey((k) => k + 1)}
                      />
                    )}
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      )}

      {totalPages > 1 && (
        <Flex justify="center" align="center" gap="3">
          <Button
            variant="soft"
            disabled={page <= 1 || !bookings}
            onClick={() => {
              setPage(page - 1);
              setBookings(null);
            }}
          >
            Previous
          </Button>
          <Text size="2" color="gray">
            Page {page} of {totalPages}
          </Text>
          <Button
            variant="soft"
            disabled={page >= totalPages || !bookings}
            onClick={() => {
              setPage(page + 1);
              setBookings(null);
            }}
          >
            Next
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
