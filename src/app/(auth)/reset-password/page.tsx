"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, CheckCircle2  } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";

import Logo from "../../../components/ui/Logo";
import InputField from "../../../features/auth/components/InputField";
import Button from "../../../components/ui/Button";
import { authServices } from "../../../features/auth/services/authService";
import { ResetPasswordFormData, resetPasswordSchema } from "../../../features/auth/schemas/authSchema";


function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // const searchParams = useSearchParams();
  const router = useRouter();
  // const token = searchParams.get("token"); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

 /* const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("رابط غير صالح أو منتهي الصلاحية");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authServices.resetPassword(data.password, token);
      
      if (error) {
        toast.error(error);
      } else {
        setIsSuccess(true);
        toast.success("تم تغيير كلمة المرور بنجاح");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };
  */

  return (
    <div className="relative min-h-screen flex items-center justify-center p-xl overflow-hidden font-cairo">
      <div className="absolute top-xl2 right-xl2">
        <Logo />
      </div>

      <div className="bg-primary-50 w-full max-w-[600px] rounded-3xl p-xl2 md:p-xl3 flex flex-col items-center shadow-sm z-10 transition-all">
        {!isSuccess ? (
          <>
            <div className="bg-white/70 p-4 rounded-full shadow-inner mb-6">
              <Lock className="w-8 h-8 text-neutral-400" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-2">إعادة تعيين كلمة المرور</h1>
            <p className="text-neutral-600 text-center text-sm mb-8">
              أدخل كلمة المرور الجديدة الخاصة بك لتتمكن من الدخول إلى حسابك
            </p>

            <form  className="w-full space-y-5">
                <InputField
                  id="password"
                  type= "password"
                  label="كلمة المرور الجديدة"
                  placeholder="********"
                  icon={<Lock className="w-5 h-5" />}
                  {...register("password")}
                  error={errors.password?.message}
                  className="bg-white/70"
                />
            
              <InputField
                id="confirmPassword"
                type="password"
                label="تأكيد كلمة المرور"
                placeholder="********"
                icon={<Lock className="w-5 h-5" />}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                className="bg-white/70"
              />

              <Button
                type="submit"
                size="lg"
                variant="filled"
                className="w-full mt-4"
                loading={isLoading}
              >
                تحديث كلمة المرور
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 w-full">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-4">تم التحديث بنجاح!</h1>
            <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
              لقد تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
            </p>

            <Button 
              variant="filled" 
              className="w-full mb-4"
              onClick={() => router.push("/login")}
            >
              تسجيل الدخول الآن
            </Button>
          </div>
        )}

        <a href="/login" className="flex items-center gap-2 text-primary-500 font-semibold hover:underline mt-6 text-sm">
          <ArrowRight className="w-5 h-5" />
          العودة لتسجيل الدخول
        </a>
      </div>
    </div>
  );
}

export default ResetPasswordPage;