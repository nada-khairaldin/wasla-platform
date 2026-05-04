import { z } from "zod";
interface PasswordMatchFields {
  password?: string;
  confirmPassword?: string;
}

const emailValidation = z
  .string()
  .trim()
  .min(1, "البريد الإلكتروني مطلوب")
  .email("البريد الإلكتروني غير صحيح");

const passwordValidation = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 رموز على الأقل")
  .max(100)
  .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
  .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
  .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
  .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل (@#$...)");

const passwordConfirmFields = {
  password: passwordValidation,
  confirmPassword: z.string().min(1, "الرجاء تأكيد كلمة المرور"),
};

const passwordConfirmRefine = {
  validator: (data: PasswordMatchFields) =>
    data.password === data.confirmPassword,
  params: {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  },
};

export const basicInfoSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "اسم المستخدم مطلوب")
      .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
      .max(50)
      .regex(
        /^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9\d\W_]+$/,
        "يجب أن يحتوي اسم المستخدم على 3 حروف إنجليزية على الأقل، ويمكنك استخدام الأرقام والرموز",
      ),
    full_name: z
      .string()
      .trim()
      .min(1, "الاسم كامل مطلوب")
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100)
      .regex(
        /^[a-zA-Z\u0600-\u06FF\s]+$/,
        "الاسم يجب أن يحتوي على حروف فقط وبدون أرقام",
      ),
    city: z.string().min(1, "الرجاء اختيار مدينتك"),
    email: emailValidation,
    ...passwordConfirmFields,
  })
  .refine(passwordConfirmRefine.validator, passwordConfirmRefine.params);

export const skillsSchema = z.object({
  offeredSkills: z
    .array(z.string())
    .min(1, "يرجى اختيار مهارة واحدة على الأقل تقدمها")
    .max(5, "يرجى اختيار خمس مهارات كحد أقصى"),
  requiredSkills: z
    .array(z.string())
    .min(1, "يرجى اختيار مهارة واحدة على الأقل تحتاجها")
    .max(5, "يرجى اختيار خمس مهارات كحد أقصى"),
});

export const signupSchema = z.intersection(basicInfoSchema, skillsSchema);

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const forgotPasswordSchema = z.object({
  email: emailValidation,
});

export const resetPasswordSchema = z
  .object({ ...passwordConfirmFields })
  .refine(passwordConfirmRefine.validator, passwordConfirmRefine.params);

// Automatically infer the TypeScript type from the Zod schema to maintain a Single Source of Truth
export type BasicInfoSchema = z.infer<typeof basicInfoSchema>;
export type skillsSchema = z.infer<typeof skillsSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
