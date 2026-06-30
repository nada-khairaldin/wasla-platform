const API_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Date-only string in YYYY-MM-DD format for API payloads. */
export type ApiDateString = string;

export function isApiDateString(value: string): boolean {
  return API_DATE_PATTERN.test(value);
}

/** Parses YYYY-MM-DD as a local calendar date (avoids UTC shift). */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a value as YYYY-MM-DD for API payloads.
 * Accepts date input values or Date objects; never includes time or timezone.
 */
export function toApiDateString(value: Date | string): ApiDateString {
  if (typeof value === "string" && isApiDateString(value)) {
    return value;
  }

  const date = typeof value === "string" ? parseLocalDate(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns tomorrow's date as YYYY-MM-DD in the local timezone. */
export function getTomorrowApiDateString(): ApiDateString {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toApiDateString(tomorrow);
}
