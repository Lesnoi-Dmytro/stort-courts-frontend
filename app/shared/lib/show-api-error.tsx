import axios from "axios";
import { toast } from "react-toastify";

type ShowApiErrorOptions = {
  title?: string;
  fallback?: string;
  ignoreCancelled?: boolean;
};

function getMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Unable to reach the server";

  const message = error.response.data?.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") {
    return message[0];
  }
  return fallback;
}

export function showApiError(
  error: unknown,
  {
    title,
    fallback = "Something went wrong",
    ignoreCancelled = true,
  }: ShowApiErrorOptions = {},
) {
  if (ignoreCancelled && axios.isCancel(error)) return;

  const message = getMessage(error, fallback);

  toast.error(
    title ? (
      <div>
        <div className="font-semibold">{title}</div>
        <div>{message}</div>
      </div>
    ) : (
      message
    ),
  );
}
