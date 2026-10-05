import { CreateCourt } from "~/features/courts/create/CreateCourt";
import type { Route } from "./+types/court-new";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New court | Courtly" }];
}

export default function CourtNew() {
  return <CreateCourt />;
}
