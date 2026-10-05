import { useEffect, useRef } from "react";
import {
  BookingEvent,
  createBookingsSocket,
} from "~/services/socket/court-bookings.socket";
import type { CourtBookingSlot } from "~/shared/types";

export function useCourtBookingsLive(
  courtId: string,
  onCreated: (slot: CourtBookingSlot) => void,
) {
  const handler = useRef(onCreated);
  handler.current = onCreated;

  useEffect(() => {
    if (!courtId) return;
    const socket = createBookingsSocket();

    const subscribe = () => socket.emit(BookingEvent.SUBSCRIBE, courtId);
    const created = (slot: CourtBookingSlot) => {
      handler.current(slot);
      console.log("Slot:", slot);
    };

    socket.on("connect", subscribe);
    socket.on(BookingEvent.CREATED, created);

    return () => {
      socket.off("connect", subscribe);
      socket.off(BookingEvent.CREATED, created);
      socket.emit(BookingEvent.UNSUBSCRIBE, courtId);
      socket.disconnect();
    };
  }, [courtId]);
}
