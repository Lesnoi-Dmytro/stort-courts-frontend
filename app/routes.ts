import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { Paths } from "./shared/const/paths";

export default [
  index("routes/root.tsx"),

  layout("routes/layouts/auth.tsx", [
    route(Paths.SIGN_IN, "routes/auth/sign-in.tsx"),
    route(Paths.SIGN_UP, "routes/auth/sign-up.tsx"),
  ]),

  layout("routes/layouts/main.tsx", [
    route(Paths.COURTS, "routes/courts/courts.tsx"),
    route(Paths.COURT_NEW, "routes/courts/court-new.tsx"),
    route(Paths.BOOKINGS, "routes/bookings/bookings.tsx"),
    route(Paths.COURT_ROUTE, "routes/courts/court.tsx"),
  ]),
] satisfies RouteConfig;
