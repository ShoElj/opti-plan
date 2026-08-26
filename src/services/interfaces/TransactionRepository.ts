import { Result } from "@/lib/errors";
import { TransactionInput } from "@/lib/validation/transaction";

export interface TransactionRecord extends TransactionInput {
  id: string;
  user_id: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ITransactionRepository {
  getById(id: string): Promise<Result<TransactionRecord | null>>;
  getByUserId(userId: string): Promise<Result<TransactionRecord[]>>;
  create(userId: string, input: TransactionInput): Promise<Result<TransactionRecord>>;
  delete(id: string, userId: string): Promise<Result<void>>;
}
