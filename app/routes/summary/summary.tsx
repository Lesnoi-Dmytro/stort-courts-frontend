import { DaySummaryPage } from "~/features/summary/DaySummaryPage";
import type { Route } from "./+types/summary";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Day summary | Courtly" }];
}

export default function Summary() {
  return <DaySummaryPage />;
}
