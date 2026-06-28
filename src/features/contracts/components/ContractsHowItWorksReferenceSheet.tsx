"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Info,
  Compass,
  BarChart3,
  Settings,
  Play,
  User,
  FileEdit,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Pin,
  Timer,
  Target,
  Wallet,
  Package,
  Scale,
  AlertTriangle,
  Briefcase,
  Undo2,
  Star,
  Brain,
  Lightbulb,
  ShieldCheck,
  Ban
} from "lucide-react";

interface ContractsHowItWorksReferenceSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContractsHowItWorksReferenceSheet({
  isOpen,
  onClose,
}: ContractsHowItWorksReferenceSheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center md:p-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-300 z-10"
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
              كيف يعمل نظام العقود في Wasla
            </h2>
          </div>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-[500px] mx-auto">
            شرح مبسط يساعدك على فهم طريقة عمل العقود وضمان الحقوق بين الطرفين
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-10 custom-scrollbar bg-neutral-50/30">

          {/* Intro */}
          <section className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
            <Info className="shrink-0 text-blue-500 mt-0.5" size={20} />
            <p className="text-sm font-bold text-blue-900 leading-relaxed">
              هذا الشرح يساعدك على فهم ما يحدث داخل العقد خطوة بخطوة، وكيف يتم ضمان حقوق الطرفين بشكل عادل.
            </p>
          </section>

          {/* Section 1: Workflow */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">متابعة تنفيذ العمل</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
              <Settings size={16} className="text-neutral-400" /> يتم تنفيذ الخدمة على شكل جلسات عمل متتابعة.
            </div>
            <p className="text-neutral-500 text-xs font-bold">كل جلسة تمر بالخطوات التالية:</p>

            <div className="space-y-3 mt-2">
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Play size={16} className="text-blue-500" />
                  <h4 className="font-bold text-neutral-800 text-sm">1. تنفيذ الجلسة</h4>
                </div>
                <div className="flex items-start gap-2 text-neutral-500 text-xs leading-relaxed pr-6 font-medium">
                  <User size={14} className="shrink-0 mt-0.5 opacity-70" />
                  يقوم مقدم الخدمة بتنفيذ العمل المطلوب في الجلسة.
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileEdit size={16} className="text-purple-500" />
                  <h4 className="font-bold text-neutral-800 text-sm">2. تسجيل الجلسة</h4>
                </div>
                <div className="flex items-start gap-2 text-neutral-500 text-xs leading-relaxed pr-6 font-medium">
                  <FileText size={14} className="shrink-0 mt-0.5 opacity-70" />
                  بعد الانتهاء، يتم تسجيل الجلسة في النظام مع عدد الساعات التي تم تنفيذها.
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-amber-500" />
                  <h4 className="font-bold text-neutral-800 text-sm">3. انتظار المراجعة</h4>
                </div>
                <div className="flex items-start gap-2 text-neutral-500 text-xs leading-relaxed pr-6 font-medium">
                  <User size={14} className="shrink-0 mt-0.5 opacity-70" />
                  تبقى الجلسة بانتظار مراجعة طالب الخدمة.
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <h4 className="font-bold text-neutral-800 text-sm">4. التأكيد أو الرفض</h4>
                </div>
                <div className="flex flex-col gap-2 text-neutral-500 text-xs leading-relaxed pr-6 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> عند التأكيد: يتم اعتماد الساعات وإضافتها إلى إجمالي العمل
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle size={14} className="text-rose-500" /> عند الرفض: لا يتم احتساب تلك الساعات
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-100 text-neutral-700 p-4 rounded-xl flex items-center gap-2 mt-4">
              <Pin className="shrink-0 text-neutral-500" size={16} />
              <p className="text-xs font-bold">الساعات لا تُحتسب إلا بعد التأكيد لضمان الدقة والعدالة.</p>
            </div>
          </section>

          {/* Section 2: Progress */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Timer size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">متابعة التقدم داخل العقد</h3>
            </div>

            <p className="text-neutral-500 text-sm flex items-center gap-2 font-bold">
              <BarChart3 size={16} /> يمكنك دائمًا معرفة:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-neutral-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <Clock size={16} className="text-blue-500 shrink-0" />
                <span className="text-xs font-bold text-neutral-700">عدد الساعات التي تم تنفيذها</span>
              </div>
              <div className="bg-white border border-neutral-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-neutral-700">عدد الساعات التي تم تأكيدها</span>
              </div>
              <div className="bg-white border border-neutral-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <Clock size={16} className="text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-neutral-700">الجلسات بانتظار المراجعة</span>
              </div>
            </div>
          </section>

          {/* Section 3: Completion */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">عندما تكتمل الساعات المطلوبة</h3>
            </div>

            <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl">
              <p className="text-emerald-900 font-bold text-sm mb-4 flex items-center gap-2">
                <Target size={16} className="text-emerald-600" />
                إذا تم تنفيذ جميع الساعات المتفق عليها وتأكيدها:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-50">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-emerald-800">يتم اعتبار العقد مكتملًا بنجاح</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-50">
                  <Wallet size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-emerald-800">يحصل مقدم الخدمة على كامل مستحقاته</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-50">
                  <Package size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-emerald-800">ويتم إغلاق العقد بشكل طبيعي</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Not Completed / Delay */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <Scale size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">عندما لا تكتمل الساعات</h3>
            </div>

            <div className="flex items-start gap-2 text-sm text-neutral-600 font-bold bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              في Wasla يتم التعامل مع العقود بطريقة عادلة تضمن حقوق الطرفين بناءً على الالتزام الفعلي بتنفيذ العمل.
            </div>

            {/* Delay from Client */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 p-4 border-b border-neutral-100 flex items-center gap-3">
                <User size={18} className="text-neutral-500" />
                <h4 className="font-bold text-neutral-800">إذا كان التأخير من جهة طالب الخدمة</h4>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs font-bold text-neutral-600 flex gap-2 leading-relaxed">
                  <Briefcase size={14} className="shrink-0 mt-1 opacity-70" />
                  إذا قام مقدم الخدمة بتنفيذ الجلسات بالكامل، لكن لم يتم تأكيد بعض الجلسات من قبل طالب الخدمة حتى نهاية المدة:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg text-xs font-bold text-neutral-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> يتم اعتماد فقط الجلسات التي تم تأكيدها لصالح مقدم الخدمة
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg text-xs font-bold text-neutral-700">
                    <Undo2 size={16} className="text-blue-500 shrink-0" /> ويتم إرجاع الساعات غير المؤكدة إلى طالب الخدمة
                  </div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 items-start mt-2 border border-blue-100">
                  <Pin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-800 leading-relaxed">
                    الفكرة هنا: نضمن حق مقدم الخدمة لأنه التزم ونفذ العمل بالكامل، بينما عدم التأكيد في الوقت المناسب من جهة طالب الخدمة يؤدي إلى فقدان اعتماده لهذه الساعات.
                  </p>
                </div>
              </div>
            </div>

            {/* Delay from Provider */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 p-4 border-b border-neutral-100 flex items-center gap-3">
                <User size={18} className="text-neutral-500" />
                <h4 className="font-bold text-neutral-800">إذا كان التأخير من جهة مقدم الخدمة</h4>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs font-bold text-neutral-600 flex gap-2 leading-relaxed">
                  <Briefcase size={14} className="shrink-0 mt-1 opacity-70" />
                  إذا لم يتم تنفيذ كامل الساعات المتفق عليها ضمن المدة المحددة:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg text-xs font-bold text-neutral-700">
                    <Undo2 size={16} className="text-blue-500 shrink-0" /> يتم إرجاع كامل الساعات إلى طالب الخدمة
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg text-xs font-bold text-neutral-700">
                    <AlertTriangle size={16} className="text-rose-500 shrink-0" /> لأن الخدمة لم تُنجز كما تم الاتفاق عليه
                  </div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 items-start mt-2 border border-blue-100">
                  <Pin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-800 leading-relaxed">
                    الفكرة هنا: نضمن حق طالب الخدمة لأنه لم يحصل على الخدمة كاملة، ويُعتبر التقصير من جهة مقدم الخدمة.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Expiration / Rating */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-black text-neutral-800 font-cairo">ملاحظة مهمة عن انتهاء العقد</h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
              <p className="text-sm text-neutral-700 font-bold flex gap-2">
                <Pin size={16} className="shrink-0 text-neutral-400 mt-0.5" />
                بمجرد انتهاء العقد سواء انتهى بنجاح أو تم حسمه كنزاع:
              </p>
              <div className="bg-yellow-50/30 p-4 rounded-xl border border-yellow-100 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-yellow-800 bg-white p-3 rounded-lg border border-yellow-50">
                  <Star size={18} className="text-yellow-500" /> يتم فتح شاشة تقييم إلزامية للطرفين
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-3 rounded-lg text-xs font-bold text-neutral-700 flex items-center gap-2 border border-neutral-50">
                    <User size={16} className="text-neutral-400 shrink-0" /> يجب على طالب الخدمة تقييم مقدم الخدمة
                  </div>
                  <div className="bg-white p-3 rounded-lg text-xs font-bold text-neutral-700 flex items-center gap-2 border border-neutral-50">
                    <User size={16} className="text-neutral-400 shrink-0" /> ويجب على مقدم الخدمة تقييم طالب الخدمة
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs font-bold text-neutral-500 pt-2 bg-neutral-50 p-3 rounded-lg">
                <Pin size={14} className="shrink-0 mt-0.5" />
                الهدف من ذلك: ضمان الشفافية الكاملة وتوثيق التجربة بشكل عادل للطرفين داخل النظام.
              </div>
            </div>
          </section>

          {/* Section 6: Core Idea & Summary */}
          <section className="space-y-6 pt-4">

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Brain size={20} />
                </div>
                <h3 className="text-lg font-black text-neutral-800 font-cairo">الفكرة الأساسية</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-neutral-700"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> يتم اعتماد الساعات فقط بعد التأكيد</div>
                <div className="flex items-center gap-3 text-sm font-bold text-neutral-700"><Scale size={18} className="text-blue-500 shrink-0" /> يتم تحديد المسؤولية حسب الالتزام الفعلي</div>
                <div className="flex items-center gap-3 text-sm font-bold text-neutral-700"><ShieldCheck size={18} className="text-indigo-500 shrink-0" /> يتم حماية الطرف الملتزم سواء كان مقدم الخدمة أو طالب الخدمة</div>
                <div className="flex items-center gap-3 text-sm font-bold text-neutral-700"><Ban size={18} className="text-rose-500 shrink-0" /> لا يتم إغلاق العقد نهائيًا إلا بعد التقييم من الطرفين</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-lg font-black text-neutral-800 font-cairo">خلاصة سريعة</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-emerald-900">الملتزم يحصل على حقه بالكامل</span>
                </div>
                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex items-center gap-3">
                  <Scale size={18} className="text-rose-600 shrink-0" />
                  <span className="text-sm font-bold text-rose-900">المقصر يتحمل نتيجة التقصير</span>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                  <Timer size={18} className="text-blue-600 shrink-0" />
                  <span className="text-sm font-bold text-blue-900">يتم حسم العقد تلقائيًا عند النهاية</span>
                </div>
                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 flex items-center gap-3">
                  <Star size={18} className="text-yellow-600 shrink-0" />
                  <span className="text-sm font-bold text-yellow-900">التقييم الإجباري يضمن الشفافية</span>
                </div>
              </div>
            </div>

          </section>

          {/* Bottom spacing to ensure clear scroll area */}
          <div className="h-8" />
        </div>
      </div>
    </div>,
    document.body
  );
}
