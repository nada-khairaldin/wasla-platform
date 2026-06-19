import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hours: number, notes: string) => void;
}

export function AddSessionModal({ isOpen, onClose, onSubmit }: AddSessionModalProps) {
  const [hours, setHours] = useState(1);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(hours, notes);
    setHours(1);
    setNotes("");
  };

  const handleClose = () => {
    setHours(1);
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-right" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-xl overflow-hidden flex flex-col">
        {/* Header content outside of white container in image? No, image shows it on white bg. */}
        <div className="p-8 pb-6 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm font-bold text-[#215077] mb-2">
            <span>عقودي</span>
            <span className="text-neutral-400">›</span>
            <span>إضافة جلسة</span>
          </div>
          <h2 className="text-3xl font-black text-[#1a2332]">إضافة جلسة عمل جديدة</h2>
          <p className="text-sm font-medium text-neutral-500">
            يرجى إدخال تفاصيل الساعات المنجزة والملاحظات الخاصة بالجلسة الحالية.
          </p>
        </div>

        {/* Form Fields Container */}
        <div className="px-8 py-6 flex flex-col gap-8 flex-1">
          {/* Field 1: Hours */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-neutral-500">عدد الساعات المنجزة</label>
            <div className="flex items-center bg-[#f0f2f5] rounded-xl h-14 overflow-hidden px-1">
              <button 
                onClick={() => setHours(prev => prev + 1)}
                className="w-12 h-12 flex items-center justify-center bg-[#215077] text-white rounded-lg hover:bg-[#1c4464] transition-colors shrink-0 m-1"
              >
                <Plus size={20} />
              </button>
              
              <div className="flex-1 flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-[#1a2332]">{hours}</span>
                <span className="text-sm font-medium text-neutral-500">ساعات</span>
              </div>

              <button 
                onClick={() => setHours(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 flex items-center justify-center text-[#215077] hover:bg-neutral-200 rounded-lg transition-colors shrink-0 m-1"
              >
                <Minus size={20} />
              </button>
            </div>
          </div>

          <hr className="border-t border-neutral-100" />

          {/* Field 2: Notes */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-neutral-500">ملاحظات اختيارية</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ما الذي تم إنجازه في هذه الجلسة؟"
              className="w-full bg-[#f0f2f5] rounded-xl p-5 min-h-[160px] resize-none outline-none text-sm font-medium text-[#1a2332] placeholder:text-neutral-400 focus:ring-2 focus:ring-[#215077]/20 transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-4 flex items-center gap-4">
          <button 
            onClick={handleSubmit}
            className="flex-1 py-4 bg-[#215077] text-white rounded-full text-base font-bold hover:bg-[#1c4464] active:scale-95 transition-all"
          >
            اضافة الجلسة
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 py-4 bg-white border border-[#215077] text-[#215077] rounded-full text-base font-bold hover:bg-neutral-50 active:scale-95 transition-all"
          >
            الغاء
          </button>
        </div>
      </div>
    </div>
  );
}
