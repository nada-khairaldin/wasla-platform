import { parseLocalDate } from "@/src/utils/date";

/** Days before contract end date when the "deadline approaching" warning applies. */
export const DEADLINE_APPROACHING_THRESHOLD_DAYS = 7;

function toLocalDay(dateValue: string | Date): Date {
  if (typeof dateValue === "string") {
    const dateOnly = dateValue.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      return parseLocalDate(dateOnly);
    }
    return new Date(dateValue);
  }
  return dateValue;
}

/** Whole calendar days from today until the contract end date (negative if past due). */
export function daysUntilDeadline(endDate: string | Date): number {
  const endDay = toLocalDay(endDate);
  endDay.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((endDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** True when the end date is today or within the approaching threshold (and not past due). */
export function isDeadlineApproaching(
  endDate: string | null | undefined,
  thresholdDays: number = DEADLINE_APPROACHING_THRESHOLD_DAYS
): boolean {
  if (!endDate) return false;
  const days = daysUntilDeadline(endDate);
  return days >= 0 && days <= thresholdDays;
}
