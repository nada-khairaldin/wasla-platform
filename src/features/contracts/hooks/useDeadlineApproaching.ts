import { useEffect, useState } from "react";
import { isDeadlineApproaching } from "../utils/deadlineUtils";

const RECALC_INTERVAL_MS = 30_000;

/**
 * Re-evaluates the 24-hour deadline window whenever the end date changes
 * and on a short interval so the warning appears/disappears without stale state.
 */
export function useDeadlineApproaching(
  contractEndDate: string | null | undefined
): boolean {
  const [approaching, setApproaching] = useState(() =>
    isDeadlineApproaching(contractEndDate)
  );

  useEffect(() => {
    const recalculate = () => {
      setApproaching(isDeadlineApproaching(contractEndDate));
    };

    recalculate();

    if (!contractEndDate) return;

    const intervalId = window.setInterval(recalculate, RECALC_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [contractEndDate]);

  return approaching;
}
