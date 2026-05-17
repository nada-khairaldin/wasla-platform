import { z } from "zod";

export const createServiceSchema = z.object({
  serviceType: z.enum(["offer", "request"]),
  title: z.string()
    .min(5, { message: "عنوان الخدمة قصير جداً، يجب أن يكون 5 أحرف على الأقل" })
    .max(80, { message: "العنوان طويل جداً" }),
  description: z.string()
    .min(20, { message: "يرجى كتابة وصف مفصل لا يقل عن 20 حرفاً" }),
  category: z.string().min(1, { message: "يرجى اختيار المجال" }),
  deliveryType: z.enum(["offline", "online"]),
  hours: z.number().min(1).max(24),
});

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;