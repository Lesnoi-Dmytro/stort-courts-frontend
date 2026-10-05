import { CourtDetails } from "~/features/courts/details/CourtDetails";
import type { Route } from "./+types/court";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Court | Courtly" }];
}

export default function Court() {
  return <CourtDetails />;
}
