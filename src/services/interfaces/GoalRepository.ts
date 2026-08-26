import { Result } from "@/lib/errors";
import { GoalInput } from "@/lib/validation/goal";

export interface GoalRecord extends GoalInput {
  id: string;
  user_id: string;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
}

export interface IGoalRepository {
  getById(id: string): Promise<Result<GoalRecord | null>>;
  getByUserId(userId: string): Promise<Result<GoalRecord[]>>;
  create(userId: string, input: GoalInput): Promise<Result<GoalRecord>>;
}
