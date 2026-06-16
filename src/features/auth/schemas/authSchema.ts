import { z } from "zod";


export const emailValidation = z
  .string()
  .trim()
  .min(1, "البريد الإلكتروني مطلوب")
  .email("البريد الإلكتروني غير صحيح");

export const passwordValidation = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 رموز على الأقل")
  .max(100)
  .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
  .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
  .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
  .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل (@#$...)");

export const nameValidation = z
  .string()
  .trim()
  .min(1, "الاسم كامل مطلوب")
  .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
  .max(100)
  .regex(
    /^[a-zA-Z\u0600-\u06FF\s]+$/,
    "الاسم يجب أن يحتوي على حروف فقط وبدون أرقام",
  );

export const usernameValidation = z
  .string()
  .trim()
  .min(1, "اسم المستخدم مطلوب")
  .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
  .max(50)
  .regex(
    /^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9\d\W_]+$/,
    "يجب أن يحتوي اسم المستخدم على 3 حروف إنجليزية على الأقل، ويمكنك استخدام الأرقام والرموز",
  );

// Helper to reuse skills array validation
export const createSkillsArraySchema = (emptyMsg: string, maxMsg: string) =>
  z
    .array(z.string())
    .min(1, emptyMsg)
    .max(5, maxMsg);


//Reusable Password Match Logic

interface PasswordMatchFields {
  password?: string;
  confirmPassword?: string;
}

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


// Page & Feature Schemas

export const basicInfoSchema = z
  .object({
    username: usernameValidation,
    full_name: nameValidation,
    city: z.string().min(1, "الرجاء اختيار مدينتك"),
    email: emailValidation,
    ...passwordConfirmFields,
  })
  .refine(passwordConfirmRefine.validator, passwordConfirmRefine.params);

export const skillsSchema = z.object({
  offeredSkills: createSkillsArraySchema(
    "يرجى اختيار مهارة واحدة على الأقل تقدمها",
    "يرجى اختيار خمس مهارات كحد أقصى",
  ),
  requiredSkills: createSkillsArraySchema(
    "يرجى اختيار مهارة واحدة على الأقل تحتاجها",
    "يرجى اختيار خمس مهارات كحد أقصى",
  ),
  bio: z
    .string()
    .min(50, "السيرة الذاتية يجب أن تكون 50 حرف على الأقل")
    .max(500, "السيرة الذاتية يجب أن لا تتجاوز 500 حرف")
    .optional()
    .or(z.literal("")),
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

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "كلمة المرور القديمة مطلوبة"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "الرجاء تأكيد كلمة المرور الجديدة"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور الجديدتان غير متطابقتين",
    path: ["confirmPassword"],
  });

export const editProfileSchema = z.object({
  name: nameValidation.min(1, "الاسم الكامل مطلوب"), // Custom error message fallback
  bio: z
    .string()
    .max(250, "النبذة الشخصية يجب أن لا تتجاوز 250 حرفاً")
    .optional()
    .or(z.literal("")),
  servicesNeeded: createSkillsArraySchema(
    "يرجى اختيار مهارة واحدة على الأقل تحتاجها",
    "يرجى اختيار خمس مهارات كحد أقصى",
  ),
  servicesOffered: createSkillsArraySchema(
    "يرجى اختيار مهارة واحدة على الأقل تقدمها",
    "يرجى اختيار خمس مهارات كحد أقصى",
  ),
});

// Inferred TypeScript Types
export type BasicInfoSchema = z.infer<typeof basicInfoSchema>;
export type skillsSchema = z.infer<typeof skillsSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;