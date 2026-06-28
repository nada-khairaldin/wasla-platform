"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Info,
  Workflow,
  Play,
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BarChart3,
  Trophy,
  Scale,
  User,
  UserX,
  Calendar,
  Star,
  Lock,
  Timer,
  ChevronDown
} from "lucide-react";

interface ContractHowItWorksBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onShowDetails?: () => void;
}

export function ContractHowItWorksBottomSheet({
  isOpen,
  onClose,
  onShowDetails
}: ContractHowItWorksBottomSheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [expandedCard, setExpandedCard] = useState<"client" | "provider" | null>(null);

  if (!isOpen || typeof window === "undefined") return null;

  const toggleCard = (card: "client" | "provider") => {
    setExpandedCard((prev) => (prev === card ? null : card));
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center md:p-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm animate-in fade-in duration-300 z-10"
        onClick={onClose}
      />

      {/* Bottom Sheet / Modal */}
      <div className="relative bg-white w-full h-[92vh] md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-[32px] rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col z-20">
        
        {/* Handle for mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden absolute top-0 left-0 right-0 z-30">
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full" />
        </div>

        {/* Header - Sticky */}
        <div className="p-5 md:p-6 pt-8 md:pt-6 text-center border-b border-neutral-100 relative shrink-0 bg-white md:rounded-t-[32px] rounded-t-[32px]">
          <button
            type="button"
            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-neutral-50 text-neutral-400 rounded-full hover:bg-neutral-100 transition-all active:scale-90 z-30"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
              <Info size={24} />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 font-cairo">
              كيف يعمل العقد في Wasla
            </h2>
          </div>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            شرح مبسط يساعدك على فهم مراحل العقد وكيف يتم ضمان حقوق الطرفين بشكل عادل.
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-10 custom-scrollbar bg-neutral-50/30">
          
          {/* Section 1: Workflow */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Workflow size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">متابعة تنفيذ العمل</h3>
            </div>
            
            <p className="text-neutral-500 text-sm">يتم تنفيذ الخدمة على شكل جلسات عمل متتابعة:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"><Play size={16} /></div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm mb-1">1. تنفيذ الجلسة</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">يقوم مقدم الخدمة بتنفيذ العمل المطلوب في الجلسة.</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0"><FilePlus size={16} /></div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm mb-1">2. تسجيل الجلسة</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">يتم تسجيل الجلسة بعد التنفيذ مع عدد الساعات.</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0"><Clock size={16} /></div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm mb-1">3. انتظار المراجعة</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">تبقى الجلسة بانتظار مراجعة طالب الخدمة.</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex -space-x-2 -space-x-reverse shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 z-10 border-2 border-white"><CheckCircle2 size={16} /></div>
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border-2 border-white"><XCircle size={16} /></div>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm mb-1">4. التأكيد أو الرفض</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">عند التأكيد يتم اعتماد الساعات، وعند الرفض لا تُحتسب.</p>
                </div>
              </div>
            </div>
            
            {/* Highlight Box */}
            <div className="bg-amber-50/50 border border-amber-100 text-amber-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="shrink-0 text-amber-500" size={24} />
              <p className="text-sm font-bold">الساعات لا تُحتسب إلا بعد التأكيد لضمان العدالة</p>
            </div>
          </section>

          {/* Section 2: Stats */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">التتبع داخل العقد</h3>
            </div>
            
            <p className="text-neutral-500 text-sm">يمكنك دائمًا معرفة حالة العمل من خلال:</p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-neutral-100 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xs sm:text-sm font-bold text-neutral-800">المنفذة</div>
              </div>
              <div className="bg-white border border-neutral-100 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xs sm:text-sm font-bold text-neutral-800">المؤكدة</div>
              </div>
              <div className="bg-white border border-neutral-100 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xs sm:text-sm font-bold text-neutral-800">المعلقة</div>
              </div>
            </div>
          </section>

          {/* Section 3: Completion */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Trophy size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">عند اكتمال العقد</h3>
            </div>
            <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl">
                <p className="text-emerald-900 font-bold text-sm mb-3">إذا تم تنفيذ جميع الساعات وتأكيدها:</p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16} /> يتم اعتبار العقد مكتملًا بنجاح</li>
                    <li className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16} /> يحصل مقدم الخدمة على مستحقاته</li>
                    <li className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16} /> يتم إغلاق العقد</li>
                </ul>
            </div>
          </section>

          {/* Section 4: Scale/Delay */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <Scale size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">عندما لا تكتمل الساعات</h3>
            </div>
            
            <div className="space-y-3">
              {/* Card 1: Delay from Client */}
              <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedCard === 'client' ? 'border-primary-200 shadow-md' : 'border-neutral-200'}`}>
                <button onClick={() => toggleCard('client')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors text-right">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-neutral-800 text-sm md:text-base">تأخير من طالب الخدمة</span>
                  </div>
                  <ChevronDown className={`text-neutral-400 transition-transform duration-300 ${expandedCard === 'client' ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 bg-white ${expandedCard === 'client' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 pt-0 space-y-4 border-t border-neutral-50 mt-2">
                    <p className="text-sm text-neutral-600 leading-relaxed font-medium">إذا تم تنفيذ جلسات ولكن لم يتم تأكيدها من قبل طالب الخدمة:</p>
                    <ul className="list-disc list-inside text-sm text-neutral-600 space-y-2">
                      <li>يتم اعتماد المؤكد فقط</li>
                      <li>يتم إرجاع غير المؤكد</li>
                    </ul>
                    <div className="bg-primary-50 p-3.5 rounded-xl flex gap-3 items-start">
                      <Info size={18} className="text-primary-600 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-bold text-primary-800 leading-relaxed">نضمن حق مقدم الخدمة لأنه نفذ العمل بالكامل.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Delay from Provider */}
              <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedCard === 'provider' ? 'border-primary-200 shadow-md' : 'border-neutral-200'}`}>
                <button onClick={() => toggleCard('provider')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors text-right">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                        <UserX size={20} />
                      </div>
                      <span className="font-bold text-neutral-800 text-sm md:text-base">تأخير من مقدم الخدمة</span>
                  </div>
                  <ChevronDown className={`text-neutral-400 transition-transform duration-300 ${expandedCard === 'provider' ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 bg-white ${expandedCard === 'provider' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 pt-0 space-y-4 border-t border-neutral-50 mt-2">
                    <p className="text-sm text-neutral-600 leading-relaxed font-medium">إذا لم يتم تقديم الساعات بالكامل من قبل مقدم الخدمة:</p>
                    <ul className="list-disc list-inside text-sm text-neutral-600 space-y-2">
                      <li>يتم إرجاع كامل الساعات المتبقية لطالب الخدمة</li>
                    </ul>
                    <div className="bg-primary-50 p-3.5 rounded-xl flex gap-3 items-start">
                      <Info size={18} className="text-primary-600 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-bold text-primary-800 leading-relaxed">نضمن حق طالب الخدمة لأنه لم يحصل على الخدمة كاملة.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Extension */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">التمديد</h3>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <p className="text-sm text-neutral-600 font-medium">
                    يمكن لمقدم الخدمة طلب تمديد العقد إذا لزم الأمر، ويقوم طالب الخدمة بالموافقة أو الرفض.
                </p>
                <div className="flex items-center gap-4 pt-2">
                    <div className="flex-1 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center">
                        <span className="block text-xs font-bold mb-1 opacity-70">عند الموافقة</span>
                        <span className="text-sm font-bold">يتم التمديد</span>
                    </div>
                    <div className="flex-1 bg-neutral-100 text-neutral-600 p-3 rounded-xl text-center">
                        <span className="block text-xs font-bold mb-1 opacity-70">عند الرفض</span>
                        <span className="text-sm font-bold">يبقى الموعد</span>
                    </div>
                </div>
            </div>
          </section>

          {/* Section 6: Rating */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                <Star size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">التقييم الإجباري</h3>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
               <span className="text-sm text-neutral-700 font-medium">بعد انتهاء العقد</span>
               <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Star size={14} className="fill-yellow-500" /> تقييم إلزامي للطرفين يضمن الشفافية
               </div>
            </div>
          </section>

          {/* Section 7: Summary */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                <Info size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">الفكرة الأساسية</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 md:p-4 rounded-2xl border border-neutral-100 shadow-sm text-center flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Lock size={16} /></div>
                 <span className="text-xs md:text-sm font-bold text-neutral-700">الساعات تُحسب بعد التأكيد</span>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-2xl border border-neutral-100 shadow-sm text-center flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Scale size={16} /></div>
                 <span className="text-xs md:text-sm font-bold text-neutral-700">العدالة حسب الالتزام الفعلي</span>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-2xl border border-neutral-100 shadow-sm text-center flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center"><Timer size={16} /></div>
                 <span className="text-xs md:text-sm font-bold text-neutral-700">الحسم عند انتهاء المدة</span>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-2xl border border-neutral-100 shadow-sm text-center flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center"><Star size={16} /></div>
                 <span className="text-xs md:text-sm font-bold text-neutral-700">التقييم إلزامي للطرفين</span>
              </div>
            </div>
          </section>

          {/* Bottom spacing to ensure clear scroll area above footer */}
          <div className="h-4" />
        </div>

        {/* Footer - Sticky */}
        <div className="p-5 md:p-6 bg-white border-t border-neutral-100 md:rounded-b-[32px] shrink-0 pb-safe">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-cairo font-bold transition-all active:scale-95 text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
            >
              فهمت
            </button>
            <button
              type="button"
              onClick={() => {
                if (onShowDetails) onShowDetails();
                else onClose();
              }}
              className="flex-[2] py-4 rounded-2xl font-cairo font-bold transition-all active:scale-95 text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20"
            >
              عرض التفاصيل الكاملة
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
