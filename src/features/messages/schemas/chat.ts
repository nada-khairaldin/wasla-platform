import { z } from "zod";

export const contractSchema = z.object({
  contractId: z.string(),
  contractTitle: z.string(),
  providerName: z.string(),
  seekerName: z.string(),
  serviceMode: z.enum(["online", "offline"]),
  timeCredits: z.number().min(1),
  maxEndDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: "تاريخ الانتهاء يجب أن يكون في المستقبل",
  }),
});

export type ContractFormValues = z.infer<typeof contractSchema>;
