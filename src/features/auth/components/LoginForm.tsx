"use client";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import InputField from "../../../components/ui/InputField";
import { authServices } from "../services/authService";
import { useState } from "react";
import {
  loginSchema,
  LoginFormData,
} from "@/src/features/auth/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthActions } from "../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthActions();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    const { data, error } = await authServices.login(formData);

    if (error) {
      let translatedError = error;
      if (error.toLowerCase().includes("invalid credentials"))
        translatedError =
          "خطأ في البريد الإلكتروني أو كلمة المرور. يرجى المحاولة مرة أخرى.";
      setError("root.serverError", {
        type: "manual",
        message: translatedError,
      });
      setIsLoading(false);
      return;
    }
    if (data) {
      const { accessToken, pendingReviewContracts } = data;

      setAuth(accessToken, pendingReviewContracts);
      router.replace("/home");

      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    }

    setIsLoading(false);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <div>
      <h1 className="text-h4 text-primary-900 font-bold mb-xl4 md:text-h3">
        مرحبا! سجل دخولك الى حسابك
      </h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="mb-lg flex flex-col gap-xl"
      >
        <InputField
          id="email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="أدخل بريدك الإلكتروني"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          id="password"
          type="password"
          label="كلمة المرور"
          placeholder="أدخل كلمة المرور"
          {...register("password")}
          error={errors.password?.message}
        />
        <Link
          href="/forgot-password"
          className="text-sm text-gray-500 self-end mt-sm hover:underline transition-all duration-200 active:scale-95 active:opacity-70 select-none"
        >
          هل نسيت كلمة المرور؟
        </Link>

        {errors.root?.serverError && (
          <p className="text-red-500 text-sm mb-4 text-center animate-shake">
            {errors.root.serverError.message}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          variant="filled"
          className="mt-xl"
          disabled={isLoading}
        >
          {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
        </Button>

        <p className="text-center text-neutral-700">
          ليس لديك حساب؟
          <Link
            href="/signup"
            className="text-primary-500 cursor-pointer hover:underline transition-all duration-200 active:text-primary-700 active:scale-95 inline-block select-none font-bold"
          >
            أنشئ حساب جديد
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
