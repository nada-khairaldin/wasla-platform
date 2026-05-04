"use client";

import { useState , useEffect} from "react";
import {
  Check,
  User,
  Palette,
  Code2,
  Gift,
  ChevronRight,
  Edit2,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Logo from "../../../../../components/ui/Logo";
import Stepper from "./../../../../../features/auth/components/Stepper";
import Button from "./../../../../../components/ui/Button";
import SummaryItem from "../../../../../features/auth/components/SummaryItem";

import { useSignupActions, useSignupStore } from "@/src/features/auth/store/useSignupStore";
import { authServices } from "../../../../../features/auth/services/authService";
import { SignupFormData } from "../../../../../features/auth/schemas/authSchema";

function ConfirmationPage() {
  const { formData } = useSignupStore();
  const { resetSignup } = useSignupActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
 const data = useSignupStore((state) => state.formData);

  useEffect(() => {
    if (!data.email) { 
      router.replace('/signup/basic-info');
    }
  }, [data, router]);

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { data: resData, error } = await authServices.signup(data);

      if (error) {
        let translatedError = error;
        if (error.toLowerCase().includes("email")) {
          translatedError = "البريد الإلكتروني مسجل مسبقاً";
        } else if (error.toLowerCase().includes("username")) {
          translatedError = "اسم المستخدم محجوز، يرجى اختيار اسم آخر";
        }
        setServerError(translatedError);
        toast.error(translatedError);
        return;
      }
      if (resData) {
        console.log("البيانات القادمة من السيرفر:", resData);
        const { access_Token, user } = resData;
        localStorage.setItem("token", access_Token);
        resetSignup();
        router.push("/auth/success");
      }
    } catch (err) {
      toast.error("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً");
      console.error("Signup Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isUsernameError = serverError?.includes("اسم المستخدم");
  const isEmailError = serverError?.includes("البريد");
  const goToStepOne = () => router.push("/signup/basic-info");

  return (
<div className="min-h-screen bg-white flex flex-col items-center px-base">
  {/* الهيدر: يأخذ عرض الشاشة ويضع الشعار في أقصى اليمين */}
  <header className="w-full flex  p-4 md:p-8">
    <div className="scale-75 md:scale-100">
      <Logo />
    </div>
  </header>


  <main className="w-full max-w-[750px] px-4 mt-sm md:mt-8">
    <Stepper currentStep={3} />
  </main>



      <div className="flex flex-col items-center w-full max-w-[474px] gap-[18px] mb-10 -mt-3xl md:mt-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-[75px] h-[75px] border-[3px] border-success-500 rounded-full flex items-center justify-center bg-white shadow-sm">
              <span className="text-5xl font-semibold text-neutral-900 leading-none">
                5
              </span>
            </div>
            <div className="absolute w-[30px] h-[30px] flex justify-center items-center -bottom-1 -right-1 bg-success-50 rounded-full shadow-sm">
              <Check size={15} className="text-success-500 stroke-[4]" />
            </div>
          </div>
          <span className="text-3xl font-bold text-neutral-800 tracking-tight">
            ساعات
          </span>
        </div>
        <p className="text-success-500 text-sm md:text-base font-medium text-center">
          ستحصل على 5 ساعات مجانية في حسابك عند التسجيل للبدء
        </p>

        <div className="w-full bg-success-50 rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-success-100">
          <div className="bg-white p-2.5 md:p-3 rounded-2xl shadow-sm border border-emerald-50 flex-shrink-0">
            <Gift size={24} className="text-success-500" />
          </div>
          <div className="flex flex-col text-right">
            <h3 className="text-emerald-700 font-bold text-[16px] md:text-[18px]">
              هدية الترحيب
            </h3>
            <p className="text-neutral-600 text-[12px] md:text-[13px]">
              ابدأ رحلتك معنا واستفد من مزايا حصرية للأعضاء الجدد 🎉
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start w-full max-w-[653px] gap-[20px] mb-12">
        <h4 className="text-[#374151] text-xl font-bold self-start mr-2">
          تلخيص:
        </h4>

        <div
          className={`w-full relative group rounded-2xl transition-all ${isUsernameError ? "ring-2 ring-red-500 bg-red-50" : ""}`}
        >
          <SummaryItem
            label="اسم المستخدم"
            value={formData.username || " "}
            icon={
              <User
                size={20}
                className={isUsernameError ? "text-red-500" : ""}
              />
            }
          />
          <button
            onClick={goToStepOne}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isUsernameError ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-neutral-100 text-neutral-400"}`}
          >
            <Edit2 size={16} />
          </button>
        </div>

        <div
          className={`w-full relative group rounded-2xl transition-all ${isEmailError ? "ring-2 ring-red-500 bg-red-50" : ""}`}
        >
          <SummaryItem
            label="البريد الإلكتروني"
            value={formData.email || " "}
            icon={
              <Mail size={20} className={isEmailError ? "text-red-500" : ""} />
            }
          />
          <button
            onClick={goToStepOne}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isEmailError ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-neutral-100 text-neutral-400"}`}
          >
            <Edit2 size={16} />
          </button>
        </div>

        <SummaryItem
          label="المهارات التي أقدمها"
          value={formData.offeredSkills?.join(" و ") || "لم يتم تحديد مهارات"}
          icon={<Palette size={20} />}
        />

        <SummaryItem
          label="المهارات التي أحتاجها"
          value={formData.requiredSkills?.join(" و ") || "لم يتم تحديد مهارات"}
          icon={<Code2 size={20} />}
        />

        {serverError && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-1 text-red-700 text-sm">
            <p>{serverError}</p>

            {(serverError.includes("البريد") ||
              serverError.includes("اسم المستخدم")) && (
              <button
                onClick={goToStepOne}
                className="text-red-800 underline font-bold mt-1 text-right w-fit hover:cursor-pointer"
              >
                اضغط هنا للعودة وتعديل البيانات
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-[653px] space-y-4 mb-16">
        <Button
          variant="filled"
          className="w-full h-12 text-lg font-bold"
          onClick={() => handleSignup(formData as SignupFormData)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              جاري إنشاء الحساب...
            </span>
          ) : (
            "تأكيد وإنشاء الحساب"
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12 text-neutral-600 font-medium"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <ChevronRight size={20} />
          <span>رجوع لتعديل المهارات</span>
        </Button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
