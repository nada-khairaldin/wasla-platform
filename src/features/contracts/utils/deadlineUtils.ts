import { parseLocalDate } from "@/src/utils/date";

/** Show the warning when the contract end is within this many milliseconds. */
export const DEADLINE_APPROACHING_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/**
 * Resolves the contract maximum end date to an absolute instant.
 * Date-only values (YYYY-MM-DD) are treated as end of that local calendar day.
 */
export function parseContractEndDateTime(endDate: string): Date {
  const dateOnly = endDate.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly) && !endDate.includes("T")) {
    const endOfDay = parseLocalDate(dateOnly);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  return new Date(endDate);
}

/** Milliseconds from `now` until the contract end (negative if already past). */
export function millisecondsUntilDeadline(
  endDate: string | Date,
  now: Date = new Date()
): number {
  const deadline =
    typeof endDate === "string" ? parseContractEndDateTime(endDate) : endDate;
  return deadline.getTime() - now.getTime();
}

/** True when the contract end is in the future and within the 24-hour threshold. */
export function isDeadlineApproaching(
  endDate: string | null | undefined,
  now: Date = new Date(),
  thresholdMs: number = DEADLINE_APPROACHING_THRESHOLD_MS
): boolean {
  if (!endDate) return false;

  const remainingMs = millisecondsUntilDeadline(endDate, now);
  return remainingMs > 0 && remainingMs <= thresholdMs;
}
