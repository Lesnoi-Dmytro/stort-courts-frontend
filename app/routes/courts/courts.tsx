import type { Route } from "./+types/courts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Courtly" },
    { name: "description", content: "Sports Facility Booking Platform" },
  ];
}

export default function Courts() {
  return <>Courts</>;
}
