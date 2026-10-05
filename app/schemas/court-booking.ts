import { isFuture } from "date-fns";
import { z } from "zod";
import { ALLOWED_BOOKING_MINUTES } from "~/shared/types";

export const courtBookingSchema = z.object({
  startDatetime: z
    .date()
    .nullable()
    .superRefine((d, ctx) => {
      if (d === null)
        ctx.addIssue({ code: "custom", message: "Pick a start time" });
      else if (!isFuture(d))
        ctx.addIssue({
          code: "custom",
          message: "Start time must be in the future",
        });
    }),
  // Kept as a string because Radix Select values are strings.
  minutes: z.enum(ALLOWED_BOOKING_MINUTES.map(String) as [string, ...string[]]),
});

export type CourtBookingValues = z.infer<typeof courtBookingSchema>;
