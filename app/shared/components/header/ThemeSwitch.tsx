import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { StorageKeys } from "~/shared/const/storageKeys";
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  type Theme,
} from "~/shared/lib/theme";

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const;

export function ThemeSwitch() {
  // Always "system" on first render so server and client markup match.
  const [theme, setTheme] = useState<Theme>("system");

  // Re-apply on mount: the init script only adds a class, and React can reset
  // <html> attributes (e.g. after a hydration recovery), so re-sync the DOM.
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  // Keep other tabs and bfcache restores in sync with the stored preference.
  useEffect(() => {
    const sync = () => {
      const stored = getStoredTheme();
      setTheme(stored);
      applyTheme(stored);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === StorageKeys.THEME) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const change = (value: string) => {
    const next = value as Theme;
    setTheme(next);
    storeTheme(next);
    applyTheme(next);
  };

  const { Icon } = OPTIONS.find((option) => option.value === theme)!;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" color="gray" aria-label="Change theme">
          <Icon size={18} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup value={theme} onValueChange={change}>
          {OPTIONS.map(({ value, label, Icon }) => (
            <DropdownMenu.RadioItem key={value} value={value}>
              <Icon size={16} className="mr-1" />
              {label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
