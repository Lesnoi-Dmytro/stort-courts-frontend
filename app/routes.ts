import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { Paths } from "./shared/const/paths";

export default [
  index("routes/root.tsx"),

  layout("routes/layouts/main.tsx", [
    route(Paths.COURTS, "routes/courts/courts.tsx"),
  ]),
] satisfies RouteConfig;
