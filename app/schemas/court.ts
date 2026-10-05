import { z } from "zod";
import { SportType } from "~/shared/types";

const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Enter a valid time");

// The closing hour may be earlier than the opening hour: that means the court
// closes the next day.
export const courtSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  sportType: z.enum(Object.values(SportType) as [SportType, ...SportType[]]),
  hourlyPrice: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price, e.g. 25 or 25.50")
    .refine((v) => Number(v) > 0, "Price must be greater than 0"),
  openingHour: time,
  closingHour: time,
});

export type CourtValues = z.infer<typeof courtSchema>;
