export const SUBSCRIPTION_PRICE_EGP = 1000;
export const SUBSCRIPTION_PRICE_LABEL = "١٠٠٠ جنيه";
export const VODAFONE_CASH_NUMBER = "01023645480";
export const VODAFONE_CASH_LABEL = "فودافون كاش";

export function hasFullAccess(plan: string | null | undefined, role?: string | null) {
  return role === "admin" || plan === "premium";
}

export function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

export function normalizeEgyptianPhone(value: string) {
  let digits = normalizeDigits(value).replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("20") && digits.length === 12) digits = `0${digits.slice(2)}`;
  return digits;
}

export function normalizeTransactionRef(value: string) {
  return normalizeDigits(value).replace(/[\s-]/g, "").toUpperCase();
}

export function isEgyptianMobile(value: string) {
  return /^01[0125]\d{8}$/.test(value);
}
