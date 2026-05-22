import { OperationLogEntry } from "../contract.types";

interface OperationsLogProps {
  logs: OperationLogEntry[];
}

export function OperationsLog({ logs }: OperationsLogProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#c8cbce]/30 shadow-sm p-5 h-full"
      dir="rtl"
    >
      <h4 className="text-base font-bold text-[#202529] mb-4">سجل العمليات</h4>

      <ul className="flex flex-col gap-5">
        {logs.map((log) => (
          <li key={log.id} className="flex items-start gap-3">
            {/* Bullet */}
            <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#215479]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-sm font-semibold text-[#202529] leading-snug">
                {log.title}
              </p>
              <p className="text-[11px] text-[#888e95] leading-relaxed">
                {log.byLine}
              </p>
              {log.description && (
                <p className="text-[11px] text-[#adb2b6] leading-relaxed mt-0.5">
                  {log.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}