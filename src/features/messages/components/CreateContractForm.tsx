import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractFormValues, contractSchema } from "../schemas/chat";
import InputField from "../../../components/ui/InputField";
import { Briefcase, FileText, Hash } from "lucide-react";

interface CreateContractFormProps {
  initialData?: {
    postTitle?: string;
    providerName?: string;
    seekerName?: string;
    serviceMode?: "online" | "offline";
    timeCredits?: number;
  };
  onCancel: () => void;
  onSubmit: (data: ContractFormValues) => void;
}
export function CreateContractForm({
  initialData,
  onCancel,
  onSubmit,
}: CreateContractFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      contractId: "CON-2", 
      contractTitle: initialData?.postTitle || "عنوان الخدمة المتفق عليها",
      providerName: initialData?.providerName || "",
      seekerName: initialData?.seekerName || "",
      serviceMode: initialData?.serviceMode || "online",
      timeCredits: initialData?.timeCredits || 2,
      maxEndDate: "",
    },
  });

  const timeCreditsValue = watch("timeCredits");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-6 md:p-8 bg-white flex flex-col gap-6 text-right dir-rtl"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-[#1B4B72] shrink-0">
            <FileText size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
              اضافة عقد خدمة جديد
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 font-medium">
              يرجى ملء تفاصيل الاتفاقية بدقة لضمان حقوق الطرفين
            </p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-50/60 p-3.5 rounded-2xl border border-neutral-100">
        <div className="flex items-center gap-2 pr-2">
          <Hash size={16} className="text-neutral-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400">
              رقم العقد
            </span>
            <span className="text-xs font-black text-neutral-700">
              {watch("contractId")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-span-2 border-r border-neutral-200/60 pr-4">
          <Briefcase size={16} className="text-[#1B4B72] shrink-0" />
          <div className="flex flex-col min-w-0 w-full">
            <span className="text-xs font-bold text-[#1B4B72] truncate">
              {watch("contractTitle")}
            </span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="providerName"
          label="مزود الخدمة"
          disabled
          className="bg-neutral-50/80 border-none text-neutral-500 cursor-not-allowed font-medium rounded-2xl p-4"
          {...register("providerName")}
        />
        <InputField
          id="seekerName"
          label="مستلم الخدمة"
          disabled
          className="bg-neutral-50/80 border-none text-neutral-500 cursor-not-allowed font-medium rounded-2xl p-4"
          {...register("seekerName")}
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="serviceMode"
          label="طريقة تقديم الخدمة"
          disabled
          className="bg-neutral-50/80 border-none text-neutral-500 cursor-not-allowed font-medium rounded-2xl p-4"
          {...register("serviceMode")}
        />
        <InputField
          id="maxEndDate"
          label="تاريخ الانتهاء الأقصى"
          type="date"
          error={errors.maxEndDate?.message}
          className="bg-neutral-50/50 border border-neutral-100 focus:bg-white text-neutral-800 font-medium rounded-2xl p-4 transition-all cursor-pointer relative"
          style={{ colorScheme: "light" }}
          {...register("maxEndDate")}
        />
      </div>


      <div className="w-full border border-neutral-200/80 rounded-2xl p-4 md:p-5 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-sm mt-1">
        <div className="flex items-center justify-between sm:justify-start gap-4 bg-neutral-100/70 p-1.5 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setValue("timeCredits", timeCreditsValue + 1)}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-neutral-700 font-bold text-lg hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            +
          </button>
          <span className="text-lg font-black text-neutral-900 w-8 text-center select-none">
            {timeCreditsValue}
          </span>
          <button
            type="button"
            onClick={() =>
              timeCreditsValue > 1 &&
              setValue("timeCredits", timeCreditsValue - 1)
            }
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-neutral-700 font-bold text-lg hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            -
          </button>
        </div>

        <div className="text-right flex flex-col gap-0.5">
          <span className="text-sm font-bold text-neutral-800">
            عدد ساعات الوقت المطلوبة
          </span>
          <span className="text-xs text-neutral-400 font-medium leading-relaxed">
            هذه الساعات ستخصم من رصيد المستفيد وتضاف إليك
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <button
          type="submit"
          className="flex-1 order-1 sm:order-2 py-4 rounded-2xl bg-[#1B4B72] text-white font-bold text-sm hover:bg-[#153b5a] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
        >
          ارسال العقد للعميل
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 order-2 sm:order-1 py-4 rounded-2xl border-2 border-[#1B4B72] text-[#1B4B72] bg-white font-bold text-sm hover:text-red-600 hover:border-red-600 hover:bg-red-50/40 active:scale-[0.99] transition-all cursor-pointer text-center"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
