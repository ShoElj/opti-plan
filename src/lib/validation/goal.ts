import { z } from "zod";

export const goalInputSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100, "Goal name is too long"),
  target_amount: z.number().positive("Target amount must be greater than zero"),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Target date must be YYYY-MM-DD").optional(),
  currency_code: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
});

export type GoalInput = z.infer<typeof goalInputSchema>;
