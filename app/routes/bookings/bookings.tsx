import { MyBookingsPage } from "~/features/bookings/MyBookingsPage";
import type { Route } from "./+types/bookings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "My bookings | Courtly" }];
}

export default function Bookings() {
  return <MyBookingsPage />;
}
