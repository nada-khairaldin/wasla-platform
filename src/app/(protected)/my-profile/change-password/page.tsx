"use client";

import { useRouter } from "next/navigation";
import { useChangePassword } from "@/src/features/auth/hooks/useChangePassword";
import { ChangePasswordFormData } from "@/src/features/auth/schemas/authSchema";
import ChangePasswordForm from "@/src/features/profile/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  const router = useRouter();

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      // Logic for toast and logout is handled inside useChangePassword hook
      // No need to route to /my-profile since we are logging out
    },
    onError: (err: Error) => {
      console.error("Change password error:", err);
      // Removed mock fallback to avoid wrong success messages when real API fails
    },
  });

  const onSubmit = (data: ChangePasswordFormData, reset: () => void) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        reset(); // Clear fields upon success
      }
    });
  };

  return (
    <ChangePasswordForm
      isPending={changePasswordMutation.isPending}
      onSubmit={onSubmit}
      onCancel={() => router.push("/my-profile")}
    />
  );
}
