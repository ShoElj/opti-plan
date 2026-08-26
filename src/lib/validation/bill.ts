import { z } from "zod";

export const billInputSchema = z.object({
  name: z.string().min(1, "Bill name is required").max(100, "Bill name is too long"),
  expected_amount: z.number().positive("Expected amount must be greater than zero"),
  frequency: z.enum(["weekly", "biweekly", "monthly", "yearly", "custom"]).default("monthly"),
  due_day_of_month: z.number().min(1).max(31).optional(),
  category: z.string().min(1, "Category is required"),
  currency_code: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
});

export type BillInput = z.infer<typeof billInputSchema>;
