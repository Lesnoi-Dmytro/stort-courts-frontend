import { Card, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { endOfDay, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { CourtBookingsService } from "~/services/http";
import { DatePicker } from "~/shared/components/date-picker/DatePicker";
import { DEFAULT_PATH } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { showApiError } from "~/shared/lib/show-api-error";
import { UserRole, type CourtDaySummary } from "~/shared/types";
import { SummaryRows } from "./SummaryRows";

export function DaySummaryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [day, setDay] = useState<Date>(() => new Date());
  const [courts, setCourts] = useState<CourtDaySummary[] | undefined>();

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!isAdmin) return;
    const controller = new AbortController();

    const load = async () => {
      setCourts(undefined);
      try {
        const from = startOfDay(day).getTime();
        const to = endOfDay(day).getTime();
        const data = await CourtBookingsService.getDaySummary(
          {
            from: new Date(from).toISOString().slice(0, 10),
            to: new Date(to).toISOString().slice(0, 10),
          },
          { signal: controller.signal },
        );
        setCourts(
          data.courts.map((court) => {
            const bookings = court.bookings
              .filter((b) => {
                const start = Date.parse(b.startDatetime);
                return start >= from && start <= to;
              })
              .sort(
                (a, b) =>
                  Date.parse(a.startDatetime) - Date.parse(b.startDatetime),
              );
            return {
              ...court,
              bookings,
              totalPrice: bookings.reduce((sum, b) => sum + Number(b.price), 0),
            };
          }),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setCourts([]);
        showApiError(error, { title: "Failed to load the summary" });
      }
    };

    load();
    return () => controller.abort();
  }, [isAdmin, day]);

  if (isAuthLoading) return <Skeleton height="120px" />;
  if (!isAdmin) return <Navigate to={DEFAULT_PATH} replace />;

  const activeCourts = courts?.filter((c) => c.bookings.length > 0) ?? [];
  const totalBookings = activeCourts.reduce((n, c) => n + c.bookings.length, 0);
  const totalPrice = activeCourts.reduce((sum, c) => sum + c.totalPrice, 0);

  return (
    <Flex
      direction="column"
      gap="5"
      className="mx-auto min-h-0 w-full max-w-xl flex-1"
    >
      <Heading as="h1" size="7">
        Day summary
      </Heading>

      <DatePicker
        mode="date"
        value={day}
        onChange={(next) => next && setDay(next)}
      />

      {courts === undefined ? (
        <Skeleton height="120px" />
      ) : activeCourts.length === 0 ? (
        <Text color="gray">No bookings on this day.</Text>
      ) : (
        <>
          <Card>
            <Flex justify="between" align="center">
              <Flex direction="column">
                <Text size="2" color="gray">
                  Total income
                </Text>
                <Text size="6" weight="bold">
                  ${totalPrice.toFixed(2)}
                </Text>
              </Flex>
              <Text size="2" color="gray">
                {totalBookings} {totalBookings === 1 ? "booking" : "bookings"}
              </Text>
            </Flex>
          </Card>

          <SummaryRows courts={activeCourts} />
        </>
      )}
    </Flex>
  );
}
