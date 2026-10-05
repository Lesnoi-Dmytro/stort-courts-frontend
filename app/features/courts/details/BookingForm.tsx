import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Select, Skeleton, Text } from "@radix-ui/themes";
import { startOfDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  courtBookingSchema,
  type CourtBookingValues,
} from "~/schemas/court-booking";
import { CourtBookingsService } from "~/services/http";
import type { DateRange } from "~/shared/components/date-picker/DateCalendar";
import { DatePicker } from "~/shared/components/date-picker/DatePicker";
import { FormField } from "~/shared/components/forms/FormField";
import { formatLocalTime, MINUTE, startOfUtcDay } from "~/shared/lib/date";
import { showApiError } from "~/shared/lib/show-api-error";
import {
  ALLOWED_BOOKING_MINUTES,
  type BookingMinutes,
  type Court,
  type CourtBookingSlot,
} from "~/shared/types";
import {
  getFreeStarts,
  getFullyBookedDays,
  groupBookingsByDay,
} from "./utils/booking-slots";

const MAX_BOOKING_MS = Math.max(...ALLOWED_BOOKING_MINUTES) * MINUTE;

type BookingRange = { from: number; to: number };

const formatDuration = (minutes: number) =>
  minutes % 60 === 0 ? `${minutes / 60} h` : `${minutes} min`;

export function BookingForm({
  court,
  onBooked,
}: {
  court: Court;
  onBooked?: () => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourtBookingValues>({
    resolver: zodResolver(courtBookingSchema),
    defaultValues: { startDatetime: null, minutes: "60" },
  });

  const [day, setDay] = useState<Date | null>(null);
  const [range, setRange] = useState<BookingRange | null>(null);

  const [bookings, setBookings] = useState<CourtBookingSlot[] | null>(null);

  const minutes = Number(watch("minutes"));
  const startDatetime = watch("startDatetime");
  const price = (Number(court.hourlyPrice) * minutes) / 60;

  const onVisibleRangeChange = ({ start, end }: DateRange) =>
    setRange({
      // Start a little earlier to catch a booking running into the first day.
      from: Math.max(
        start.getTime() - MAX_BOOKING_MS,
        startOfUtcDay(Date.now()),
      ),
      to: end.getTime() + 1,
    });

  const loadBookings = useCallback(
    async (target: BookingRange, signal?: AbortSignal) => {
      if (target.to <= target.from) {
        setBookings([]);
        return;
      }

      try {
        setBookings(
          await CourtBookingsService.findByCourt(
            court.id,
            {
              from: new Date(target.from).toISOString(),
              to: new Date(target.to).toISOString(),
            },
            { signal },
          ),
        );
      } catch (error) {
        if (signal?.aborted) return;
        setBookings([]);
        showApiError(error, { title: "Failed to load booked slots" });
      }
    },
    [court.id],
  );

  useEffect(() => {
    if (!range) return;
    const controller = new AbortController();

    setBookings(null);
    loadBookings(range, controller.signal);

    return () => controller.abort();
  }, [range, loadBookings]);

  const bookingsByDay = useMemo(
    () => groupBookingsByDay(bookings ?? []),
    [bookings],
  );

  const disabledDates = useMemo(
    () => getFullyBookedDays(court, bookingsByDay).map((ms) => new Date(ms)),
    [court, bookingsByDay],
  );

  const freeStarts = useMemo(() => {
    if (!day || !bookings) return [];
    return getFreeStarts(
      court,
      startOfDay(day).getTime(),
      bookingsByDay,
      minutes,
    );
  }, [court, day, bookings, bookingsByDay, minutes]);

  useEffect(() => {
    if (startDatetime && !freeStarts.includes(startDatetime.getTime())) {
      setValue("startDatetime", null);
    }
  }, [freeStarts, startDatetime, setValue]);

  const submit = async ({ startDatetime, minutes }: CourtBookingValues) => {
    if (!startDatetime) return;
    try {
      await CourtBookingsService.create({
        courtId: court.id,
        startDatetime: startDatetime.toISOString(),
        minutes: Number(minutes) as BookingMinutes,
      });
      toast.success("Court booked");
      onBooked?.();
      reset();
      setDay(null);
    } catch (error) {
      showApiError(error, { title: "Failed to book court" });
    }
    if (range) await loadBookings(range);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Flex direction="column" gap="4">
        <Flex gap="3">
          <div className="flex-1">
            <FormField label="Date" htmlFor="bookingDate">
              <DatePicker
                id="bookingDate"
                mode="date"
                minDate={new Date()}
                disabledDates={disabledDates}
                onVisibleRangeChange={onVisibleRangeChange}
                value={day}
                onChange={(next) => {
                  setDay(next);
                  setValue("startDatetime", null);
                }}
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField
              label="Duration"
              htmlFor="minutes"
              error={errors.minutes?.message}
            >
              <Controller
                control={control}
                name="minutes"
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger id="minutes" className="w-full" />
                    <Select.Content>
                      {ALLOWED_BOOKING_MINUTES.map((m) => (
                        <Select.Item key={m} value={String(m)}>
                          {formatDuration(m)}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </FormField>
          </div>
        </Flex>

        <FormField
          label="Start time"
          htmlFor="startTimes"
          error={errors.startDatetime?.message}
        >
          <div id="startTimes">
            {!day ? (
              <Text size="2" color="gray">
                Pick a date to see available times.
              </Text>
            ) : !bookings ? (
              <Skeleton height="32px" />
            ) : freeStarts.length === 0 ? (
              <Text size="2" color="gray">
                No free times for this duration on that day.
              </Text>
            ) : (
              <Flex wrap="wrap" gap="2">
                {freeStarts.map((start) => {
                  const selected = startDatetime?.getTime() === start;
                  return (
                    <Button
                      key={start}
                      type="button"
                      size="2"
                      variant={selected ? "solid" : "soft"}
                      aria-pressed={selected}
                      onClick={() =>
                        setValue("startDatetime", new Date(start), {
                          shouldValidate: true,
                        })
                      }
                    >
                      {formatLocalTime(start)}
                    </Button>
                  );
                })}
              </Flex>
            )}
          </div>
        </FormField>

        <Flex justify="between" align="center" gap="3">
          <Text size="3" weight="medium">
            Total: ${price.toFixed(2)}
          </Text>
          <Button type="submit" loading={isSubmitting}>
            Book court
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
