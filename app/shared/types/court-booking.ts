import type { SportType } from "./court";

export const ALLOWED_BOOKING_MINUTES = [60, 120] as const;

export type BookingMinutes = (typeof ALLOWED_BOOKING_MINUTES)[number];

export type CourtBooking = {
  id: string;
  userId: string;
  courtId: string;
  startDatetime: string;
  minutes: number;
  createdAt: string;
};

/** Public view of a booking: only the occupied slot, no user data. */
export type CourtBookingSlot = Pick<CourtBooking, "startDatetime" | "minutes">;

export type CreateCourtBookingDTO = {
  courtId: string;
  /** ISO datetime, UTC */
  startDatetime: string;
  minutes: BookingMinutes;
};

export type DateRangeQueryDTO = {
  /** Inclusive start of the range, ISO datetime, UTC */
  from: string;
  /** Exclusive end of the range, ISO datetime, UTC */
  to: string;
};

export type CourtFilterQueryDTO = {
  /** Only include this court */
  courtId?: string;
};

export type SummaryQueryDTO = CourtFilterQueryDTO & {
  /** First day, inclusive, UTC (YYYY-MM-DD) */
  from: string;
  /** Last day, inclusive, UTC (YYYY-MM-DD) */
  to: string;
};

export type BookingSummary = {
  id: string;
  userId: string;
  userName: string;
  startDatetime: string;
  minutes: number;
  price: string;
};

export type CourtDaySummary = {
  id: string;
  name: string;
  sportType: SportType;
  hourlyPrice: string;
  totalPrice: number;
  bookings: BookingSummary[];
};

export type DaySummary = {
  date: string;
  totalPrice: number;
  courts: CourtDaySummary[];
};
