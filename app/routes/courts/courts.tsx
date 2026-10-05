import { Heading } from "@radix-ui/themes";
import { CourtsList } from "~/features/courts/CourtsList";
import type { Route } from "./+types/courts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Courts | Courtly" },
    { name: "description", content: "Sports Facility Booking Platform" },
  ];
}

export default function Courts() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <Heading as="h1" size="7">
        Courts
      </Heading>
      <CourtsList />
    </div>
  );
}
