import { addDays, startOfDay } from "date-fns";
import {
  DAY,
  HOUR,
  MINUTE,
  startOfUtcDay,
  timeToMinutes,
} from "~/shared/lib/date";
import type { Court, CourtBookingSlot } from "~/shared/types";

type Interval = readonly [start: number, end: number];

const overlap = (a: Interval, b: Interval) =>
  Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

const bookingInterval = (b: CourtBookingSlot): Interval => {
  const start = Date.parse(b.startDatetime);
  return [start, start + b.minutes * MINUTE];
};

const localDay = (ms: number): Interval => {
  const start = startOfDay(ms);
  return [start.getTime(), addDays(start, 1).getTime()];
};

export const getOpenMinutes = (court: Court) =>
  (timeToMinutes(court.closingHour) - timeToMinutes(court.openingHour) + 1440) %
    1440 || 1440;

function getOpenWindows(court: Court, [from, to]: Interval): Interval[] {
  const offset = timeToMinutes(court.openingHour) * MINUTE;
  const length = getOpenMinutes(court) * MINUTE;
  const windows: Interval[] = [];
  for (let day = startOfUtcDay(from) - DAY; day < to; day += DAY) {
    const start = day + offset;
    if (start + length > from && start < to) {
      windows.push([start, start + length]);
    }
  }
  return windows;
}

export function groupBookingsByDay(
  bookings: CourtBookingSlot[],
): Record<number, CourtBookingSlot[]> {
  const byDay: Record<number, CourtBookingSlot[]> = {};
  for (const booking of bookings) {
    const [start, end] = bookingInterval(booking);
    for (
      let day = startOfDay(start);
      day.getTime() < end;
      day = addDays(day, 1)
    ) {
      (byDay[day.getTime()] ??= []).push(booking);
    }
  }
  return byDay;
}

/** Local days (midnight ms) whose booked time covers all of their open time. */
export function getFullyBookedDays(
  court: Court,
  bookingsByDay: Record<number, CourtBookingSlot[]>,
): number[] {
  return Object.entries(bookingsByDay)
    .filter(([key, dayBookings]) => {
      const day = localDay(Number(key));
      const open = sum(
        getOpenWindows(court, day).map((window) => overlap(window, day)),
      );
      const booked = sum(
        dayBookings.map((b) => overlap(bookingInterval(b), day)),
      );
      return booked >= open;
    })
    .map(([key]) => Number(key));
}

export function getFreeStarts(
  court: Court,
  dayStart: number,
  bookingsByDay: Record<number, CourtBookingSlot[]>,
  minutes: number,
  now = Date.now(),
): number[] {
  const day = localDay(dayStart);
  const busy = [
    ...(bookingsByDay[day[0]] ?? []),
    ...(bookingsByDay[day[1]] ?? []),
  ].map(bookingInterval);

  const starts: number[] = [];
  for (const [windowStart, windowEnd] of getOpenWindows(court, day)) {
    for (
      let s = windowStart;
      s < day[1] && s + minutes * MINUTE <= windowEnd;
      s += HOUR
    ) {
      const end = s + minutes * MINUTE;
      if (s < day[0] || s <= now) continue;
      if (busy.some(([bs, be]) => bs < end && be > s)) continue;
      starts.push(s);
    }
  }
  return starts;
}
