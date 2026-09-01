import { z } from "zod";
import { isValidTransactionInvariant } from "@/domain/transactions/invariant";

export const transactionInputSchema = z
  .object({
    amount: z
      .number({ message: "Amount must be a number" })
      .positive("Amount must be greater than zero"),
    currency_code: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
    flow_direction: z.enum(["inflow", "outflow"]),
    type: z.enum(["income", "expense", "savings", "goal_contribution", "debt", "transfer"]),
    category: z.string().min(1, "Category is required"),
    transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    note: z.string().max(250, "Note must be under 250 characters").optional(),
  })
  .refine((data) => isValidTransactionInvariant(data.flow_direction, data.type), {
    message: "Invalid transaction flow and type pairing",
    path: ["type"],
  });

export type TransactionInput = z.infer<typeof transactionInputSchema>;
