import { format } from "date-fns";

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Minutes since midnight of an "HH:mm" or "HH:mm:ss" time. */
export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const startOfUtcDay = (ms: number) => Math.floor(ms / DAY) * DAY;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Converts a UTC time of day ("HH:mm" or "HH:mm:ss") to the user's local "HH:mm".
 * The offset is today's, so around a daylight-saving change it can be an hour
 * off for dates on the other side of it.
 */
export const utcTimeToLocal = (time: string) => {
  const minutes = timeToMinutes(time);
  const date = new Date();
  date.setUTCHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return format(date, "HH:mm");
};

/** Inverse of `utcTimeToLocal`: a local "HH:mm" to a UTC "HH:mm". */
export const localTimeToUtc = (time: string) => {
  const minutes = timeToMinutes(time);
  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
};

/** Time of an instant (ms) in the user's local timezone. */
export const formatLocalTime = (ms: number) => format(ms, "HH:mm");
