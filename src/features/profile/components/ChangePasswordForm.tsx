"use client";
import React, { useState } from "react";
import { ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/src/features/auth/schemas/authSchema";

interface ChangePasswordFormProps {
  isPending: boolean;
  onSubmit: (data: ChangePasswordFormData) => void;
  onCancel: () => void;
}

export default function ChangePasswordForm(props: ChangePasswordFormProps) {
  const { isPending, onSubmit, onCancel } = props;

  // Eye toggle states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const handleSubmitForm = (data: ChangePasswordFormData) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
      <div className="max-w-[600px] mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-white border border-neutral-155 flex items-center justify-center text-primary-500 hover:bg-neutral-50 hover:shadow-sm transition-all cursor-pointer"
            title="رجوع للملف الشخصي"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-cairo">تغيير كلمة المرور</h1>
            <p className="text-xs text-neutral-400 mt-0.5">قم بتحديث كلمة مرور حسابك لتأمينه</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(handleSubmitForm)} className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
          
          {/* Lock Icon and Header inside card */}
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-primary-600">
            <Lock className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-neutral-800">تفاصيل كلمة المرور</h2>
          </div>

          {/* Old Password */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label htmlFor="oldPassword" className="text-neutral-700 text-sm font-bold block mb-1">
              كلمة المرور القديمة
            </label>
            <div className="relative w-full">
              <input
                id="oldPassword"
                type={showOld ? "text" : "password"}
                placeholder="أدخل كلمة المرور القديمة"
                {...register("oldPassword")}
                className={`w-full rounded-xl border p-3.5 pl-12 pr-4 outline-none focus:border-primary-500 bg-white text-neutral-850 text-right font-cairo text-sm font-medium transition-all ${
                  errors.oldPassword ? "border-error-500 focus:border-error-500" : "border-neutral-200"
                }`}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-error-500 text-xs mt-1 text-right">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label htmlFor="password" className="text-neutral-700 text-sm font-bold block mb-1">
              كلمة المرور الجديدة
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showNew ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                {...register("password")}
                className={`w-full rounded-xl border p-3.5 pl-12 pr-4 outline-none focus:border-primary-500 bg-white text-neutral-850 text-right font-cairo text-sm font-medium transition-all ${
                  errors.password ? "border-error-500 focus:border-error-500" : "border-neutral-200"
                }`}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error-500 text-xs mt-1 text-right leading-relaxed">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label htmlFor="confirmPassword" className="text-neutral-700 text-sm font-bold block mb-1">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative w-full">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="أعد كتابة كلمة المرور الجديدة"
                {...register("confirmPassword")}
                className={`w-full rounded-xl border p-3.5 pl-12 pr-4 outline-none focus:border-primary-500 bg-white text-neutral-850 text-right font-cairo text-sm font-medium transition-all ${
                  errors.confirmPassword ? "border-error-500 focus:border-error-500" : "border-neutral-200"
                }`}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-error-500 text-xs mt-1 text-right">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-4 mt-4 w-full">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50/50 transition-all font-bold font-cairo cursor-pointer text-center text-sm"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold font-cairo transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-center text-sm"
            >
              {isPending ? "جاري التغيير..." : "تأكيد التغيير"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
