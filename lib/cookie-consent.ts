export const COOKIE_CONSENT_KEY = "da3waty-cookie-consent";
export type CookieConsent = "accepted" | "rejected";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function writeCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

export function hasAnalyticsConsent() {
  return readCookieConsent() === "accepted";
}
