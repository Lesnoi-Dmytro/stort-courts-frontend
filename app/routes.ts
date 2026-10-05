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
  ]),
] satisfies RouteConfig;
