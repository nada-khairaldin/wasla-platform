import { useState } from "react";

interface ProposeDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposedDate: string) => void;
  isSubmitting?: boolean;
  currentEndDate: string;
  seekerName: string;
  contractStatus: string;
}

export function ProposeDeadlineModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentEndDate,
  seekerName,
  contractStatus,
}: ProposeDeadlineModalProps) {
  const [step, setStep] = useState(1);
  const [proposedDate, setProposedDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Tomorrow check
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleContinue = () => {
    setError(null);

    const normalizedStatus = contractStatus?.toUpperCase();
    if (normalizedStatus !== "IN_PROGRESS" && normalizedStatus !== "WAITING_CONFIRMATION") {
      setError("لا يمكن تعديل هذا العقد في حالته الحالية.");
      return;
    }

    if (!proposedDate) {
      setError("يرجى تحديد تاريخ انتهاء مقترح.");
      return;
    }

    const selectedDate = new Date(proposedDate);
    const currentDate = new Date();
    // Reset hours to compare dates only
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate <= currentDate) {
      setError("يجب أن يكون التاريخ المقترح في المستقبل (بدءاً من الغد).");
      return;
    }

    setStep(2);
  };

  const handleConfirmSubmit = () => {
    onSubmit(new Date(proposedDate).toISOString());
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setProposedDate("");
    setError(null);
    setStep(1);
    onClose();
  };

  const formattedSelectedDate = proposedDate
    ? new Date(proposedDate).toLocaleDateString("ar-EG", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-right" 
      dir="rtl"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-[24px] shadow-xl overflow-hidden flex flex-col animate-in fade-in scale-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="p-8 pb-6 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm font-bold text-[#215077] mb-2">
                <span>تفاصيل العقد</span>
                <span className="text-neutral-400">›</span>
                <span>اقتراح تاريخ جديد</span>
              </div>
              <h2 className="text-3xl font-black text-[#1a2332]">اقتراح تاريخ انتهاء جديد</h2>
              <p className="text-sm font-medium text-neutral-500">
                يمكنك اقتراح تاريخ انتهاء جديد للعقد. سيتم إرسال هذا المقترح إلى المستفيد للموافقة عليه.
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 flex flex-col gap-6 flex-1">
              {/* Current End Date Display */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-neutral-500">تاريخ الانتهاء الحالي</label>
                <div className="w-full bg-[#f0f2f5] rounded-xl px-5 py-4 text-sm font-bold text-neutral-600 select-none">
                  {currentEndDate}
                </div>
              </div>

              {/* Date Picker Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-neutral-500">تاريخ الانتهاء المقترح الجديد</label>
                <input
                  type="date"
                  value={proposedDate}
                  min={minDateStr}
                  onChange={(e) => {
                    setProposedDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-[#f0f2f5] rounded-xl px-5 py-4 outline-none text-sm font-bold text-[#1a2332] focus:ring-2 focus:ring-[#215077]/20 transition-all cursor-pointer"
                />
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs font-medium text-[#215077] leading-relaxed">
                سيتم إرسال هذا التعديل للموافقة عليه إلى <span className="font-bold">{seekerName}</span> (المستفيد)
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-in fade-in duration-150">
                  {error}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-8 pt-4 flex items-center gap-4">
              <button
                onClick={handleContinue}
                className="flex-1 py-4 bg-[#215077] text-white rounded-full text-base font-bold hover:bg-[#1c4464] active:scale-95 transition-all"
              >
                استمرار
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-4 bg-white border border-[#215077] text-[#215077] rounded-full text-base font-bold hover:bg-neutral-50 active:scale-95 transition-all"
              >
                الغاء
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2 Confirmation */}
            <div className="p-8 pb-6 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm font-bold text-amber-600 mb-2">
                <span>تأكيد الاقتراح</span>
              </div>
              <h2 className="text-3xl font-black text-[#1a2332]">تأكيد مقترح التاريخ الجديد</h2>
              <p className="text-sm font-medium text-neutral-500">
                يرجى تأكيد رغبتك في اقتراح تاريخ انتهاء جديد لهذا العقد.
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 flex flex-col gap-6 flex-1">
              <p className="text-base font-medium text-neutral-700 leading-relaxed">
                هل أنت متأكد من أنك تريد اقتراح تاريخ الانتهاء الجديد هذا؟
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                  <span>تاريخ الانتهاء الحالي:</span>
                  <span className="text-neutral-700 font-bold">{currentEndDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-neutral-700 border-t border-amber-200/50 pt-2 mt-1">
                  <span>التاريخ المقترح الجديد:</span>
                  <span className="text-[#215077] font-black">{formattedSelectedDate}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 pt-4 flex items-center gap-4">
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#215077] text-white rounded-full text-base font-bold hover:bg-[#1c4464] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "تأكيد الاقتراح"
                )}
              </button>
              <button
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-white border border-[#215077] text-[#215077] rounded-full text-base font-bold hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                تراجع
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
