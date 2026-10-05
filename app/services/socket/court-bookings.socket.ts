import { io, type Socket } from "socket.io-client";

export const BookingEvent = {
  SUBSCRIBE: "court:subscribe",
  UNSUBSCRIBE: "court:unsubscribe",
  CREATED: "booking:created",
} as const;

const protocol = import.meta.env.VITE_API_SECURE === "true" ? "https" : "http";

export const createBookingsSocket = (): Socket =>
  io(`${protocol}://${import.meta.env.VITE_API_ORIGIN}`, {
    withCredentials: true,
  });
