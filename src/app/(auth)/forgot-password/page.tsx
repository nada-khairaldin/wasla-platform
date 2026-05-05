"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import Logo from "../../../components/ui/Logo";
import InputField from "../../../features/auth/components/InputField";
import Button from "../../../components/ui/Button";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../../../features/auth/schemas/authSchema";
import { authServices } from "../../../features/auth/services/authService";
import Link from "next/link";

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authServices.forgotPassword(data.email);
      if (error) {
        toast.error(error);
      } else {
        setUserEmail(data.email);
        setIsSuccess(true);
        toast.success("تم إرسال الرابط بنجاح");
      }
    } catch (err) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-xl overflow-hidden font-cairo">
      <div className="absolute top-6 right-6 md:top-xl2 md:right-xl2 scale-75 md:scale-100">
        <Logo />
      </div>

      {/* Main Card */}
      <div className="bg-primary-50 w-full max-w-[550px] rounded-[2rem] p-6 md:p-xl2 lg:p-xl3 flex flex-col items-center shadow-sm z-10 transition-all duration-500">
        {!isSuccess ? (
          <>
            <div className="bg-white/70 p-3 md:p-4 rounded-full shadow-inner mb-5 md:mb-6">
              <RotateCcw className="w-6 h-6 md:w-8 md:h-8 text-neutral-400" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 text-center">
              هل نسيت كلمة المرور؟
            </h1>
            <p className="text-neutral-600 text-center text-xs md:text-sm mb-6 md:mb-8 leading-relaxed max-w-[90%] md:max-w-full">
              أدخل بريدك الإلكتروني وسأرسل لك رابطاً لإعادة تعيين كلمة المرور
              الخاصة بك
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="w-full mb-5 md:mb-6">
                <InputField
                  id="email"
                  type="email"
                  label="البريد الإلكتروني"
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="example@mail.com"
                  className="bg-white/70"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="filled"
                className="w-full mb-6 md:mb-xl py-3 md:py-4"
                loading={isLoading}
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                أرسل رابط كلمة المرور
              </Button>
            </form>
            <Link
              href="/login"
              className="flex items-center gap-2 text-primary-500 font-semibold hover:underline text-sm md:text-base transition-all duration-200 active:scale-95 active:opacity-80 select-none"
            >
              <ArrowRight className="w-5 h-5" />
              العودة لتسجيل الدخول
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 w-full">
            <div className="bg-green-100 p-3 md:p-4 rounded-full mb-5 md:mb-6 border border-green-200">
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
              تفقد بريدك الإلكتروني
            </h1>

            <div className="bg-white/60 border border-primary-100 rounded-2xl p-4 mb-6 w-full shadow-sm">
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى:
                <span
                  className="block font-bold text-primary-600 mt-2 text-sm md:text-base break-all"
                  dir="ltr"
                >
                  {userEmail}
                </span>
              </p>
            </div>

            <p className="text-neutral-500 text-[10px] md:text-xs mb-8 max-w-[90%]">
              إذا لم تجد الرسالة في غضون دقيقتين، يرجى التحقق من مجلد البريد
              المهمل (Junk/Spam).
            </p>

            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
              className="w-full mb-6 py-3"
            >
              إعادة المحاولة بإيميل آخر
            </Button>

            <Link
              href="/login"
              className="flex items-center gap-2 text-primary-500 font-semibold hover:underline text-sm transition-all duration-200 active:scale-95 active:opacity-80 select-none"
            >
              <ArrowRight className="w-5 h-5" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
