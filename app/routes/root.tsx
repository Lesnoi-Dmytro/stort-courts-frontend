import { redirect } from "react-router";
import { DEFAULT_PATH } from "~/shared/const/paths";

export function loader() {
  return redirect(DEFAULT_PATH);
}
