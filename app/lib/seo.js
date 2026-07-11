export const SITE_URL = "https://mohamedtalat.com";
export const SUPPORTED_LOCALES = ["ar", "en"];
export const DEFAULT_LOCALE = "ar";

export function getLocalizedPath(locale, path = "") {
  const cleanPath = path && path !== "/" ? `/${path.replace(/^\/+/, "")}` : "";
  return `/${locale}${cleanPath}`;
}

export function getCanonicalUrl(locale, path = "") {
  return `${SITE_URL}${getLocalizedPath(locale, path)}`;
}

export function getLanguageAlternates(pathByLocale = {}) {
  const arPath = pathByLocale.ar || "";
  const enPath = pathByLocale.en || arPath;

  return {
    ar: `${SITE_URL}${getLocalizedPath("ar", arPath)}`,
    en: `${SITE_URL}${getLocalizedPath("en", enPath)}`,
    "x-default": SITE_URL,
  };
}
