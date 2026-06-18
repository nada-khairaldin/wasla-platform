"use client";
import React, { useState } from "react";
import { AlertOctagon, Key } from "lucide-react";
import InputField from "@/src/components/ui/InputField";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  isPending: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = password.trim();
    if (!trimmed) {
      setError("يرجى إدخال كلمة المرور لتأكيد حذف الحساب.");
      return;
    }

    try {
      await onConfirm(trimmed);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "فشل التحقق من كلمة المرور. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-[400px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-250"
        dir="rtl"
      >
        {/* Warning Icon inside red background */}
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-5">
          <AlertOctagon size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 mb-2 font-cairo">حذف الحساب نهائياً</h3>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed mb-6 font-cairo">
          هل أنت متأكد من رغبتك في حذف حسابك نهائياً؟ لا يمكن التراجع عن هذا الإجراء. يرجى إدخال كلمة المرور الحالية لتأكيد الهوية.
        </p>

        {/* Password input */}
        <div className="w-full mb-6">
          <InputField
            id="delete-account-password"
            type="password"
            label="كلمة المرور لتأكيد الحذف"
            placeholder="أدخل كلمة المرور الحالية..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            icon={<Key size={18} />}
            error={error}
            disabled={isPending}
          />
        </div>

        {/* Buttons stacked vertically */}
        <div className="flex flex-col gap-3 w-full">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold font-cairo transition-all active:scale-98 cursor-pointer text-center text-sm disabled:opacity-50"
          >
            {isPending ? "جاري حذف الحساب..." : "تأكيد حذف الحساب نهائياً"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-bold font-cairo transition-all active:scale-98 cursor-pointer text-center text-sm disabled:opacity-50"
          >
            تراجع وإلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
