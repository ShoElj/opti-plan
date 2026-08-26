import { z } from "zod";
import { isValidTransactionInvariant } from "@/domain/transactions/invariant";

export const transactionInputSchema = z
  .object({
    amount: z
      .number({ message: "Amount must be a number" })
      .positive("Amount must be greater than zero"),
    currency_code: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
    type: z.enum(["inflow", "outflow"]),
    classification: z.enum(["income", "expense", "savings", "debt", "transfer"]),
    category: z.string().min(1, "Category is required"),
    transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    note: z.string().max(250, "Note must be under 250 characters").optional(),
  })
  .refine((data) => isValidTransactionInvariant(data.type, data.classification), {
    message: "Invalid transaction type and classification pairing",
    path: ["classification"],
  });

export type TransactionInput = z.infer<typeof transactionInputSchema>;
