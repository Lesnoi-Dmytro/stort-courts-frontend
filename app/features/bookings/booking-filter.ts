export type BookingFilter = "upcoming" | "completed" | "all";

export const BOOKING_FILTER_VALUES: Record<BookingFilter, boolean | undefined> =
  {
    upcoming: false,
    completed: true,
    all: undefined,
  };
