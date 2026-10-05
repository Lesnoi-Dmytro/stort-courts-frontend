import { StorageKeys } from "~/shared/const/storageKeys";

export type Theme = "light" | "dark" | "system";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(StorageKeys.THEME);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

export function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" || (theme === "system" && matchMedia(DARK_QUERY).matches);
  const { classList } = document.documentElement;
  classList.remove("light", "dark");
  classList.add(isDark ? "dark" : "light");
}

export function storeTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(StorageKeys.THEME);
    else localStorage.setItem(StorageKeys.THEME, theme);
  } catch {}
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${StorageKeys.THEME}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}})()`;
