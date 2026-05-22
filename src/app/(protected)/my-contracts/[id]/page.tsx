"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  FilePlus, 
  Pencil, 
  CheckCircle2, 
  Briefcase 
} from "lucide-react";
import { MOCK_CONTRACTS } from "@/src/features/contracts/data/contracts.data";
import { Contract, WorkSession, OperationLogEntry } from "@/src/features/contracts/contract.types";
import { ContractStatsRow } from "../../../../features/contracts/components/ContractStatsRow";

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id;

  // Direct safe lookup without requiring state hydration guards
  const contract = MOCK_CONTRACTS.find((c) => c.id === contractId) as Contract | undefined;

  // --- Error Handling: Contract Not Found ---
  if (!contract) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50/40 p-4 text-right">
        <p className="text-lg font-bold text-neutral-500 mb-4">العقد المطلوب غير موجود أو تم حذفه.</p>
        <button 
          onClick={() => router.push("/my-contracts")}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary-600 active:scale-95 transition-all"
        >
          العودة لقائمة العقود
        </button>
      </div>
    );
  }

  const totalHours = contract.stats?.totalHours || 0;

  return (
    <div className="min-h-screen bg-white text-right" dir="rtl">
      {/* ─── Main Content Container ─── */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* ─── Header Section ─── */}
        <div className="flex flex-col gap-2 items-start">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-primary-500 transition-colors"
          >
            <ChevronLeft size={14} /> العودة لقائمة العقود
          </button>
          <div className="flex items-center justify-between w-full mt-6">
            <h1 className="text-h3 font-black text-neutral-900">تفاصيل العقد</h1>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all shadow-sm">
              <FilePlus size={16} /> اضافة جلسة عمل
            </button>
          </div>
        </div>

        {/* ─── Contract Overview Banner Card ─── */}
        <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm flex items-center gap-5 justify-between mt-6">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 leading-snug">{contract.title}</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-neutral-400 font-medium">
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-neutral-300"/> مجال الخدمة:
                  <span className="font-bold text-neutral-600">{contract.serviceType}</span>
                </span>
                <span>المزود: <span className="font-bold text-neutral-600">{contract.providerName}</span></span>
                <span>المستفيد: <span className="font-bold text-neutral-600">{contract.seekerName}</span></span>
              </div>
            </div>
          </div>
          <button className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all ">
            <Pencil size={16} />
          </button>
        </div>

        {/* ─── Render Extracted Stats Grid Row ─── */}
        <ContractStatsRow stats={contract.stats} />

        {/* ─── Dynamic Log & Sessions Layout Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 items-start mt-8">
          
          {/* Operation Logs Sidebar Container */}
          <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">سجل العمليات</h3>
            <div className="flex-1 flex flex-col gap-4 max-h-[380px] overflow-y-auto pl-1">
              {contract.operationLogs?.map((log: OperationLogEntry) => (
                <div key={log.id} className="flex gap-3 relative pb-4 text-right">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-50 border-2 border-primary-400 mt-0.5 shrink-0 z-10" />
                  <div className="absolute top-4 right-[6.5px] w-px h-[calc(100%-8px)] bg-neutral-100" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-neutral-800 truncate">{log.title}</p>
                    <p className="text-[10px] font-medium text-neutral-400">{log.byLine}</p>
                    {log.description && <p className="text-[11px] text-neutral-500 pt-0.5 leading-relaxed">{log.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Sessions Data Table Container */}
          <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">جلسات العمل المنجزة</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="pb-3 text-xs text-neutral-400 font-bold">التاريخ</th>
                    <th className="pb-3 text-xs text-neutral-400 font-bold">عدد الساعات</th>
                    <th className="pb-3 text-xs text-neutral-400 font-bold">الملاحظات</th>
                    <th className="pb-3 text-xs text-neutral-400 font-bold text-left">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.workSessions?.map((session: WorkSession) => {
                    const isConfirmed = session.status === "مؤكدة";
                    return (
                      <tr key={session.id} className="border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/40 transition-colors">
                        <td className="py-4 text-sm font-semibold text-neutral-800">{session.date}</td>
                        <td className="py-4 text-sm font-black text-primary-500">{session.hours} ساعة</td>
                        <td className="py-4 text-xs text-neutral-500 leading-relaxed max-w-[240px] truncate">{session.notes}</td>
                        <td className="py-4 text-left">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isConfirmed 
                              ? "bg-success-50 text-success-700 border border-success-100/50" 
                              : "bg-warning-50 text-warning-700 border border-warning-100/50"
                          }`}>
                            {isConfirmed && <CheckCircle2 size={10} />}
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 pt-4 border-t border-neutral-100 text-left text-xs font-bold text-neutral-400">
                اجمالي الجلسات المسجلة: <span className="text-primary-500 font-black">{contract.workSessions?.length || 0}</span> من أصل <span className="text-neutral-700 font-black">{totalHours}</span> ساعات معتمدة
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}