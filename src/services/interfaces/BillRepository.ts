import { Result } from "@/lib/errors";
import { BillInput } from "@/lib/validation/bill";

export interface BillRecord extends BillInput {
  id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IBillRepository {
  getById(id: string): Promise<Result<BillRecord | null>>;
  getByUserId(userId: string): Promise<Result<BillRecord[]>>;
  create(userId: string, input: BillInput): Promise<Result<BillRecord>>;
}
