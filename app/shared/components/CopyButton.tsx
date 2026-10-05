import { IconButton } from "@radix-ui/themes";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const COPIED_TIMEOUT_MS = 1500;

type CopyButtonProps = {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    } catch {
      toast.error("Could not copy to the clipboard");
    }
  };

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <IconButton
      type="button"
      variant="ghost"
      size="1"
      className="shrink-0 text-inherit"
      aria-label={copied ? "Copied" : label}
      onClick={copy}
    >
      <Icon size={12} />
    </IconButton>
  );
}
