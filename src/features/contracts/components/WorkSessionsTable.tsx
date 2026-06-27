import { WorkSession, WorkSessionConfirmation } from "../contract.types";

interface WorkSessionsTableProps {
  sessions: WorkSession[];
  totalHours?: number;
}

const statusStyles: Record<WorkSessionConfirmation, string> = {
  مؤكدة:      "text-success-500",
  "غير مؤكدة": "text-warning-500",
  ملغية:      "text-error-500",
  "قيد الانتظار": "text-neutral-500",
};

const COLS = ["التاريخ", "عدد الساعات", "الملاحظات", "الحالة"] as const;

export function WorkSessionsTable({ sessions, totalHours }: WorkSessionsTableProps) {
  const recordedHours = sessions.reduce((acc, s) => acc + s.hours, 0);

  return (
    <div
      className="bg-white rounded-2xl border border-[#c8cbce]/30 shadow-sm overflow-hidden h-full flex flex-col"
      dir="rtl"
    >
      {/* Title */}
      <div className="px-5 pt-5 pb-3">
        <h4 className="text-base font-bold text-[#202529]">جلسات العمل المنجزة</h4>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-4 px-5 py-2 bg-[#edeeef]/50 border-y border-[#edeeef]">
        {COLS.map((col) => (
          <span
            key={col}
            className="text-xs font-semibold text-[#717981] text-center"
          >
            {col}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 divide-y divide-[#edeeef]">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-[#edeeef]/20 transition-colors"
          >

            <span className="text-sm font-semibold text-[#202529] text-center">
              {session.date}
            </span>


            <span className="text-sm text-[#4d5761] text-center">
              {String(session.hours).padStart(2, "0")}
              <span className="text-xs text-[#888e95] mr-0.5">ساعة</span>
            </span>

            <span className="text-xs text-[#717981] text-center truncate px-2">
              {session.notes}
            </span>

            <span
              className={`text-sm font-semibold text-center ${statusStyles[session.status as WorkSessionConfirmation] || "text-neutral-500"}`}
            >
              {session.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#edeeef] bg-[#edeeef]/20">
        <p className="text-xs text-[#888e95] text-center">
          اجمالي المسجل{" "}
          <span className="font-semibold text-[#202529]">
            {String(recordedHours).padStart(2, "0")}
          </span>{" "}
          من اصل{" "}
          <span className="font-semibold text-[#202529]">
            {String(totalHours ?? recordedHours).padStart(2, "0")}
          </span>{" "}
          ساعة
        </p>
      </div>
    </div>
  );
}